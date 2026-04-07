import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { supabase as publicSupabase } from "../../../lib/supabase";
import type { Database } from "../../../types/database";

// Service role client — bypasses RLS. User identity is already validated by middleware.
// Using service role instead of session JWT because PostgREST on this Supabase instance
// does not properly recognize user session JWTs (role "" does not exist error).
function getSupabaseAdmin() {
    const url =
        process.env.SUPABASE_INTERNAL_URL ||
        process.env.PUBLIC_SUPABASE_URL ||
        "";
    const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.PUBLIC_SUPABASE_ANON_KEY ||
        "";
    if (!url || !key) throw new Error("[create-invoice] Supabase config missing");
    return createClient<Database>(url, key);
}

export const POST: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body: { type?: string; item_id?: string; course_id?: string };
    try {
        body = await context.request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Trim whitespace from all input values to prevent lookup failures
    const type = body.type?.trim();
    const item_id = body.item_id?.trim();
    const course_id = body.course_id?.trim();

    if (!type || !item_id || !course_id) {
        return new Response(
            JSON.stringify({ error: "type, item_id, dan course_id wajib diisi" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (type !== "course" && type !== "module") {
        return new Response(
            JSON.stringify({ error: "type harus 'course' atau 'module'" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const xenditApiKey = process.env.XENDIT_API_KEY;
    const siteUrl = process.env.PUBLIC_SITE_URL || "https://hashiwaacademy.id";

    if (!xenditApiKey) {
        console.error("[create-invoice] XENDIT_API_KEY not configured");
        return new Response(
            JSON.stringify({ error: "Payment gateway belum dikonfigurasi" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    const supabaseServer = getSupabaseAdmin();

    // --- 1. Ambil detail kursus ---
    // Use PUBLIC client (no RLS restriction) for reading classes — classes has SELECT USING (true)
    // but server client might fail if session/token is invalid or RLS not properly configured
    console.log(`[create-invoice] Looking up course_id: "${course_id}", type: "${type}", item_id: "${item_id}"`);
    console.log(`[create-invoice] User: ${user.id} (${user.email})`);

    let course: any = null;
    let courseError: any = null;

    // Try with public client first (most reliable for public data)
    const publicResult = await publicSupabase
        .from("classes")
        .select("id, title, price")
        .eq("id", course_id)
        .single();

    course = publicResult.data;
    courseError = publicResult.error;

    console.log(`[create-invoice] Public client result - course:`, JSON.stringify(course), `error:`, JSON.stringify(courseError));

    // If public client fails, try server client as fallback
    if (courseError || !course) {
        console.warn(`[create-invoice] Public client failed, trying server client...`);
        const serverResult = await supabaseServer
            .from("classes")
            .select("id, title, price")
            .eq("id", course_id)
            .single();
        
        course = serverResult.data;
        courseError = serverResult.error;
        console.log(`[create-invoice] Server client result - course:`, JSON.stringify(course), `error:`, JSON.stringify(courseError));
    }

    if (courseError || !course) {
        console.error(`[create-invoice] Course NOT FOUND with both clients! course_id="${course_id}"`);
        return new Response(JSON.stringify({ 
            error: "Kursus tidak ditemukan",
            debug_course_id: course_id,
            debug_error: courseError?.message || "No data returned",
            debug_error_code: courseError?.code || "unknown"
        }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    // --- 2. Tentukan jumlah & deskripsi berdasarkan type ---
    let amount = 0;
    let description = "";
    let module_id: string | null = null;

    if (type === "course") {
        amount = course.price ?? 0;
        description = `Pembayaran Kursus: ${course.title}`;

        // Cek apakah sudah terdaftar (user-scoped → use server client)
        const { data: existing } = await supabaseServer
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("class_id", course_id)
            .maybeSingle();

        if (existing) {
            return new Response(
                JSON.stringify({ error: "Anda sudah terdaftar di kursus ini" }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
    } else {
        // type === "module" — modules are public data
        const { data: mod, error: moduleError } = await publicSupabase
            .from("modules")
            .select("id, title, price")
            .eq("id", item_id)
            .eq("class_id", course_id)
            .single();

        if (moduleError || !mod) {
            return new Response(
                JSON.stringify({ error: "Modul tidak ditemukan" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        amount = mod.price ?? 0;
        description = `Pembayaran Modul: ${mod.title} — ${course.title}`;
        module_id = item_id;

        // Cek apakah sudah membeli modul ini (user-scoped → server client)
        const { data: existing } = await supabaseServer
            .from("module_enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("module_id", item_id)
            .maybeSingle();

        if (existing) {
            return new Response(
                JSON.stringify({ error: "Anda sudah memiliki akses ke modul ini" }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
    }

    if (amount <= 0) {
        return new Response(
            JSON.stringify({ error: "Item ini gratis, tidak perlu pembayaran" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    // --- 3. Cek apakah ada pending payment yang belum selesai ---
    // Note: Supabase query builder is immutable — chain must be built in one expression
    const baseQuery = supabaseServer
        .from("payments")
        .select("id, xendit_invoice_url")
        .eq("user_id", user.id)
        .eq("class_id", course_id)
        .eq("status", "pending");

    const { data: pendingPayment } = await (
        module_id
            ? baseQuery.eq("module_id", module_id)
            : baseQuery.is("module_id", null)
    ).maybeSingle() as { data: any };

    if (pendingPayment?.xendit_invoice_url) {
        // Kembalikan invoice yang sudah ada daripada buat baru
        return new Response(
            JSON.stringify({
                invoice_url: pendingPayment.xendit_invoice_url,
                payment_id: pendingPayment.id,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }

    // --- 4. Buat record payment pending di database ---
    const { data: payment, error: paymentError } = await supabaseServer
        .from("payments")
        .insert({
            user_id: user.id,
            class_id: course_id,
            module_id: module_id,
            payment_type: type as "course" | "module",
            amount: amount,
            status: "pending",
        } as any)
        .select()
        .single();

    if (paymentError || !payment) {
        console.error("[create-invoice] DB insert error:", paymentError);
        return new Response(
            JSON.stringify({ 
                error: "Gagal membuat record pembayaran",
                debug_error: paymentError?.message || "Unknown insert error"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    const paymentRecord = payment as any;

    // --- 5. Buat Xendit Invoice ---
    const xenditPayload = {
        external_id: paymentRecord.id,
        amount: amount,
        description: description,
        invoice_duration: 86400, // 24 jam
        customer: {
            given_names: user.name,
            email: user.email,
        },
        currency: "IDR",
        success_redirect_url: `${siteUrl}/payment/success?id=${paymentRecord.id}`,
        failure_redirect_url: `${siteUrl}/payment/failed?id=${paymentRecord.id}`,
        items: [
            {
                name: description,
                quantity: 1,
                price: amount,
            },
        ],
    };

    let xenditData: any;
    try {
        const xenditRes = await fetch("https://api.xendit.co/v2/invoices", {
            method: "POST",
            headers: {
                Authorization: `Basic ${btoa(xenditApiKey + ":")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(xenditPayload),
        });

        if (!xenditRes.ok) {
            const xenditErr = await xenditRes.json();
            console.error("[create-invoice] Xendit error:", xenditErr);
            // Hapus pending payment yang baru dibuat
            await supabaseServer.from("payments").delete().eq("id", paymentRecord.id);
            return new Response(
                JSON.stringify({
                    error: "Gagal membuat invoice pembayaran",
                    details: xenditErr.message || xenditErr.error_code,
                }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        xenditData = await xenditRes.json();
    } catch (fetchErr) {
        console.error("[create-invoice] Network error calling Xendit:", fetchErr);
        await supabaseServer.from("payments").delete().eq("id", paymentRecord.id);
        return new Response(
            JSON.stringify({ error: "Tidak dapat menghubungi payment gateway" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    // --- 6. Update payment record dengan data Xendit ---
    await (supabaseServer as any)
        .from("payments")
        .update({
            xendit_invoice_id: xenditData.id,
            xendit_invoice_url: xenditData.invoice_url,
        })
        .eq("id", paymentRecord.id);

    console.log(
        `[create-invoice] Invoice created: payment=${paymentRecord.id} xendit=${xenditData.id}`
    );

    return new Response(
        JSON.stringify({
            invoice_url: xenditData.invoice_url,
            payment_id: paymentRecord.id,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};

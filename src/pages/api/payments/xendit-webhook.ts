import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../types/database";

// Webhook pakai anon key — RLS dinonaktifkan di database ini sehingga
// anon key punya akses penuh. Internal URL dipakai agar tidak lewat internet.
function getSupabaseAdmin() {
    const url =
        process.env.SUPABASE_INTERNAL_URL ||
        process.env.PUBLIC_SUPABASE_URL ||
        "";
    const key = process.env.PUBLIC_SUPABASE_ANON_KEY || "";

    if (!url || !key) {
        throw new Error("[xendit-webhook] Supabase config missing");
    }
    return createClient<Database>(url, key);
}

export const POST: APIRoute = async ({ request }) => {
    // --- 1. Verifikasi Xendit Callback Token ---
    const callbackToken = request.headers.get("x-callback-token");
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (!expectedToken) {
        console.error("[xendit-webhook] XENDIT_WEBHOOK_TOKEN not configured");
        return new Response("Server misconfigured", { status: 500 });
    }

    if (!callbackToken || callbackToken !== expectedToken) {
        console.warn("[xendit-webhook] Invalid callback token");
        return new Response("Unauthorized", { status: 401 });
    }

    // --- 2. Parse payload ---
    let payload: any;
    try {
        payload = await request.json();
    } catch {
        return new Response("Invalid JSON", { status: 400 });
    }

    const { external_id, status, id: xendit_invoice_id, paid_at, payment_method, payment_channel, amount } = payload;

    console.log(
        `[xendit-webhook] Received: external_id=${external_id} status=${status} xendit_id=${xendit_invoice_id}`
    );

    if (!external_id) {
        return new Response("Missing external_id", { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // --- 3. Cari payment record berdasarkan external_id (= payment.id) ---
    const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("id", external_id)
        .single();

    if (paymentError || !payment) {
        console.error("[xendit-webhook] Payment not found:", external_id);
        // Return 200 agar Xendit tidak retry terus-menerus
        return new Response("Payment not found", { status: 200 });
    }

    // --- 4. Idempotency: skip jika sudah diproses ---
    if (payment.status === "completed") {
        console.log("[xendit-webhook] Already processed, skipping:", external_id);
        return new Response("OK", { status: 200 });
    }

    // --- 5. Proses berdasarkan status Xendit ---
    if (status === "PAID") {
        // Update status payment ke completed
        const { error: updateError } = await supabase
            .from("payments")
            .update({
                status: "completed",
                paid_at: paid_at || new Date().toISOString(),
                xendit_invoice_id: xendit_invoice_id,
            })
            .eq("id", external_id);

        if (updateError) {
            console.error("[xendit-webhook] Failed to update payment:", updateError);
            return new Response("DB update failed", { status: 500 });
        }

        // --- 6. Buat enrollment berdasarkan payment_type ---
        if (payment.payment_type === "course" && payment.class_id) {
            // Cek duplikat sebelum insert
            const { data: existingEnroll } = await supabase
                .from("enrollments")
                .select("id")
                .eq("user_id", payment.user_id)
                .eq("class_id", payment.class_id)
                .maybeSingle();

            if (!existingEnroll) {
                const { error: enrollError } = await supabase
                    .from("enrollments")
                    .insert({
                        user_id: payment.user_id,
                        class_id: payment.class_id,
                        status: "active",
                    });

                if (enrollError) {
                    console.error("[xendit-webhook] Failed to create enrollment:", enrollError);
                }
            }
        } else if (payment.payment_type === "module" && payment.module_id && payment.class_id) {
            // Cek duplikat sebelum insert
            const { data: existingModEnroll } = await supabase
                .from("module_enrollments")
                .select("id")
                .eq("user_id", payment.user_id)
                .eq("module_id", payment.module_id)
                .maybeSingle();

            if (!existingModEnroll) {
                const { error: modEnrollError } = await supabase
                    .from("module_enrollments")
                    .insert({
                        user_id: payment.user_id,
                        module_id: payment.module_id,
                        class_id: payment.class_id,
                        amount: payment.amount,
                        status: "active",
                    });

                if (modEnrollError) {
                    console.error("[xendit-webhook] Failed to create module enrollment:", modEnrollError);
                }
            }
        }

        console.log(
            `[xendit-webhook] Payment completed: payment=${external_id} type=${payment.payment_type}`
        );
    } else if (status === "EXPIRED") {
        await supabase
            .from("payments")
            .update({ status: "expired" })
            .eq("id", external_id);

        console.log(`[xendit-webhook] Payment expired: ${external_id}`);
    } else if (status === "FAILED") {
        await supabase
            .from("payments")
            .update({ status: "failed" })
            .eq("id", external_id);

        console.log(`[xendit-webhook] Payment failed: ${external_id}`);
    } else {
        // Status lain (PENDING, dll) — tidak perlu aksi
        console.log(`[xendit-webhook] Unhandled status ${status} for ${external_id}`);
    }

    return new Response("OK", { status: 200 });
};

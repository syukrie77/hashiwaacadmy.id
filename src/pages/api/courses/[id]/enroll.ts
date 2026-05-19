import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../../types/database";

function getSupabaseAdmin() {
    const url =
        process.env.SUPABASE_INTERNAL_URL ||
        process.env.PUBLIC_SUPABASE_URL ||
        import.meta.env.PUBLIC_SUPABASE_URL ||
        "";
    const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.PUBLIC_SUPABASE_ANON_KEY ||
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
        "";
    if (!url || !key) throw new Error("[enroll] Supabase config missing");
    return createClient<Database>(url, key);
}

// POST /api/courses/[id]/enroll — free course enrollment
export const POST: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const courseId = context.params.id;
    if (!courseId) {
        return new Response(JSON.stringify({ error: "Course ID tidak valid" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const supabase = getSupabaseAdmin();

    // Pastikan kursus ada dan gratis
    const { data: course, error: courseError } = await supabase
        .from("classes")
        .select("id, price")
        .eq("id", courseId)
        .single();

    if (courseError || !course) {
        return new Response(JSON.stringify({ error: "Kursus tidak ditemukan" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (course.price && course.price > 0) {
        return new Response(
            JSON.stringify({ error: "Kursus ini berbayar, gunakan alur pembayaran" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    // Cek apakah sudah terdaftar
    const { data: existing } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("class_id", courseId)
        .maybeSingle();

    if (existing) {
        return new Response(
            JSON.stringify({ error: "Anda sudah terdaftar di kursus ini" }),
            { status: 409, headers: { "Content-Type": "application/json" } }
        );
    }

    // Daftarkan user
    const { error: insertError } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, class_id: courseId, status: "active" } as any);

    if (insertError) {
        console.error("[enroll] Insert error:", insertError);
        return new Response(
            JSON.stringify({ error: insertError.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../types/database";

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
    if (!url || !key) throw new Error("[progress] Supabase config missing");
    return createClient<Database>(url, key);
}

// POST /api/progress/[materialId] — mark material as completed
export const POST: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const materialId = context.params.materialId;
    if (!materialId) {
        return new Response(JSON.stringify({ error: "Material ID tidak valid" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await (supabase.from("progress") as any).upsert(
        {
            user_id: user.id,
            material_id: materialId,
            completed: true,
            completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,material_id" },
    );

    if (error) {
        console.error("[progress] Upsert error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

const ALLOWED_TABLES = ["modules", "materials", "assignments", "exams"];

// DELETE /api/builder/[table]/[id]
export const DELETE: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { table, id } = context.params;
    if (!ALLOWED_TABLES.includes(table!)) {
        return new Response(JSON.stringify({ error: "Invalid table" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { error } = await (supabase as any).from(table).delete().eq("id", id);

    if (error) {
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

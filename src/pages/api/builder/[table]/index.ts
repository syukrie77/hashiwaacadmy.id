import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

const ALLOWED_TABLES = ["modules", "materials", "assignments", "exams"];

// POST /api/builder/[table] — upsert a row
export const POST: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { table } = context.params;
    if (!ALLOWED_TABLES.includes(table!)) {
        return new Response(JSON.stringify({ error: "Invalid table" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    let data: Record<string, unknown>;
    try {
        data = await context.request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { error } = await (supabase as any).from(table).upsert(data);

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

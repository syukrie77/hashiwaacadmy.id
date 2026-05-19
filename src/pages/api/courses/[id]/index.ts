import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

// PATCH /api/courses/[id] — update owner_id or is_active
export const PATCH: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { id } = context.params;
    let body: Record<string, unknown>;
    try {
        body = await context.request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Only allow updating these fields
    const allowed = ["owner_id", "is_active"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
        if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
        return new Response(JSON.stringify({ error: "No valid fields to update" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { data, error } = await (supabase as any)
        .from("classes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ course: data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

// DELETE /api/courses/[id]
export const DELETE: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { id } = context.params;

    const { error } = await (supabase as any)
        .from("classes")
        .delete()
        .eq("id", id);

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

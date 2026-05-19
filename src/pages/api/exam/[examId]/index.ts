import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

// GET /api/exam/[examId] — exam details
export const GET: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });

    const { examId } = context.params;
    const { data: exam, error } = await (supabase as any).from("exams").select("*").eq("id", examId).single();
    if (error || !exam) return new Response(JSON.stringify({ error: "Exam not found" }), { status: 404, headers: { "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ exam }), { status: 200, headers: { "Content-Type": "application/json" } });
};

// PATCH /api/exam/[examId] — update exam (title, description, duration, passing_score, is_published)
export const PATCH: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const { examId } = context.params;
    const body = await context.request.json();
    const allowed = ["title", "description", "duration", "passing_score", "is_published"];
    const updates: Record<string, unknown> = {};
    for (const k of allowed) { if (k in body) updates[k] = body[k]; }

    const { error } = await (supabase as any).from("exams").update(updates).eq("id", examId);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

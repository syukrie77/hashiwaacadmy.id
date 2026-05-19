import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

// DELETE /api/exam/questions/[questionId]
export const DELETE: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const { questionId } = context.params;
    await (supabase as any).from("question_options").delete().eq("question_id", questionId);
    const { error } = await (supabase as any).from("questions").delete().eq("id", questionId);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

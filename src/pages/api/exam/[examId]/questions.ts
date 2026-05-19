import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

// GET /api/exam/[examId]/questions — questions with options
export const GET: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });

    const { examId } = context.params;
    const { data, error } = await (supabase as any)
        .from("questions")
        .select("*, question_options(*)")
        .eq("exam_id", examId)
        .order("order_no", { ascending: true });

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ questions: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
};

// POST /api/exam/[examId]/questions — add or update question with options
export const POST: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const { examId } = context.params;
    const body = await context.request.json();
    const { editingId, qData, options } = body;

    let questionId: string;

    if (editingId) {
        // Delete old options then update question
        await (supabase as any).from("question_options").delete().eq("question_id", editingId);
        const { error } = await (supabase as any).from("questions").update(qData).eq("id", editingId);
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        questionId = editingId;
    } else {
        const { data, error } = await (supabase as any)
            .from("questions")
            .insert({ ...qData, exam_id: examId })
            .select("id")
            .single();
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        questionId = data.id;
    }

    // Insert options if MCQ
    if (options && options.length > 0) {
        const opts = options.map((o: any) => ({ ...o, question_id: questionId }));
        const { error: optError } = await (supabase as any).from("question_options").insert(opts);
        if (optError) return new Response(JSON.stringify({ error: optError.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, questionId }), { status: 200, headers: { "Content-Type": "application/json" } });
};

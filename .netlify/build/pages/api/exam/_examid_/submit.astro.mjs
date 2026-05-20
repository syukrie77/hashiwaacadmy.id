import { s as supabase } from '../../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../../renderers.mjs';

const POST = async (context) => {
  const user = context.locals.user;
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
  const { examId } = context.params;
  const body = await context.request.json();
  if (body.action === "start") {
    const { data: existing } = await supabase.from("exam_submissions").select("*").eq("user_id", user.id).eq("exam_id", examId).maybeSingle();
    if (existing) return new Response(JSON.stringify({ submission: existing }), { status: 200, headers: { "Content-Type": "application/json" } });
    await supabase.from("users").upsert({ id: user.id, name: user.name, email: user.email, role: user.role }, { onConflict: "id", ignoreDuplicates: true });
    const { data: newSub, error } = await supabase.from("exam_submissions").insert({ exam_id: examId, user_id: user.id, status: "in_progress", started_at: (/* @__PURE__ */ new Date()).toISOString() }).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ submission: newSub }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  if (body.action === "submit") {
    const { submissionId, answers } = body;
    if (answers?.length) {
      const { error: ansError } = await supabase.from("submission_answers").insert(answers);
      if (ansError) return new Response(JSON.stringify({ error: ansError.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    const { data: questions } = await supabase.from("questions").select("*, question_options(id, is_correct)").eq("exam_id", examId);
    if (questions && answers?.length) {
      for (const ans of answers) {
        const q = questions.find((q2) => q2.id === ans.question_id);
        if (!q) continue;
        let isCorrect = false;
        let pointsAwarded = 0;
        if (q.type === "multiple_choice" && ans.selected_option_id) {
          const correctOpt = q.question_options?.find((o) => o.is_correct);
          if (correctOpt && ans.selected_option_id === correctOpt.id) {
            isCorrect = true;
            pointsAwarded = q.points || 10;
          }
        } else if (q.type === "true_false" && ans.answer_text) {
          if (ans.answer_text === q.correct_answer) {
            isCorrect = true;
            pointsAwarded = q.points || 10;
          }
        } else continue;
        await supabase.from("submission_answers").update({ is_correct: isCorrect, points_awarded: pointsAwarded }).eq("submission_id", submissionId).eq("question_id", ans.question_id);
      }
    }
    await supabase.from("exam_submissions").update({ status: "submitted", submitted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", submissionId);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

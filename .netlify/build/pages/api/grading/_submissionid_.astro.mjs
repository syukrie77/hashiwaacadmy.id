import { s as supabase } from '../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  const { submissionId } = context.params;
  const { data: submission, error: subError } = await supabase.from("exam_submissions").select("*, users:user_id(name, email)").eq("id", submissionId).single();
  if (subError || !submission) return new Response(JSON.stringify({ error: "Submission tidak ditemukan" }), { status: 404, headers: { "Content-Type": "application/json" } });
  const examId = submission.exam_id;
  const [{ data: questions }, { data: answers }] = await Promise.all([
    supabase.from("questions").select("*, question_options(*)").eq("exam_id", examId).order("order_no", { ascending: true }),
    supabase.from("submission_answers").select("*, question_options:selected_option_id(option_text)").eq("submission_id", submissionId)
  ]);
  return new Response(JSON.stringify({ submission, questions: questions || [], answers: answers || [] }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  const { submissionId } = context.params;
  const { grades, isFinal, examId, userId, finalScore } = await context.request.json();
  for (const g of grades) {
    const upd = { feedback: g.feedback || null };
    if (g.points_awarded !== void 0 && g.points_awarded !== null) {
      upd.points_awarded = g.points_awarded;
      upd.is_correct = g.is_correct;
    }
    await supabase.from("submission_answers").update(upd).eq("id", g.answerId);
  }
  if (isFinal) {
    await supabase.from("exam_submissions").update({
      status: "graded",
      score: finalScore,
      graded_at: (/* @__PURE__ */ new Date()).toISOString(),
      graded_by: user.id
    }).eq("id", submissionId);
    await supabase.from("results").upsert({
      exam_id: examId,
      user_id: userId,
      score: finalScore
    }, { onConflict: "exam_id,user_id" });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

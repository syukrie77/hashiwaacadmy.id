import { s as supabase } from '../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async (context) => {
  const user = context.locals.user;
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
  const { examId } = context.params;
  const { data: exam, error } = await supabase.from("exams").select("*").eq("id", examId).single();
  if (error || !exam) return new Response(JSON.stringify({ error: "Exam not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ exam }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const PATCH = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  const { examId } = context.params;
  const body = await context.request.json();
  const allowed = ["title", "description", "duration", "passing_score", "is_published"];
  const updates = {};
  for (const k of allowed) {
    if (k in body) updates[k] = body[k];
  }
  const { error } = await supabase.from("exams").update(updates).eq("id", examId);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    PATCH
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

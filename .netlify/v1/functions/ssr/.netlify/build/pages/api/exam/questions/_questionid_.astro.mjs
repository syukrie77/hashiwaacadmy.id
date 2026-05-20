import { s as supabase } from '../../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../../renderers.mjs';

const DELETE = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  const { questionId } = context.params;
  await supabase.from("question_options").delete().eq("question_id", questionId);
  const { error } = await supabase.from("questions").delete().eq("id", questionId);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

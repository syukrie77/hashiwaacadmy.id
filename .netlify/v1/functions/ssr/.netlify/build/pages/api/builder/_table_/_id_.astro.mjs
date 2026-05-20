import { s as supabase } from '../../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../../renderers.mjs';

const ALLOWED_TABLES = ["modules", "materials", "assignments", "exams"];
const DELETE = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { table, id } = context.params;
  if (!ALLOWED_TABLES.includes(table)) {
    return new Response(JSON.stringify({ error: "Invalid table" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

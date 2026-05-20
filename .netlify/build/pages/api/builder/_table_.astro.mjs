import { s as supabase } from '../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../renderers.mjs';

const ALLOWED_TABLES = ["modules", "materials", "assignments", "exams"];
const POST = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { table } = context.params;
  if (!ALLOWED_TABLES.includes(table)) {
    return new Response(JSON.stringify({ error: "Invalid table" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let data;
  try {
    data = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { error } = await supabase.from(table).upsert(data);
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
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

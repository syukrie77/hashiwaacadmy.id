import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_INTERNAL_URL || process.env.PUBLIC_SUPABASE_URL || "https://api.hashiwaacademy.id";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTI2NDA3LCJleHAiOjE5Mjk2MDY0MDd9.gnS8W2NYNTLlqpR-ewzn8L2Lm2kdsnV3LVDY9wqj-kM";
  return createClient(url, key);
}
const POST = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const materialId = context.params.materialId;
  if (!materialId) {
    return new Response(JSON.stringify({ error: "Material ID tidak valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("progress").upsert(
    {
      user_id: user.id,
      material_id: materialId,
      completed: true,
      completed_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "user_id,material_id" }
  );
  if (error) {
    console.error("[progress] Upsert error:", error);
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

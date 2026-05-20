import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../../renderers.mjs';

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
  const courseId = context.params.id;
  if (!courseId) {
    return new Response(JSON.stringify({ error: "Course ID tidak valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabase = getSupabaseAdmin();
  const { data: course, error: courseError } = await supabase.from("classes").select("id, price").eq("id", courseId).single();
  if (courseError || !course) {
    return new Response(JSON.stringify({ error: "Kursus tidak ditemukan" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (course.price && course.price > 0) {
    return new Response(
      JSON.stringify({ error: "Kursus ini berbayar, gunakan alur pembayaran" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const { data: existing } = await supabase.from("enrollments").select("id").eq("user_id", user.id).eq("class_id", courseId).maybeSingle();
  if (existing) {
    return new Response(
      JSON.stringify({ error: "Anda sudah terdaftar di kursus ini" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }
  const { error: insertError } = await supabase.from("enrollments").insert({ user_id: user.id, class_id: courseId, status: "active" });
  if (insertError) {
    console.error("[enroll] Insert error:", insertError);
    return new Response(
      JSON.stringify({ error: insertError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
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

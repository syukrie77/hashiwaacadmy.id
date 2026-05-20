import { s as supabase } from '../../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../../renderers.mjs';

const GET = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { id } = context.params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Course ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const [
    { data: course },
    { data: modules },
    { data: materials },
    { data: assignments },
    { data: exams }
  ] = await Promise.all([
    supabase.from("classes").select("*").eq("id", id).single(),
    supabase.from("modules").select("*").eq("class_id", id).order("order_no"),
    supabase.from("materials").select("*, modules!inner(class_id)").eq("modules.class_id", id).order("order_no"),
    supabase.from("assignments").select("*").eq("class_id", id),
    supabase.from("exams").select("*").eq("class_id", id)
  ]);
  if (!course) {
    return new Response(JSON.stringify({ error: "Course not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (user.role === "instructor" && course.owner_id !== user.id) {
    return new Response(JSON.stringify({ error: "Access denied" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(
    JSON.stringify({ course, modules, materials, assignments, exams }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

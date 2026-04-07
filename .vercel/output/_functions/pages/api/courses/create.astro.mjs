import { s as supabase } from '../../../chunks/supabase_CLFJcle_.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async (context) => {
  const user = context.locals.user;
  console.log("[API /courses/create] user from middleware:", JSON.stringify(user));
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(
      JSON.stringify({
        error: "Unauthorized. Admin or instructor role required.",
        debug_user: user || null
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
  const formData = await context.request.formData();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || "";
  const price = parseFloat(formData.get("price")?.toString() || "0");
  if (!title) {
    return new Response(
      JSON.stringify({ error: "Course title is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const { data, error } = await supabase.from("classes").insert([
    {
      title,
      description,
      price,
      owner_id: user.id,
      is_active: false
    }
  ]).select().single();
  if (error) {
    console.error("Error creating course:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(
    JSON.stringify({ message: "Course created successfully", course: data }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

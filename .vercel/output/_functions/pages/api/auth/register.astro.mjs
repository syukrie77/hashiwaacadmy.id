import { g as getSupabaseServerClient } from '../../../chunks/supabase_CLFJcle_.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async (context) => {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString() || "";
  const role = "student";
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (password.length < 6) {
    return new Response(
      JSON.stringify({ error: "Password harus minimal 6 karakter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const supabase = getSupabaseServerClient(context);
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      name,
      email,
      role
    });
    if (profileError) {
      console.error("Profile creation error:", profileError);
    }
  }
  return new Response(
    JSON.stringify({ message: "Registration successful" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

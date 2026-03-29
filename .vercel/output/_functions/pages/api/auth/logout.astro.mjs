import { g as getSupabaseServerClient } from '../../../chunks/supabase_DDcE5sYV.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async (context) => {
  const supabase = getSupabaseServerClient(context);
  const { error } = await supabase.auth.signOut();
  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(
    JSON.stringify({ message: "Logout successful" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

function getAdminClient() {
  const url = process.env.SUPABASE_INTERNAL_URL || process.env.PUBLIC_SUPABASE_URL || "https://api.hashiwaacademy.id";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!serviceKey) {
    throw new Error("[register] SUPABASE_SERVICE_ROLE_KEY tidak dikonfigurasi");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
const POST = async (context) => {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString()?.trim();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString()?.trim() || "";
  const role = "student";
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email dan password wajib diisi" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (password.length < 6) {
    return new Response(
      JSON.stringify({ error: "Password harus minimal 6 karakter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  let adminClient;
  try {
    adminClient = getAdminClient();
  } catch (configErr) {
    console.error("[register] Config error:", configErr.message);
    return new Response(
      JSON.stringify({ error: "Konfigurasi server tidak lengkap. Hubungi admin." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role }
  });
  if (error) {
    console.error("[register] Auth admin createUser error:", error.message);
    if (error.message.toLowerCase().includes("already") || error.status === 422) {
      return new Response(
        JSON.stringify({ error: "Email sudah terdaftar" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (data.user) {
    const { error: profileError } = await adminClient.from("users").upsert({
      id: data.user.id,
      name: name || email.split("@")[0],
      email,
      role
    }, { onConflict: "id" });
    if (profileError) {
      console.error("[register] Profile upsert error:", profileError.message);
    }
  }
  return new Response(
    JSON.stringify({ message: "Registrasi berhasil! Silakan login." }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

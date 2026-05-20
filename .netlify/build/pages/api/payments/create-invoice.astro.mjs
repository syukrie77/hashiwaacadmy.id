import { createClient } from '@supabase/supabase-js';
import { s as supabase } from '../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../renderers.mjs';

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_INTERNAL_URL || process.env.PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) throw new Error("[create-invoice] Supabase config missing");
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
  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const type = body.type?.trim();
  const item_id = body.item_id?.trim();
  const course_id = body.course_id?.trim();
  if (!type || !item_id || !course_id) {
    return new Response(
      JSON.stringify({ error: "type, item_id, dan course_id wajib diisi" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (type !== "course" && type !== "module") {
    return new Response(
      JSON.stringify({ error: "type harus 'course' atau 'module'" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const xenditApiKey = process.env.XENDIT_API_KEY;
  const siteUrl = process.env.PUBLIC_SITE_URL || "https://hashiwaacademy.id";
  if (!xenditApiKey) {
    console.error("[create-invoice] XENDIT_API_KEY not configured");
    return new Response(
      JSON.stringify({ error: "Payment gateway belum dikonfigurasi" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
  const supabaseServer = getSupabaseAdmin();
  console.log(`[create-invoice] Looking up course_id: "${course_id}", type: "${type}", item_id: "${item_id}"`);
  console.log(`[create-invoice] User: ${user.id} (${user.email})`);
  let course = null;
  let courseError = null;
  const publicResult = await supabase.from("classes").select("id, title, price").eq("id", course_id).single();
  course = publicResult.data;
  courseError = publicResult.error;
  console.log(`[create-invoice] Public client result - course:`, JSON.stringify(course), `error:`, JSON.stringify(courseError));
  if (courseError || !course) {
    console.warn(`[create-invoice] Public client failed, trying server client...`);
    const serverResult = await supabaseServer.from("classes").select("id, title, price").eq("id", course_id).single();
    course = serverResult.data;
    courseError = serverResult.error;
    console.log(`[create-invoice] Server client result - course:`, JSON.stringify(course), `error:`, JSON.stringify(courseError));
  }
  if (courseError || !course) {
    console.error(`[create-invoice] Course NOT FOUND with both clients! course_id="${course_id}"`);
    return new Response(JSON.stringify({
      error: "Kursus tidak ditemukan",
      debug_course_id: course_id,
      debug_error: courseError?.message || "No data returned",
      debug_error_code: courseError?.code || "unknown"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  let amount = 0;
  let description = "";
  let module_id = null;
  if (type === "course") {
    amount = course.price ?? 0;
    description = `Pembayaran Kursus: ${course.title}`;
    const { data: existing } = await supabaseServer.from("enrollments").select("id").eq("user_id", user.id).eq("class_id", course_id).maybeSingle();
    if (existing) {
      return new Response(
        JSON.stringify({ error: "Anda sudah terdaftar di kursus ini" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    const { data: mod, error: moduleError } = await supabase.from("modules").select("id, title, price").eq("id", item_id).eq("class_id", course_id).single();
    if (moduleError || !mod) {
      return new Response(
        JSON.stringify({ error: "Modul tidak ditemukan" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    amount = mod.price ?? 0;
    description = `Pembayaran Modul: ${mod.title} — ${course.title}`;
    module_id = item_id;
    const { data: existing } = await supabaseServer.from("module_enrollments").select("id").eq("user_id", user.id).eq("module_id", item_id).maybeSingle();
    if (existing) {
      return new Response(
        JSON.stringify({ error: "Anda sudah memiliki akses ke modul ini" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  if (amount <= 0) {
    return new Response(
      JSON.stringify({ error: "Item ini gratis, tidak perlu pembayaran" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const baseQuery = supabaseServer.from("payments").select("id, xendit_invoice_url").eq("user_id", user.id).eq("class_id", course_id).eq("status", "pending");
  const { data: pendingPayment } = await (module_id ? baseQuery.eq("module_id", module_id) : baseQuery.is("module_id", null)).maybeSingle();
  if (pendingPayment?.xendit_invoice_url) {
    return new Response(
      JSON.stringify({
        invoice_url: pendingPayment.xendit_invoice_url,
        payment_id: pendingPayment.id
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  const { data: payment, error: paymentError } = await supabaseServer.from("payments").insert({
    user_id: user.id,
    class_id: course_id,
    module_id,
    payment_type: type,
    amount,
    status: "pending"
  }).select().single();
  if (paymentError || !payment) {
    console.error("[create-invoice] DB insert error:", paymentError);
    return new Response(
      JSON.stringify({
        error: "Gagal membuat record pembayaran",
        debug_error: paymentError?.message || "Unknown insert error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const paymentRecord = payment;
  const xenditPayload = {
    external_id: paymentRecord.id,
    amount,
    description,
    invoice_duration: 86400,
    // 24 jam
    customer: {
      given_names: user.name,
      email: user.email
    },
    currency: "IDR",
    success_redirect_url: `${siteUrl}/payment/success?id=${paymentRecord.id}`,
    failure_redirect_url: `${siteUrl}/payment/failed?id=${paymentRecord.id}`,
    items: [
      {
        name: description,
        quantity: 1,
        price: amount
      }
    ]
  };
  let xenditData;
  try {
    const xenditRes = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(xenditApiKey + ":")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(xenditPayload)
    });
    if (!xenditRes.ok) {
      const xenditErr = await xenditRes.json();
      console.error("[create-invoice] Xendit error:", xenditErr);
      await supabaseServer.from("payments").delete().eq("id", paymentRecord.id);
      return new Response(
        JSON.stringify({
          error: "Gagal membuat invoice pembayaran",
          details: xenditErr.message || xenditErr.error_code
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    xenditData = await xenditRes.json();
  } catch (fetchErr) {
    console.error("[create-invoice] Network error calling Xendit:", fetchErr);
    await supabaseServer.from("payments").delete().eq("id", paymentRecord.id);
    return new Response(
      JSON.stringify({ error: "Tidak dapat menghubungi payment gateway" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
  await supabaseServer.from("payments").update({
    xendit_invoice_id: xenditData.id,
    xendit_invoice_url: xenditData.invoice_url
  }).eq("id", paymentRecord.id);
  console.log(
    `[create-invoice] Invoice created: payment=${paymentRecord.id} xendit=${xenditData.id}`
  );
  return new Response(
    JSON.stringify({
      invoice_url: xenditData.invoice_url,
      payment_id: paymentRecord.id
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

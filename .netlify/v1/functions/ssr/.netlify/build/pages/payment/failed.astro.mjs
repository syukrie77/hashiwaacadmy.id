import { d as createAstro, e as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_VTTAJAsk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_w48e702d.mjs';
import { g as getSupabaseServerClient } from '../../chunks/supabase_BbPdcCKu.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://hashiwaacademy.id");
const $$Failed = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Failed;
  const paymentId = Astro2.url.searchParams.get("id");
  let course = null;
  if (paymentId) {
    const supabase = getSupabaseServerClient(Astro2);
    const { data } = await supabase.from("payments").select("*, classes(id, title)").eq("id", paymentId).maybeSingle();
    if (data) {
      course = data.classes;
      if (data.status === "pending") {
        await supabase.from("payments").update({ status: "expired" }).eq("id", paymentId);
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-puioehjb": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="payment-result-container" data-astro-cid-puioehjb> <div class="result-card" data-astro-cid-puioehjb> <div class="icon" data-astro-cid-puioehjb>❌</div> <h2 data-astro-cid-puioehjb>Pembayaran Dibatalkan</h2> <p data-astro-cid-puioehjb>
Pembayaran Anda dibatalkan atau tidak berhasil diproses.
                Tidak ada biaya yang dikenakan.
</p> <div class="actions" data-astro-cid-puioehjb> ${course ? renderTemplate`<a${addAttribute(`/courses/${course.id}`, "href")} class="btn btn-primary" data-astro-cid-puioehjb>
Coba Lagi
</a>` : null} <a href="/dashboard" class="btn btn-outline" data-astro-cid-puioehjb>Kembali ke Dashboard</a> </div> </div> </div> ` })} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/payment/failed.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/payment/failed.astro";
const $$url = "/payment/failed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Failed,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

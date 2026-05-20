import { d as createAstro, e as createComponent, j as renderComponent, k as renderScript, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_VTTAJAsk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_w48e702d.mjs';
import { g as getSupabaseServerClient } from '../../chunks/supabase_BbPdcCKu.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://hashiwaacademy.id");
const $$Success = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Success;
  const paymentId = Astro2.url.searchParams.get("id");
  let payment = null;
  let course = null;
  let errorMsg = "";
  if (!paymentId) {
    errorMsg = "ID pembayaran tidak valid.";
  } else {
    const supabase = getSupabaseServerClient(Astro2);
    const { data, error } = await supabase.from("payments").select("*, classes(id, title)").eq("id", paymentId).single();
    if (error || !data) {
      errorMsg = "Data pembayaran tidak ditemukan.";
    } else {
      payment = data;
      course = data.classes;
    }
  }
  const isPaid = payment?.status === "completed";
  const isPending = payment?.status === "pending";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-yuu2fj7j": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="payment-result-container" data-astro-cid-yuu2fj7j> ${errorMsg ? renderTemplate`<div class="result-card error" data-astro-cid-yuu2fj7j> <div class="icon" data-astro-cid-yuu2fj7j>❌</div> <h2 data-astro-cid-yuu2fj7j>Terjadi Kesalahan</h2> <p data-astro-cid-yuu2fj7j>${errorMsg}</p> <a href="/" class="btn btn-primary" data-astro-cid-yuu2fj7j>Kembali ke Beranda</a> </div>` : isPaid ? renderTemplate`<div class="result-card success" data-astro-cid-yuu2fj7j> <div class="icon" data-astro-cid-yuu2fj7j>✅</div> <h2 data-astro-cid-yuu2fj7j>Pembayaran Berhasil!</h2> <p data-astro-cid-yuu2fj7j>Terima kasih. Akses Anda telah diaktifkan.</p> ${course && renderTemplate`<div class="payment-detail" data-astro-cid-yuu2fj7j> <div class="detail-row" data-astro-cid-yuu2fj7j> <span data-astro-cid-yuu2fj7j>Kursus</span> <strong data-astro-cid-yuu2fj7j>${course.title}</strong> </div> <div class="detail-row" data-astro-cid-yuu2fj7j> <span data-astro-cid-yuu2fj7j>Total Dibayar</span> <strong data-astro-cid-yuu2fj7j>Rp ${payment.amount.toLocaleString("id-ID")}</strong> </div> <div class="detail-row" data-astro-cid-yuu2fj7j> <span data-astro-cid-yuu2fj7j>Status</span> <span class="badge-success" data-astro-cid-yuu2fj7j>Lunas</span> </div> </div>`} <a${addAttribute(course ? `/courses/${course.id}` : "/dashboard", "href")} class="btn btn-primary" data-astro-cid-yuu2fj7j>
Mulai Belajar →
</a> </div>` : isPending ? renderTemplate`<div class="result-card pending" data-astro-cid-yuu2fj7j> <div class="icon" data-astro-cid-yuu2fj7j>⏳</div> <h2 data-astro-cid-yuu2fj7j>Pembayaran Sedang Diproses</h2> <p data-astro-cid-yuu2fj7j>
Pembayaran Anda sedang diverifikasi. Halaman ini akan otomatis
                    diperbarui. Jika tidak berubah dalam beberapa menit, coba
                    refresh halaman.
</p> ${course && renderTemplate`<div class="payment-detail" data-astro-cid-yuu2fj7j> <div class="detail-row" data-astro-cid-yuu2fj7j> <span data-astro-cid-yuu2fj7j>Kursus</span> <strong data-astro-cid-yuu2fj7j>${course.title}</strong> </div> <div class="detail-row" data-astro-cid-yuu2fj7j> <span data-astro-cid-yuu2fj7j>Total</span> <strong data-astro-cid-yuu2fj7j>Rp ${payment.amount.toLocaleString("id-ID")}</strong> </div> <div class="detail-row" data-astro-cid-yuu2fj7j> <span data-astro-cid-yuu2fj7j>Status</span> <span class="badge-pending" data-astro-cid-yuu2fj7j>Menunggu Konfirmasi</span> </div> </div>`} <div class="pending-actions" data-astro-cid-yuu2fj7j> <button id="refresh-btn" class="btn btn-primary" data-astro-cid-yuu2fj7j>🔄 Cek Status</button> <a href="/dashboard" class="btn btn-outline" data-astro-cid-yuu2fj7j>Kembali ke Dashboard</a> </div> </div>` : renderTemplate`<div class="result-card error" data-astro-cid-yuu2fj7j> <div class="icon" data-astro-cid-yuu2fj7j>❌</div> <h2 data-astro-cid-yuu2fj7j>Pembayaran Gagal atau Kedaluwarsa</h2> <p data-astro-cid-yuu2fj7j>Transaksi ini tidak dapat diproses. Silakan coba lagi.</p> ${course && renderTemplate`<a${addAttribute(`/courses/${course.id}`, "href")} class="btn btn-primary" data-astro-cid-yuu2fj7j>
Coba Lagi
</a>`} <a href="/dashboard" class="btn btn-outline" data-astro-cid-yuu2fj7j>Kembali ke Dashboard</a> </div>`} </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/payment/success.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/payment/success.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/payment/success.astro";
const $$url = "/payment/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Success,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

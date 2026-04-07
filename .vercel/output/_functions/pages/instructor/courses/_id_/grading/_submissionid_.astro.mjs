import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../../chunks/Layout_5IANKJKH.mjs';
/* empty css                                                      */
export { renderers } from '../../../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$submissionId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$submissionId;
  const { id, submissionId } = Astro2.params;
  const user = Astro2.locals.user;
  if (!user || user.role !== "instructor" && user.role !== "admin") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-4njaikmv": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-4njaikmv></div> <div class="page-container" data-astro-cid-4njaikmv> <div class="page-header" data-astro-cid-4njaikmv> <div data-astro-cid-4njaikmv> <a id="back-link" href="#" class="back-link" data-astro-cid-4njaikmv>← Kembali ke Daftar Koreksi</a> <h1 id="page-title" data-astro-cid-4njaikmv>Koreksi Jawaban</h1> <p id="student-info" class="muted" data-astro-cid-4njaikmv>Loading...</p> </div> <div class="header-stats" data-astro-cid-4njaikmv> <div class="score-display" data-astro-cid-4njaikmv> <span class="score-label" data-astro-cid-4njaikmv>Total Skor</span> <span class="score-value" id="total-score" data-astro-cid-4njaikmv>-</span> </div> </div> </div> <div id="loading" class="state-msg" data-astro-cid-4njaikmv>Memuat jawaban siswa...</div> <div id="content" class="hidden" data-astro-cid-4njaikmv> <div id="answers-list" data-astro-cid-4njaikmv></div> <div class="grading-footer" data-astro-cid-4njaikmv> <div class="footer-info" data-astro-cid-4njaikmv> <span id="auto-grade-info" class="info-text" data-astro-cid-4njaikmv></span> </div> <div class="footer-actions" data-astro-cid-4njaikmv> <button id="save-draft-btn" class="btn btn-outline" data-astro-cid-4njaikmv>Simpan Draft</button> <button id="submit-grades-btn" class="btn btn-primary" data-astro-cid-4njaikmv>✅ Submit Nilai & Kirim ke Siswa</button> </div> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/grading/[submissionId].astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/grading/[submissionId].astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/grading/[submissionId].astro";
const $$url = "/instructor/courses/[id]/grading/[submissionId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$submissionId,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

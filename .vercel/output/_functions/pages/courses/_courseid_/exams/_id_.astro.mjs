import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../chunks/Layout_5IANKJKH.mjs';
/* empty css                                         */
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { courseId, id } = Astro2.params;
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-ltpltxke": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-ltpltxke></div> <div class="exam-container" data-astro-cid-ltpltxke> <header class="exam-header" data-astro-cid-ltpltxke> <div data-astro-cid-ltpltxke> <h1 id="exam-title" data-astro-cid-ltpltxke>Memuat Ujian...</h1> <p id="exam-desc" class="muted" data-astro-cid-ltpltxke></p> </div> <div class="exam-meta" data-astro-cid-ltpltxke> <span id="timer" class="timer" data-astro-cid-ltpltxke>--:--</span> </div> </header> <div id="loading" class="state-msg" data-astro-cid-ltpltxke>Mempersiapkan ujian...</div> <div id="error-msg" class="error-box hidden" data-astro-cid-ltpltxke></div> <!-- EXAM FORM --> <form id="exam-form" class="hidden" data-astro-cid-ltpltxke> <div id="questions-container" data-astro-cid-ltpltxke></div> <div class="exam-actions" data-astro-cid-ltpltxke> <button type="submit" class="btn btn-primary btn-lg" data-astro-cid-ltpltxke>📤 Kumpulkan Jawaban</button> </div> </form> <!-- SUBMITTED - Waiting for grading --> <div id="submitted-view" class="hidden result-box" data-astro-cid-ltpltxke> <div class="result-icon" data-astro-cid-ltpltxke>📤</div> <h2 data-astro-cid-ltpltxke>Jawaban Berhasil Dikumpulkan!</h2> <p data-astro-cid-ltpltxke>Jawaban kamu sudah tersimpan. Guru akan segera mengoreksi jawaban essay kamu.</p> <div id="mcq-preview" class="hidden" data-astro-cid-ltpltxke> <h3 data-astro-cid-ltpltxke>Ringkasan Jawaban Otomatis</h3> <div id="mcq-summary" data-astro-cid-ltpltxke></div> </div> <div class="actions" data-astro-cid-ltpltxke> <a href="/dashboard" class="btn btn-outline" data-astro-cid-ltpltxke>← Kembali ke Dashboard</a> </div> </div> <!-- GRADED - Show results with feedback --> <div id="graded-view" class="hidden result-box" data-astro-cid-ltpltxke> <div class="result-header" data-astro-cid-ltpltxke> <h2 data-astro-cid-ltpltxke>📋 Hasil Ujian</h2> <div class="big-score" data-astro-cid-ltpltxke> <span id="final-score" class="score-num" data-astro-cid-ltpltxke>-</span> <span class="score-max" data-astro-cid-ltpltxke>/ 100</span> </div> <p id="pass-status" class="pass-badge" data-astro-cid-ltpltxke></p> </div> <div id="graded-details" class="graded-details" data-astro-cid-ltpltxke></div> <div class="actions" data-astro-cid-ltpltxke> <a href="/dashboard" class="btn btn-outline" data-astro-cid-ltpltxke>← Kembali ke Dashboard</a> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/exams/[id].astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/exams/[id].astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/exams/[id].astro";
const $$url = "/courses/[courseId]/exams/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

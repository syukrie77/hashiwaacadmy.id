import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../chunks/Layout_5IANKJKH.mjs';
/* empty css                                            */
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Grading = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Grading;
  const { id } = Astro2.params;
  const user = Astro2.locals.user;
  if (!user || user.role !== "instructor" && user.role !== "admin") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-naaznuuy": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-naaznuuy></div> <div class="page-container" data-astro-cid-naaznuuy> <div class="page-header" data-astro-cid-naaznuuy> <div data-astro-cid-naaznuuy> <a${addAttribute(`/instructor/courses/${id}/exams`, "href")} class="back-link" data-astro-cid-naaznuuy>← Kembali ke Daftar Ujian</a> <h1 data-astro-cid-naaznuuy>Koreksi Jawaban Siswa</h1> <p id="exam-info" class="muted" data-astro-cid-naaznuuy>Loading...</p> </div> </div> <!-- Exam Selector --> <div class="filter-bar" data-astro-cid-naaznuuy> <label data-astro-cid-naaznuuy>Pilih Ujian:</label> <select id="exam-select" data-astro-cid-naaznuuy> <option value="" data-astro-cid-naaznuuy>-- Pilih Ujian --</option> </select> <div class="filter-group" data-astro-cid-naaznuuy> <button class="btn btn-sm btn-outline filter-btn active" data-filter="all" data-astro-cid-naaznuuy>Semua</button> <button class="btn btn-sm btn-outline filter-btn" data-filter="submitted" data-astro-cid-naaznuuy>⏳ Belum Dikoreksi</button> <button class="btn btn-sm btn-outline filter-btn" data-filter="graded" data-astro-cid-naaznuuy>✅ Sudah Dikoreksi</button> </div> </div> <div id="loading" class="state-msg" data-astro-cid-naaznuuy>Memuat data...</div> <div id="content" class="hidden" data-astro-cid-naaznuuy> <div class="stats-row" data-astro-cid-naaznuuy> <div class="stat-card" data-astro-cid-naaznuuy> <span class="stat-num" id="total-subs" data-astro-cid-naaznuuy>0</span> <span class="stat-label" data-astro-cid-naaznuuy>Total Siswa</span> </div> <div class="stat-card warning" data-astro-cid-naaznuuy> <span class="stat-num" id="pending-subs" data-astro-cid-naaznuuy>0</span> <span class="stat-label" data-astro-cid-naaznuuy>Belum Dikoreksi</span> </div> <div class="stat-card success" data-astro-cid-naaznuuy> <span class="stat-num" id="graded-subs" data-astro-cid-naaznuuy>0</span> <span class="stat-label" data-astro-cid-naaznuuy>Sudah Dikoreksi</span> </div> <div class="stat-card info" data-astro-cid-naaznuuy> <span class="stat-num" id="avg-score" data-astro-cid-naaznuuy>-</span> <span class="stat-label" data-astro-cid-naaznuuy>Rata-rata Nilai</span> </div> </div> <!-- Bulk Actions --> <div id="bulk-actions" class="bulk-bar hidden" data-astro-cid-naaznuuy> <div class="bulk-left" data-astro-cid-naaznuuy> <label class="checkbox-label" data-astro-cid-naaznuuy> <input type="checkbox" id="select-all" data-astro-cid-naaznuuy> <span data-astro-cid-naaznuuy>Pilih Semua</span> </label> <span id="selected-count" class="selected-count" data-astro-cid-naaznuuy>0 dipilih</span> </div> <div class="bulk-right" data-astro-cid-naaznuuy> <button id="bulk-autograde-btn" class="btn btn-sm btn-primary" disabled data-astro-cid-naaznuuy>
⚡ Auto-Grade PG & B/S
</button> <button id="bulk-submit-btn" class="btn btn-sm btn-success" disabled data-astro-cid-naaznuuy>
✅ Submit Semua Nilai
</button> </div> </div> <div id="submissions-list" class="submissions-grid" data-astro-cid-naaznuuy></div> <div id="no-subs" class="empty-state hidden" data-astro-cid-naaznuuy> <p data-astro-cid-naaznuuy>Belum ada siswa yang mengumpulkan jawaban.</p> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/grading.astro?astro&type=script&index=0&lang.ts")} 
- [x] Explore exams.astro (main exam list page)
- [x] Explore exam detail page (examId.astro) - question management
- [x] Explore grading list page
- [x] Explore grading detail page
- [x] Explore student exam taking page
- [x] Explore database schema for exam tables
- [x] Enhance exam creation modal with multi-step wizard + inline question builder
- [x] Enhance grading list page with bulk auto-grade and better UX
- [ ] Enhance grading detail page with better UX
- [ ] Test and verify`;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/grading.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/grading.astro";
const $$url = "/instructor/courses/[id]/grading";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Grading,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

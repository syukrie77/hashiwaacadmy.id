import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_hC64G2nb.mjs';
import { s as supabase } from '../../chunks/supabase_DDcE5sYV.mjs';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const user = Astro2.locals.user;
  if (!id) {
    return Astro2.redirect("/404");
  }
  const { data: course, error: courseError } = await supabase.from("classes").select("*").eq("id", id).single();
  if (courseError || !course) {
    console.error("Error fetching course:", courseError);
    return Astro2.redirect("/404");
  }
  const { data: modules, error: modulesError } = await supabase.from("modules").select(
    `
    *,
    materials (*)
  `
  ).eq("class_id", id).order("order_no");
  const sortedCourseModules = (modules || []).map((mod) => ({
    ...mod,
    materials: (mod.materials || []).sort(
      (a, b) => (a.order_no || 0) - (b.order_no || 0)
    )
  }));
  if (modulesError) {
    console.error("Error fetching modules:", modulesError);
  }
  const { data: courseExams, error: examsError } = await supabase.from("exams").select("*").eq("class_id", id);
  const courseModules = sortedCourseModules || [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-ae7xwjmx": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user || null), "data-user")} class="hidden" data-astro-cid-ae7xwjmx></div> <div class="course-header" data-astro-cid-ae7xwjmx> <h1 data-astro-cid-ae7xwjmx>${course.title}</h1> <p class="description" data-astro-cid-ae7xwjmx>${course.description}</p> <div class="meta" data-astro-cid-ae7xwjmx> <span class="price" data-astro-cid-ae7xwjmx>${course.price && course.price > 0 ? `Biaya Masuk: Rp ${course.price.toLocaleString("id-ID")}` : "Gratis"}</span> <button id="enroll-btn" class="btn btn-primary"${addAttribute(id, "data-course-id")}${addAttribute(course.price || 0, "data-course-price")} data-astro-cid-ae7xwjmx>
Start Learning
</button> </div> <div id="course-progress-container" class="course-overall-progress hidden" data-astro-cid-ae7xwjmx> <div class="overall-circle-container" data-astro-cid-ae7xwjmx> <svg width="80" height="80" viewBox="0 0 80 80" data-astro-cid-ae7xwjmx> <circle class="bg" cx="40" cy="40" r="36" fill="none" stroke="#e5e7eb" stroke-width="6" data-astro-cid-ae7xwjmx></circle> <circle id="course-progress-circle-fill" class="progress" cx="40" cy="40" r="36" fill="none" stroke="var(--primary-color)" stroke-width="6" stroke-dasharray="226.2" stroke-dashoffset="226.2" stroke-linecap="round" data-astro-cid-ae7xwjmx></circle> </svg> <div class="overall-progress-info" data-astro-cid-ae7xwjmx> <span id="course-progress-text" data-astro-cid-ae7xwjmx>0%</span> <span class="label" data-astro-cid-ae7xwjmx>Selesai</span> </div> </div> <div class="progress-meta" data-astro-cid-ae7xwjmx> <h3 data-astro-cid-ae7xwjmx>Progress Belajar</h3> <p data-astro-cid-ae7xwjmx>Teruskan belajar untuk menyelesaikan kursus ini.</p> </div> </div> </div> <div class="content" data-astro-cid-ae7xwjmx> <div class="sidebar" data-astro-cid-ae7xwjmx> <h3 data-astro-cid-ae7xwjmx>Course Content</h3> <div class="modules-list" data-astro-cid-ae7xwjmx> ${courseModules.length === 0 ? renderTemplate`<p class="empty-state" data-astro-cid-ae7xwjmx>No content available yet.</p>` : courseModules.map((mod) => renderTemplate`<div class="module-card-student"${addAttribute(mod.id, "data-module-id")}${addAttribute(mod.price || 0, "data-price")} data-astro-cid-ae7xwjmx> <div class="mod-header" data-astro-cid-ae7xwjmx> <div class="mod-title-group" data-astro-cid-ae7xwjmx> <h4 data-astro-cid-ae7xwjmx>${mod.title}</h4> ${mod.price > 0 && renderTemplate`<span class="badge-price" data-astro-cid-ae7xwjmx>
Rp${" "} ${mod.price.toLocaleString(
    "id-ID"
  )} </span>`} </div> <div class="mod-status" data-astro-cid-ae7xwjmx> <div class="mod-progress-circle hidden" data-astro-cid-ae7xwjmx> <svg width="36" height="36" viewBox="0 0 36 36" data-astro-cid-ae7xwjmx> <circle class="bg" cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" stroke-width="3" data-astro-cid-ae7xwjmx></circle> <circle class="progress" cx="18" cy="18" r="16" fill="none" stroke="var(--primary-color)" stroke-width="3" stroke-dasharray="100.5" stroke-dashoffset="100.5" stroke-linecap="round" data-astro-cid-ae7xwjmx></circle> </svg> <span class="progress-text-sm" data-astro-cid-ae7xwjmx>
0%
</span> </div> <span class="status-icon" data-astro-cid-ae7xwjmx>
🔒 Locked
</span> <button class="btn-sm btn-primary buy-module-btn hidden" data-astro-cid-ae7xwjmx>
Unlock
</button> </div> </div> <ul class="materials-list" data-astro-cid-ae7xwjmx> ${mod.materials && mod.materials.length > 0 ? mod.materials.map((mat) => renderTemplate`<li class="material-item"${addAttribute(mat.id, "data-id")} data-astro-cid-ae7xwjmx> <span class="material-type" data-astro-cid-ae7xwjmx> ${mat.type === "video" ? "\u{1F4FA}" : mat.type === "pdf" ? "\u{1F4C4}" : "\u{1F4DD}"} </span> <span class="material-title" data-astro-cid-ae7xwjmx> ${mat.title} </span> ${mat.duration && renderTemplate`<span class="duration" data-astro-cid-ae7xwjmx> ${mat.duration} min
</span>`} </li>`) : renderTemplate`<li class="empty-material" data-astro-cid-ae7xwjmx>
No materials
</li>`} </ul> </div>`)} </div> </div> <!-- Exams Section --> ${courseExams && courseExams.length > 0 && renderTemplate`<div class="exams-section" data-astro-cid-ae7xwjmx> <h3 data-astro-cid-ae7xwjmx>Exams</h3> <ul class="materials-list" data-astro-cid-ae7xwjmx> ${courseExams.map((exam) => renderTemplate`<li class="exam-item-link" data-astro-cid-ae7xwjmx> <a${addAttribute(`/courses/${id}/exams/${exam.id}`, "href")} class="exam-link" data-astro-cid-ae7xwjmx> <span class="material-type" data-astro-cid-ae7xwjmx>📝</span> <span class="material-title" data-astro-cid-ae7xwjmx> ${exam.title} </span> <span class="duration" data-astro-cid-ae7xwjmx> ${exam.duration} min
</span> </a> </li>`)} </ul> </div>`} </div> <div class="main-content" data-astro-cid-ae7xwjmx> <div class="placeholder-viewer" data-astro-cid-ae7xwjmx> <h2 data-astro-cid-ae7xwjmx>Select a lesson to start</h2> <p data-astro-cid-ae7xwjmx>Your learning journey begins here.</p> </div> </div> ` })} <!-- Enrollment Modal --> <div id="enroll-modal" class="modal hidden" data-astro-cid-ae7xwjmx> <div class="modal-content" data-astro-cid-ae7xwjmx> <h3 data-astro-cid-ae7xwjmx>Unlock Module</h3> <p data-astro-cid-ae7xwjmx>
You are about to unlock: <strong id="modal-mod-title" data-astro-cid-ae7xwjmx></strong> </p> <p class="price-display" data-astro-cid-ae7xwjmx>
Price: <span id="modal-mod-price" data-astro-cid-ae7xwjmx></span> </p> <div class="modal-actions" data-astro-cid-ae7xwjmx> <button id="cancel-enroll" class="btn btn-outline" data-astro-cid-ae7xwjmx>Cancel</button> <button id="confirm-enroll" class="btn btn-primary" data-astro-cid-ae7xwjmx>Pay & Unlock</button> </div> </div> </div> ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[id].astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[id].astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[id].astro";
const $$url = "/courses/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

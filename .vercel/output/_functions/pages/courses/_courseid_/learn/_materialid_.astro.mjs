import { e as createComponent, k as renderComponent, l as renderScript, g as addAttribute, r as renderTemplate, h as createAstro, m as maybeRenderHead, u as unescapeHTML } from '../../../../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../chunks/Layout_hC64G2nb.mjs';
import { s as supabase } from '../../../../chunks/supabase_DDcE5sYV.mjs';
/* empty css                                                 */
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$materialId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$materialId;
  const { courseId, materialId } = Astro2.params;
  if (!courseId || !materialId) {
    return Astro2.redirect("/404");
  }
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  const { data: material, error: matError } = await supabase.from("materials").select(
    `
    *,
    modules (
      title,
      class_id,
      classes (title)
    )
  `
  ).eq("id", materialId).single();
  if (matError || !material) {
    console.error("Error fetching material:", matError);
    return Astro2.redirect("/404");
  }
  const { data: modules, error: modulesError } = await supabase.from("modules").select(
    `
    id,
    title,
    order_no,
    materials (id, title, type, duration, order_no)
  `
  ).eq("class_id", courseId).order("order_no");
  const sortedModules = (modules || []).map((mod) => ({
    ...mod,
    materials: (mod.materials || []).sort(
      (a, b) => (a.order_no || 0) - (b.order_no || 0)
    )
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-mtz7efsy": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-mtz7efsy></div> <div class="learn-container" data-astro-cid-mtz7efsy> <aside class="sidebar" data-astro-cid-mtz7efsy> <div class="sidebar-header" data-astro-cid-mtz7efsy> <div class="header-top" data-astro-cid-mtz7efsy> <a${addAttribute(`/courses/${courseId}`, "href")} class="back-link" data-astro-cid-mtz7efsy>← Back</a> </div> <h3 data-astro-cid-mtz7efsy>${material.modules.classes.title}</h3> </div> <nav class="course-outline" data-astro-cid-mtz7efsy> ${sortedModules?.map((mod) => renderTemplate`<div class="module-group" data-astro-cid-mtz7efsy> <h4 class="module-title" data-astro-cid-mtz7efsy>${mod.title}</h4> <ul class="material-links" data-astro-cid-mtz7efsy> ${mod.materials.map((mat) => renderTemplate`<li${addAttribute(`${mat.id === materialId ? "active" : ""} ${mat.type}`, "class")}${addAttribute(mat.id, "data-id")} data-astro-cid-mtz7efsy> <a${addAttribute(`/courses/${courseId}/learn/${mat.id}`, "href")} data-astro-cid-mtz7efsy> <span class="icon" data-astro-cid-mtz7efsy> ${mat.type === "video" ? "\u{1F4FA}" : mat.type === "pdf" ? "\u{1F4C4}" : "\u{1F4DD}"} </span> <span class="title" data-astro-cid-mtz7efsy>${mat.title}</span> </a> </li>`)} </ul> </div>`)} </nav> </aside> <main class="content-viewer" data-astro-cid-mtz7efsy> <div class="content-header-controls" data-astro-cid-mtz7efsy> <button id="main-sidebar-toggle" class="main-sidebar-toggle" title="Toggle Sidebar" data-astro-cid-mtz7efsy> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mtz7efsy><rect x="3" y="3" width="18" height="18" rx="2" ry="2" data-astro-cid-mtz7efsy></rect><line x1="9" y1="3" x2="9" y2="21" data-astro-cid-mtz7efsy></line></svg> </button> </div> <div id="secure-content" class="hidden" style="display: none;" data-astro-cid-mtz7efsy> <div class="viewer-header" data-astro-cid-mtz7efsy> <h2 data-astro-cid-mtz7efsy>${material.title}</h2> <div class="meta" data-astro-cid-mtz7efsy> <span class="badge" data-astro-cid-mtz7efsy>${material.type}</span> ${material.duration && renderTemplate`<span data-astro-cid-mtz7efsy>${material.duration} minutes</span>`} </div> </div> <div class="viewer-body" data-astro-cid-mtz7efsy> ${material.type === "video" ? renderTemplate`<div class="video-container" data-astro-cid-mtz7efsy> ${material.content.includes("youtube.com") || material.content.includes("youtu.be") ? renderTemplate`<iframe${addAttribute(material.content.replace("watch?v=", "embed/"), "src")} frameborder="0" allowfullscreen data-astro-cid-mtz7efsy></iframe>` : renderTemplate`<video${addAttribute(material.content, "src")} controls class="main-video" data-astro-cid-mtz7efsy> <p data-astro-cid-mtz7efsy>Browser Anda tidak mendukung pemutaran video. <a${addAttribute(material.content, "href")} data-astro-cid-mtz7efsy>Download Video</a></p> </video>`} <div class="actions" data-astro-cid-mtz7efsy> <button class="btn btn-primary" id="mark-complete" data-astro-cid-mtz7efsy>
Mark as Completed
</button> </div> </div>` : material.type === "pdf" ? renderTemplate`<div class="pdf-container" data-astro-cid-mtz7efsy> <iframe${addAttribute(material.content, "src")} width="100%" height="800px" style="border: 1px solid var(--border-color); border-radius: 0.5rem;"${addAttribute(material.title, "title")} data-astro-cid-mtz7efsy></iframe> <div class="pdf-fallback" data-astro-cid-mtz7efsy> <p data-astro-cid-mtz7efsy>PDF tidak tampil? <a${addAttribute(material.content, "href")} target="_blank" rel="noopener noreferrer" class="btn btn-outline" data-astro-cid-mtz7efsy>📥 Download PDF</a></p> </div> <div class="actions" data-astro-cid-mtz7efsy> <button class="btn btn-primary" id="mark-complete" data-astro-cid-mtz7efsy>
Mark as Completed
</button> </div> </div>` : renderTemplate`<div class="text-content" data-astro-cid-mtz7efsy>${unescapeHTML(material.content)}</div>`} ${material.type === "text" && renderTemplate`<div class="actions" data-astro-cid-mtz7efsy> <button class="btn btn-primary" id="mark-complete" data-astro-cid-mtz7efsy>
Mark as Completed
</button> </div>`} </div> <div class="viewer-footer" data-astro-cid-mtz7efsy> <!-- Navigation between lessons could be added here --> </div> </div> <!-- End secure-content --> </main> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/learn/[materialId].astro?astro&type=script&index=0&lang.ts")} <div id="data-bridge" class="hidden"${addAttribute(courseId, "data-course-id")}${addAttribute(materialId, "data-material-id")} data-astro-cid-mtz7efsy></div> `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/learn/[materialId].astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/learn/[materialId].astro";
const $$url = "/courses/[courseId]/learn/[materialId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$materialId,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../chunks/Layout_hC64G2nb.mjs';
/* empty css                                         */
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { courseId, id } = Astro2.params;
  if (!courseId || !id) {
    return Astro2.redirect("/404");
  }
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-ltpltxke": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-ltpltxke></div> <div class="exam-container" data-astro-cid-ltpltxke> <header class="exam-header" data-astro-cid-ltpltxke> <h1 id="exam-title" data-astro-cid-ltpltxke>Loading Exam...</h1> <div class="exam-meta" data-astro-cid-ltpltxke> <span id="timer" class="timer badge" data-astro-cid-ltpltxke>--:--</span> </div> </header> <main class="exam-content" data-astro-cid-ltpltxke> <div id="loading" class="state-message" data-astro-cid-ltpltxke>Preparing your exam...</div> <div id="error-msg" class="error-message hidden" data-astro-cid-ltpltxke></div> <form id="exam-form" class="hidden" data-astro-cid-ltpltxke> <div id="questions-container" data-astro-cid-ltpltxke></div> <div class="exam-actions" data-astro-cid-ltpltxke> <button type="submit" class="btn btn-primary btn-lg" data-astro-cid-ltpltxke>Submit Exam</button> </div> </form> <div id="result-view" class="hidden result-container" data-astro-cid-ltpltxke> <h2 data-astro-cid-ltpltxke>Exam Submitted!</h2> <p data-astro-cid-ltpltxke>Your answers have been recorded.</p> <div id="score-display" class="score-card hidden" data-astro-cid-ltpltxke> <span class="score-label" data-astro-cid-ltpltxke>Your Score:</span> <span class="score-value" id="final-score" data-astro-cid-ltpltxke>--</span> </div> <div class="actions" data-astro-cid-ltpltxke> <a${addAttribute(`/courses/${courseId}`, "href")} class="btn btn-outline" data-astro-cid-ltpltxke>Back to Course</a> </div> </div> </main> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/exams/[id].astro?astro&type=script&index=0&lang.ts")} `;
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

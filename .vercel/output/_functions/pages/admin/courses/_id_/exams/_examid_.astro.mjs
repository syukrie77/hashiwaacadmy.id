import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../../chunks/Layout_5IANKJKH.mjs';
/* empty css                                                */
export { renderers } from '../../../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$examId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$examId;
  const { id, examId } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-6nhwqnyz": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-container" data-astro-cid-6nhwqnyz> <aside class="admin-sidebar" data-astro-cid-6nhwqnyz> <div class="brand" data-astro-cid-6nhwqnyz>Admin Panel</div> <nav data-astro-cid-6nhwqnyz> <a href="/admin/dashboard" data-astro-cid-6nhwqnyz>Overview</a> <a href="/admin/users" data-astro-cid-6nhwqnyz>Users</a> <a href="/admin/classes" class="active" data-astro-cid-6nhwqnyz>Course Management</a> </nav> <div class="footer" data-astro-cid-6nhwqnyz> <a${addAttribute(`/admin/courses/${id}/builder`, "href")} data-astro-cid-6nhwqnyz>← Back to Course</a> </div> </aside> <main class="admin-main" data-astro-cid-6nhwqnyz> <div class="admin-header" data-astro-cid-6nhwqnyz> <div data-astro-cid-6nhwqnyz> <h1 id="exam-title" data-astro-cid-6nhwqnyz>Loading Exam...</h1> <p id="exam-desc" class="muted" data-astro-cid-6nhwqnyz></p> </div> <div class="actions" data-astro-cid-6nhwqnyz> <button id="add-question-btn" class="btn btn-primary" data-astro-cid-6nhwqnyz>+ Add Question</button> </div> </div> <div id="loading" class="state-message" data-astro-cid-6nhwqnyz>Loading questions...</div> <div id="questions-list" class="questions-container hidden" data-astro-cid-6nhwqnyz></div> </main> </div>  <div id="question-modal" class="modal hidden" data-astro-cid-6nhwqnyz> <div class="modal-content large-modal" data-astro-cid-6nhwqnyz> <h3 id="modal-title" data-astro-cid-6nhwqnyz>Add/Edit Question</h3> <form id="question-form" data-astro-cid-6nhwqnyz> <input type="hidden" id="q-id" data-astro-cid-6nhwqnyz> <div class="form-group" data-astro-cid-6nhwqnyz> <label data-astro-cid-6nhwqnyz>Question Type</label> <select id="q-type" class="form-control" data-astro-cid-6nhwqnyz> <option value="multiple_choice" data-astro-cid-6nhwqnyz>Multiple Choice</option> <option value="essay" data-astro-cid-6nhwqnyz>Essay / Long Answer</option> <option value="true_false" data-astro-cid-6nhwqnyz>True / False</option> </select> </div> <div class="form-group" data-astro-cid-6nhwqnyz> <label data-astro-cid-6nhwqnyz>Question Text</label> <textarea id="q-text" rows="3" required class="form-control" data-astro-cid-6nhwqnyz></textarea> </div> <div class="form-group" data-astro-cid-6nhwqnyz> <label data-astro-cid-6nhwqnyz>Points</label> <input type="number" id="q-points" value="1" min="0" class="form-control" data-astro-cid-6nhwqnyz> </div> <!-- Multiple Choice Options Section --> <div id="options-section" class="options-container" data-astro-cid-6nhwqnyz> <label data-astro-cid-6nhwqnyz>Answer Options</label> <div id="options-list" data-astro-cid-6nhwqnyz></div> <button type="button" class="btn btn-sm btn-outline mt-2" id="add-option-btn" data-astro-cid-6nhwqnyz>+ Add Option</button> <p class="text-sm muted mt-1" data-astro-cid-6nhwqnyz>
Select the radio button next to the correct answer.
</p> </div> <div class="modal-actions" data-astro-cid-6nhwqnyz> <button type="button" class="btn btn-outline closeModal" data-astro-cid-6nhwqnyz>Cancel</button> <button type="submit" class="btn btn-primary" data-astro-cid-6nhwqnyz>Save Question</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/courses/[id]/exams/[examId].astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/courses/[id]/exams/[examId].astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/courses/[id]/exams/[examId].astro";
const $$url = "/admin/courses/[id]/exams/[examId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$examId,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

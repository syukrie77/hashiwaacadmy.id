import { e as createComponent, r as renderTemplate, o as defineScriptVars, k as renderComponent, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../chunks/Layout_5IANKJKH.mjs';
import { s as supabase } from '../../../../chunks/supabase_CLFJcle_.mjs';
/* empty css                                         */
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
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
  const { data: assignment, error: assignError } = await supabase.from("assignments").select(
    `
    *,
    classes (title)
  `
  ).eq("id", id).single();
  if (assignError || !assignment) {
    console.error("Error fetching assignment:", assignError);
    return Astro2.redirect("/404");
  }
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", '\n    const form = document.getElementById("submission-form");\n    const statusDiv = document.getElementById("submission-status");\n\n    form?.addEventListener("submit", async (e) => {\n        e.preventDefault();\n        const userEl = document.getElementById("user-data");\n        const userStr = userEl ? userEl.dataset.user : null;\n        if (!userStr || userStr === "null") {\n            alert("Please log in for submission");\n            return;\n        }\n\n        const user = JSON.parse(userStr);\n        const formData = new FormData(e.target);\n        const file_url = formData.get("file_url");\n\n        const { supabase } = await import("../../../../lib/supabase");\n\n        const { data, error } = await supabase.from("submissions").insert([\n            {\n                assignment_id: assignmentId,\n                user_id: user.id,\n                file_url: file_url,\n            },\n        ]);\n\n        if (error) {\n            console.error(error);\n            alert("Error submitting: " + error.message);\n        } else {\n            form.classList.add("hidden");\n            statusDiv.classList.remove("hidden");\n        }\n    });\n})();<\/script> '])), renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-izjykbdd": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-izjykbdd></div> <div class="assignment-page" data-astro-cid-izjykbdd> <div class="header" data-astro-cid-izjykbdd> <a${addAttribute(`/courses/${courseId}`, "href")} class="back-link" data-astro-cid-izjykbdd>← Back to Course</a> <h1 data-astro-cid-izjykbdd>${assignment.title}</h1> <p class="course-name" data-astro-cid-izjykbdd>${assignment.classes.title}</p> </div> <div class="main-layout" data-astro-cid-izjykbdd> <section class="details-card" data-astro-cid-izjykbdd> <h3 data-astro-cid-izjykbdd>Instructions</h3> <div class="description" data-astro-cid-izjykbdd> ${assignment.description || "No instructions provided."} </div> ${assignment.deadline && renderTemplate`<div class="deadline" data-astro-cid-izjykbdd> <strong data-astro-cid-izjykbdd>Deadline:</strong>${" "} ${new Date(assignment.deadline).toLocaleString()} </div>`} </section> <aside class="submission-card" data-astro-cid-izjykbdd> <h3 data-astro-cid-izjykbdd>My Submission</h3> <form id="submission-form" data-astro-cid-izjykbdd> <div class="form-group" data-astro-cid-izjykbdd> <label for="file_url" data-astro-cid-izjykbdd>Solution Link (URL)</label> <input type="url" id="file_url" name="file_url" required placeholder="https://github.com/..." data-astro-cid-izjykbdd> </div> <button type="submit" class="btn btn-primary btn-block" data-astro-cid-izjykbdd>Submit Assignment</button> </form> <div id="submission-status" class="hidden" data-astro-cid-izjykbdd> <p class="success-msg" data-astro-cid-izjykbdd>
Assignment submitted successfully!
</p> </div> </aside> </div> </div> ` }), defineScriptVars({ assignmentId: id }));
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/assignments/[id].astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/courses/[courseId]/assignments/[id].astro";
const $$url = "/courses/[courseId]/assignments/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

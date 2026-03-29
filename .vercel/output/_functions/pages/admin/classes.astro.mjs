import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DjQSPh3J.mjs';
import { s as supabase } from '../../chunks/supabase_DDcE5sYV.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Classes = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Classes;
  const user = Astro2.locals.user;
  if (!user || user.role !== "admin") {
    return Astro2.redirect("/login");
  }
  const [{ data: courses }, { data: instructorData }] = await Promise.all([
    supabase.from("classes").select("*").order("title"),
    supabase.from("users").select("id, name, email").eq("role", "instructor").order("name")
  ]);
  const allCourses = courses || [];
  const instructors = instructorData || [];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "activePage": "classes", "title": "Course Management", "data-astro-cid-6kmxewfh": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-header" data-astro-cid-6kmxewfh> <h1 data-astro-cid-6kmxewfh>Course Management</h1> <a href="/admin/courses/new" class="btn btn-primary" data-astro-cid-6kmxewfh>+ New Course</a> </div> <div class="table-card" data-astro-cid-6kmxewfh> <table id="classes-table" data-astro-cid-6kmxewfh> <thead data-astro-cid-6kmxewfh> <tr data-astro-cid-6kmxewfh> <th data-astro-cid-6kmxewfh>Judul</th> <th data-astro-cid-6kmxewfh>Harga</th> <th data-astro-cid-6kmxewfh>Instructor</th> <th data-astro-cid-6kmxewfh>Status</th> <th data-astro-cid-6kmxewfh>Aksi</th> </tr> </thead> <tbody id="classes-tbody" data-astro-cid-6kmxewfh> ${allCourses.map((course) => renderTemplate`<tr data-astro-cid-6kmxewfh> <td data-astro-cid-6kmxewfh><strong data-astro-cid-6kmxewfh>${course.title}</strong></td> <td data-astro-cid-6kmxewfh> ${course.price ? `Rp ${course.price.toLocaleString("id-ID")}` : "Gratis"} </td> <td data-astro-cid-6kmxewfh> <div class="instructor-cell" data-astro-cid-6kmxewfh> <select class="instructor-select"${addAttribute(course.id, "data-course-id")}${addAttribute(course.owner_id || "", "data-current-owner")} data-astro-cid-6kmxewfh> <option value="" data-astro-cid-6kmxewfh>-- Pilih Instructor --</option> ${instructors.map((inst) => renderTemplate`<option${addAttribute(inst.id, "value")}${addAttribute(course.owner_id === inst.id, "selected")} data-astro-cid-6kmxewfh> ${inst.name} </option>`)} </select> <button class="btn-assign assign-instructor"${addAttribute(course.id, "data-course-id")} disabled data-astro-cid-6kmxewfh>
Assign
</button> </div> </td> <td data-astro-cid-6kmxewfh> <span${addAttribute(`status-badge ${course.is_active ? "active" : "inactive"}`, "class")} data-astro-cid-6kmxewfh> ${course.is_active ? "Active" : "Draft"} </span> </td> <td data-astro-cid-6kmxewfh> <div class="actions" data-astro-cid-6kmxewfh> <a${addAttribute(`/admin/courses/${course.id}/builder`, "href")} class="btn-builder" data-astro-cid-6kmxewfh>
Builder
</a> <button class="btn-toggle toggle-active"${addAttribute(course.id, "data-id")}${addAttribute(String(course.is_active), "data-active")} data-astro-cid-6kmxewfh> ${course.is_active ? "Deactivate" : "Activate"} </button> <button class="btn-toggle btn-danger delete-course"${addAttribute(course.id, "data-id")} data-astro-cid-6kmxewfh>
Delete
</button> </div> </td> </tr>`)} </tbody> </table> ${allCourses.length === 0 && renderTemplate`<div class="state-message" data-astro-cid-6kmxewfh>
Belum ada course. Mulai dengan membuat yang baru!
</div>`} </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/classes.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/classes.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/classes.astro";
const $$url = "/admin/classes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Classes,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

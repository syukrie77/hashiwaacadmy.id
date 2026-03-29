import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_hC64G2nb.mjs';
/* empty css                                     */
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const user = Astro2.locals.user;
  if (!user || user.role !== "admin") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-wgwn3o2h": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-wgwn3o2h></div> <div class="admin-container" data-astro-cid-wgwn3o2h> <aside class="admin-sidebar" data-astro-cid-wgwn3o2h> <div class="brand" data-astro-cid-wgwn3o2h>Admin Panel</div> <nav data-astro-cid-wgwn3o2h> <a href="/admin/dashboard" data-astro-cid-wgwn3o2h>Overview</a> <a href="/admin/users" data-astro-cid-wgwn3o2h>Users</a> <a href="/admin/classes" data-astro-cid-wgwn3o2h>Course Management</a> <div class="nav-divider" data-astro-cid-wgwn3o2h></div> <a href="/admin/courses/new" class="btn-create-sidebar active" data-astro-cid-wgwn3o2h>+ New Course</a> </nav> <div class="footer" data-astro-cid-wgwn3o2h> <a href="/dashboard" data-astro-cid-wgwn3o2h>Return to Student Dash</a> </div> </aside> <main class="admin-main" data-astro-cid-wgwn3o2h> <div class="admin-header" data-astro-cid-wgwn3o2h> <h1 data-astro-cid-wgwn3o2h>Create New Course</h1> <a href="/admin/classes" class="btn btn-outline" data-astro-cid-wgwn3o2h>Back to List</a> </div> <div class="form-card" data-astro-cid-wgwn3o2h> <form id="new-course-form" data-astro-cid-wgwn3o2h> <div class="form-group" data-astro-cid-wgwn3o2h> <label for="title" data-astro-cid-wgwn3o2h>Course Title</label> <input type="text" id="title" name="title" required placeholder="e.g. Master Next.js for Beginners" data-astro-cid-wgwn3o2h> </div> <div class="form-group" data-astro-cid-wgwn3o2h> <label for="description" data-astro-cid-wgwn3o2h>Description</label> <textarea id="description" name="description" rows="4" placeholder="Course overview..." data-astro-cid-wgwn3o2h></textarea> </div> <div class="form-group" data-astro-cid-wgwn3o2h> <label for="price" data-astro-cid-wgwn3o2h>Harga (Rp)</label> <input type="number" id="price" name="price" step="1" value="0" data-astro-cid-wgwn3o2h> <small data-astro-cid-wgwn3o2h>Isi 0 untuk kursus gratis.</small> </div> <button type="submit" class="btn btn-primary btn-block" data-astro-cid-wgwn3o2h>Create Course & Continue to Builder</button> </form> </div> </main> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/courses/new.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/courses/new.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/courses/new.astro";
const $$url = "/admin/courses/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$New,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

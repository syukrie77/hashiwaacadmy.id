import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DbddXOnP.mjs';
import { s as supabase } from '../../chunks/supabase_CLFJcle_.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Users = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Users;
  const user = Astro2.locals.user;
  if (!user || user.role !== "admin") {
    return Astro2.redirect("/login");
  }
  const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  const allUsers = users || [];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "activePage": "users", "title": "User Management", "data-astro-cid-asi4dl7j": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-header" data-astro-cid-asi4dl7j> <h1 data-astro-cid-asi4dl7j>User Management</h1> <div class="filter-group" data-astro-cid-asi4dl7j> <label data-astro-cid-asi4dl7j>Filter:</label> <select id="role-filter" data-astro-cid-asi4dl7j> <option value="" data-astro-cid-asi4dl7j>Semua Role</option> <option value="admin" data-astro-cid-asi4dl7j>Admin</option> <option value="instructor" data-astro-cid-asi4dl7j>Instructor</option> <option value="student" data-astro-cid-asi4dl7j>Student</option> </select> </div> </div> <div class="table-card" data-astro-cid-asi4dl7j> <table id="users-table" data-astro-cid-asi4dl7j> <thead data-astro-cid-asi4dl7j> <tr data-astro-cid-asi4dl7j> <th data-astro-cid-asi4dl7j>Name</th> <th data-astro-cid-asi4dl7j>Email</th> <th data-astro-cid-asi4dl7j>Role</th> <th data-astro-cid-asi4dl7j>Created At</th> <th data-astro-cid-asi4dl7j>Aksi</th> </tr> </thead> <tbody id="users-tbody" data-astro-cid-asi4dl7j> ${allUsers.map((u) => renderTemplate`<tr${addAttribute(u.role, "data-role")} data-astro-cid-asi4dl7j> <td data-astro-cid-asi4dl7j>${u.name}</td> <td data-astro-cid-asi4dl7j>${u.email}</td> <td data-astro-cid-asi4dl7j> <select class="role-select"${addAttribute(u.id, "data-user-id")}${addAttribute(u.role, "data-current-role")} data-astro-cid-asi4dl7j> <option value="student"${addAttribute(u.role === "student", "selected")} data-astro-cid-asi4dl7j>Student</option> <option value="instructor"${addAttribute(u.role === "instructor", "selected")} data-astro-cid-asi4dl7j>Instructor</option> <option value="admin"${addAttribute(u.role === "admin", "selected")} data-astro-cid-asi4dl7j>Admin</option> </select> </td> <td data-astro-cid-asi4dl7j>${new Date(u.created_at).toLocaleDateString("id-ID")}</td> <td data-astro-cid-asi4dl7j> <button class="btn-save save-role"${addAttribute(u.id, "data-user-id")} disabled data-astro-cid-asi4dl7j>Simpan</button> </td> </tr>`)} </tbody> </table> ${allUsers.length === 0 && renderTemplate`<div class="state-message" data-astro-cid-asi4dl7j>Belum ada user terdaftar.</div>`} </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/users.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/users.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/users.astro";
const $$url = "/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Users,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, m as maybeRenderHead, g as addAttribute, r as renderTemplate, h as createAstro, k as renderComponent, n as renderSlot } from './astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from './Layout_5IANKJKH.mjs';
import 'clsx';
/* empty css                           */

const $$Astro$1 = createAstro();
const $$AdminSidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AdminSidebar;
  const { activePage } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<aside class="admin-sidebar" data-astro-cid-dyjmb3d6> <div class="brand" data-astro-cid-dyjmb3d6>Admin Panel</div> <nav data-astro-cid-dyjmb3d6> <a href="/admin/dashboard"${addAttribute(activePage === "overview" ? "active" : "", "class")} data-astro-cid-dyjmb3d6>Overview</a> <a href="/admin/users"${addAttribute(activePage === "users" ? "active" : "", "class")} data-astro-cid-dyjmb3d6>Users</a> <a href="/admin/classes"${addAttribute(activePage === "classes" ? "active" : "", "class")} data-astro-cid-dyjmb3d6>Course Management</a> <div class="nav-divider" data-astro-cid-dyjmb3d6></div> <a href="/admin/courses/new" class="btn-create-sidebar" data-astro-cid-dyjmb3d6>+ New Course</a> </nav> <div class="footer" data-astro-cid-dyjmb3d6> <a href="/dashboard" data-astro-cid-dyjmb3d6>← Kembali ke Dashboard</a> </div> </aside> `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/components/AdminSidebar.astro", void 0);

const $$Astro = createAstro();
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { activePage, title = "Admin Panel" } = Astro2.props;
  const user = Astro2.locals.user;
  if (!user || user.role !== "admin") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "data-astro-cid-hwrjlp2m": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-hwrjlp2m></div> <div class="admin-container" data-astro-cid-hwrjlp2m> ${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "activePage": activePage, "data-astro-cid-hwrjlp2m": true })} <main class="admin-main" data-astro-cid-hwrjlp2m> ${renderSlot($$result2, $$slots["default"])} </main> </div> ` })} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/components/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };

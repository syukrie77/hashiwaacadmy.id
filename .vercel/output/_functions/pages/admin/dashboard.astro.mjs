import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DbddXOnP.mjs';
import { s as supabase } from '../../chunks/supabase_CLFJcle_.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const user = Astro2.locals.user;
  if (!user || user.role !== "admin") {
    return Astro2.redirect("/login");
  }
  const [
    { count: userCount },
    { count: classCount },
    { count: enrollCount },
    { data: payments }
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("classes").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
    supabase.from("payments").select("amount").eq("status", "completed")
  ]);
  const revenue = payments?.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  ) || 0;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "activePage": "overview", "title": "Platform Overview", "data-astro-cid-x6qnsptu": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-header" data-astro-cid-x6qnsptu> <h1 data-astro-cid-x6qnsptu>Platform Overview</h1> <div class="user-info" data-astro-cid-x6qnsptu>Login sebagai: ${user.name}</div> </div> <div class="stats-grid" data-astro-cid-x6qnsptu> <div class="stat-card" data-astro-cid-x6qnsptu> <span class="label" data-astro-cid-x6qnsptu>Total Users</span> <span class="value" data-astro-cid-x6qnsptu>${userCount ?? 0}</span> </div> <div class="stat-card" data-astro-cid-x6qnsptu> <span class="label" data-astro-cid-x6qnsptu>Total Courses</span> <span class="value" data-astro-cid-x6qnsptu>${classCount ?? 0}</span> </div> <div class="stat-card" data-astro-cid-x6qnsptu> <span class="label" data-astro-cid-x6qnsptu>Total Enrollments</span> <span class="value" data-astro-cid-x6qnsptu>${enrollCount ?? 0}</span> </div> <div class="stat-card" data-astro-cid-x6qnsptu> <span class="label" data-astro-cid-x6qnsptu>Total Revenue</span> <span class="value" data-astro-cid-x6qnsptu>Rp ${revenue.toLocaleString("id-ID")}</span> </div> </div> <div class="quick-actions" data-astro-cid-x6qnsptu> <h2 data-astro-cid-x6qnsptu>Quick Actions</h2> <div class="action-buttons" data-astro-cid-x6qnsptu> <a href="/admin/courses/new" class="action-btn" data-astro-cid-x6qnsptu> <span class="icon" data-astro-cid-x6qnsptu>➕</span> <div class="text" data-astro-cid-x6qnsptu> <strong data-astro-cid-x6qnsptu>Buat Course Baru</strong> <p data-astro-cid-x6qnsptu>Mulai membangun jalur pembelajaran baru</p> </div> </a> <a href="/admin/users" class="action-btn" data-astro-cid-x6qnsptu> <span class="icon" data-astro-cid-x6qnsptu>👥</span> <div class="text" data-astro-cid-x6qnsptu> <strong data-astro-cid-x6qnsptu>Kelola Users</strong> <p data-astro-cid-x6qnsptu>Lihat dan kelola akun student/instructor</p> </div> </a> </div> </div> <div class="recent-actions" data-astro-cid-x6qnsptu> <h2 data-astro-cid-x6qnsptu>System Status</h2> <p data-astro-cid-x6qnsptu>Semua layanan beroperasi normal. ✅</p> </div> ` })} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/dashboard.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/admin/dashboard.astro";
const $$url = "/admin/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Dashboard,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

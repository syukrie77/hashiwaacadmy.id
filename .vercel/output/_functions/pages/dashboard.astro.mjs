import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_hC64G2nb.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-3nssi2tu": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-3nssi2tu></div> <div class="dashboard-container" data-astro-cid-3nssi2tu> <div class="header" data-astro-cid-3nssi2tu> <div class="welcome" data-astro-cid-3nssi2tu> <h1 data-astro-cid-3nssi2tu>Dashboard</h1> <p data-astro-cid-3nssi2tu>Welcome back, <span id="user-name" data-astro-cid-3nssi2tu>Student</span>!</p> </div> <div class="header-actions" data-astro-cid-3nssi2tu> <a href="/profile" class="btn btn-outline" data-astro-cid-3nssi2tu>Profile Settings</a> <button id="logout-btn" class="btn btn-outline danger" data-astro-cid-3nssi2tu>Sign Out</button> </div> </div> <div id="loading" class="state-message" data-astro-cid-3nssi2tu> <div class="spinner" data-astro-cid-3nssi2tu></div> <p data-astro-cid-3nssi2tu>Syncing your learning data...</p> </div> <div id="dashboard-content" class="hidden" data-astro-cid-3nssi2tu> <div class="stats-grid" data-astro-cid-3nssi2tu> <div class="stat-card" data-astro-cid-3nssi2tu> <span class="stat-label" data-astro-cid-3nssi2tu>Enrolled Courses</span> <span id="stat-courses" class="stat-value" data-astro-cid-3nssi2tu>0</span> </div> <div class="stat-card" data-astro-cid-3nssi2tu> <span class="stat-label" data-astro-cid-3nssi2tu>Exams Taken</span> <span id="stat-exams" class="stat-value" data-astro-cid-3nssi2tu>0</span> </div> </div> <div class="dashboard-grid" data-astro-cid-3nssi2tu> <section class="main-content" data-astro-cid-3nssi2tu> <div class="section-header" data-astro-cid-3nssi2tu> <h3 data-astro-cid-3nssi2tu>My Courses</h3> <a href="/" class="link" data-astro-cid-3nssi2tu>Find more courses →</a> </div> <div id="enrollments-grid" class="course-grid" data-astro-cid-3nssi2tu> <!-- Courses will be injected here --> </div> <div id="no-enrollments" class="hidden empty-state" data-astro-cid-3nssi2tu> <p data-astro-cid-3nssi2tu>You haven't enrolled in any courses yet.</p> <a href="/" class="btn btn-primary" data-astro-cid-3nssi2tu>Browse Courses</a> </div> </section> <aside class="sidebar" data-astro-cid-3nssi2tu> <section data-astro-cid-3nssi2tu> <h3 data-astro-cid-3nssi2tu>Recent Results</h3> <ul id="results-list" class="activity-list" data-astro-cid-3nssi2tu> <!-- Results injected here --> </ul> <div id="no-results" class="empty-small" data-astro-cid-3nssi2tu>
No exam records yet
</div> </section> </aside> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Dashboard,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

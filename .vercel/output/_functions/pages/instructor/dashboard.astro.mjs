import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_hC64G2nb.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const user = Astro2.locals.user;
  if (!user || user.role !== "instructor") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-4ectyryj": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-4ectyryj></div> <div class="instructor-container" data-astro-cid-4ectyryj> <div class="header" data-astro-cid-4ectyryj> <div class="welcome" data-astro-cid-4ectyryj> <h1 data-astro-cid-4ectyryj>Instructor Dashboard</h1> <p data-astro-cid-4ectyryj>Kelola metrics, course, dan materi pembelajaran Anda</p> </div> </div> <div id="loading" class="state-message" data-astro-cid-4ectyryj> <div class="spinner" data-astro-cid-4ectyryj></div> <p data-astro-cid-4ectyryj>Memuat data course...</p> </div> <div id="dashboard-content" class="hidden" data-astro-cid-4ectyryj> <div class="analytics-grid" data-astro-cid-4ectyryj> <div class="stat-card" data-astro-cid-4ectyryj> <div class="stat-label" data-astro-cid-4ectyryj>Total Siswa</div> <div id="stat-students" class="stat-value" data-astro-cid-4ectyryj>0</div> </div> <div class="stat-card" data-astro-cid-4ectyryj> <div class="stat-label" data-astro-cid-4ectyryj>Course Aktif</div> <div id="stat-active-courses" class="stat-value" data-astro-cid-4ectyryj>0</div> </div> <div class="stat-card" data-astro-cid-4ectyryj> <div class="stat-label" data-astro-cid-4ectyryj>Total Modul</div> <div id="stat-modules" class="stat-value" data-astro-cid-4ectyryj>0</div> </div> <div class="stat-card" data-astro-cid-4ectyryj> <div class="stat-label" data-astro-cid-4ectyryj>Total Materi</div> <div id="stat-materials" class="stat-value" data-astro-cid-4ectyryj>0</div> </div> </div> <div class="section-header" data-astro-cid-4ectyryj> <h3 data-astro-cid-4ectyryj>Course Saya</h3> </div> <div id="courses-grid" class="courses-grid" data-astro-cid-4ectyryj> <!-- Courses will be rendered here --> </div> <div id="no-courses" class="empty-state hidden" data-astro-cid-4ectyryj> <p data-astro-cid-4ectyryj>Anda belum memiliki course.</p> <p class="muted" data-astro-cid-4ectyryj>
Hubungi admin untuk menambahkan Anda sebagai instructor
                    course.
</p> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/dashboard.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/dashboard.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/dashboard.astro";
const $$url = "/instructor/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Dashboard,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

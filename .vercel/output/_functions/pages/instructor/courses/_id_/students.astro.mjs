import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../chunks/Layout_5IANKJKH.mjs';
/* empty css                                             */
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Students = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Students;
  const { id } = Astro2.params;
  const user = Astro2.locals.user;
  if (!user || user.role !== "instructor") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-g4fmreui": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-g4fmreui></div> <div class="instructor-container" data-astro-cid-g4fmreui> <aside class="instructor-sidebar" data-astro-cid-g4fmreui> <div class="brand" data-astro-cid-g4fmreui>Instructor Panel</div> <nav data-astro-cid-g4fmreui> <a href="/instructor/dashboard" data-astro-cid-g4fmreui>Dashboard</a> <a href="#" class="active" data-astro-cid-g4fmreui>Student Progress</a> </nav> <div class="footer" data-astro-cid-g4fmreui> <a href="/instructor/dashboard" data-astro-cid-g4fmreui>Kembali ke Dashboard</a> </div> </aside> <main class="instructor-main" data-astro-cid-g4fmreui> <div class="header" data-astro-cid-g4fmreui> <a href="/instructor/dashboard" class="back-link" data-astro-cid-g4fmreui>← Kembali</a> <h1 id="course-title" data-astro-cid-g4fmreui>Loading Course...</h1> <p data-astro-cid-g4fmreui>Daftar siswa yang terdaftar di course ini.</p> </div> <div class="table-card" data-astro-cid-g4fmreui> <div class="search-bar" data-astro-cid-g4fmreui> <input type="text" id="student-search" placeholder="Cari siswa..." data-astro-cid-g4fmreui> </div> <table id="students-table" data-astro-cid-g4fmreui> <thead data-astro-cid-g4fmreui> <tr data-astro-cid-g4fmreui> <th data-astro-cid-g4fmreui>Nama Siswa</th> <th data-astro-cid-g4fmreui>Email</th> <th data-astro-cid-g4fmreui>Tanggal Join</th> <th data-astro-cid-g4fmreui>Status</th> </tr> </thead> <tbody id="students-tbody" data-astro-cid-g4fmreui> <!-- Data injected here --> </tbody> </table> <div id="loading" class="state-message" data-astro-cid-g4fmreui>Fetching data...</div> <div id="empty-state" class="state-message hidden" data-astro-cid-g4fmreui>
Belum ada siswa yang mendaftar.
</div> </div> </main> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/students.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/students.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/instructor/courses/[id]/students.astro";
const $$url = "/instructor/courses/[id]/students";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Students,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

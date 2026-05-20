import { e as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_VTTAJAsk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_w48e702d.mjs';
import { i as isSupabaseConfigured, s as supabase } from '../chunks/supabase_BbPdcCKu.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let classes = null;
  if (isSupabaseConfigured) {
    try {
      const { data: classesData, error } = await supabase.from("classes").select("*").eq("is_active", true).order("title");
      if (error) {
        console.error("Error fetching classes:", error);
      } else {
        classes = classesData;
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="hero-section" data-astro-cid-j7pv25f6> <div class="hero-content" data-astro-cid-j7pv25f6> <span class="badge-accent" data-astro-cid-j7pv25f6>Japanese Learning Center</span> <h1 data-astro-cid-j7pv25f6>
Dari kelas ke karier,<br data-astro-cid-j7pv25f6><span class="text-primary" data-astro-cid-j7pv25f6>Lokal ke Global.</span> </h1> <p data-astro-cid-j7pv25f6>
Hashiwa Japanese Academy adalah pusat studi bahasa Jepang untuk
				kamu yang siap melangkah lebih jauh. Daftar sekarang dan kuasai
				Jepang bersama kami.
</p> <div class="hero-actions" data-astro-cid-j7pv25f6> <a href="/register" class="btn btn-primary btn-lg" data-astro-cid-j7pv25f6>Daftar Sekarang</a> <a href="#courses" class="btn btn-outline btn-lg" data-astro-cid-j7pv25f6>Lihat Program</a> </div> </div> <div class="hero-image" data-astro-cid-j7pv25f6> <img src="/images/hero-hashiwa.png" alt="Hashiwa Japanese Academy" class="hero-img" data-astro-cid-j7pv25f6> <div class="floating-card" data-astro-cid-j7pv25f6> <span class="dot" data-astro-cid-j7pv25f6></span> <span data-astro-cid-j7pv25f6>Top Quality Courses</span> </div> </div> </section>  <section class="stats-section" data-astro-cid-j7pv25f6> <div class="stats-grid" data-astro-cid-j7pv25f6> <div class="stat-card" data-astro-cid-j7pv25f6> <div class="stat-number" data-astro-cid-j7pv25f6>85.000+</div> <div class="stat-label" data-astro-cid-j7pv25f6>Siswa Terdaftar</div> </div> <div class="stat-card" data-astro-cid-j7pv25f6> <div class="stat-number" data-astro-cid-j7pv25f6>3</div> <div class="stat-label" data-astro-cid-j7pv25f6>Kategori Program</div> </div> <div class="stat-card" data-astro-cid-j7pv25f6> <div class="stat-number" data-astro-cid-j7pv25f6>65+</div> <div class="stat-label" data-astro-cid-j7pv25f6>Kursus Tersedia</div> </div> <div class="stat-card" data-astro-cid-j7pv25f6> <div class="stat-number" data-astro-cid-j7pv25f6>2022</div> <div class="stat-label" data-astro-cid-j7pv25f6>Tahun Berdiri</div> </div> </div> </section>  <section class="categories-section" data-astro-cid-j7pv25f6> <div class="section-header" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <span class="badge-accent" data-astro-cid-j7pv25f6>Program Kami</span> <h2 data-astro-cid-j7pv25f6>Pilih Jalur Karier Anda</h2> </div> </div> <div class="categories-grid" data-astro-cid-j7pv25f6> <div class="category-card category-tokutei" data-astro-cid-j7pv25f6> <div class="category-icon" data-astro-cid-j7pv25f6>🏭</div> <h3 data-astro-cid-j7pv25f6>Tokutei Ginou</h3> <p data-astro-cid-j7pv25f6>Program khusus untuk visa kerja Tokutei Ginou — bekerja di industri Jepang dengan keterampilan spesifik.</p> <span class="category-count" data-astro-cid-j7pv25f6>25 Kursus</span> </div> <div class="category-card category-techno" data-astro-cid-j7pv25f6> <div class="category-icon" data-astro-cid-j7pv25f6>💻</div> <h3 data-astro-cid-j7pv25f6>Techno Shoku</h3> <p data-astro-cid-j7pv25f6>Program teknis untuk kamu yang ingin berkarier di bidang IT dan teknologi di Jepang.</p> <span class="category-count" data-astro-cid-j7pv25f6>10 Kursus</span> </div> <div class="category-card category-reguler" data-astro-cid-j7pv25f6> <div class="category-icon" data-astro-cid-j7pv25f6>📚</div> <h3 data-astro-cid-j7pv25f6>Reguler</h3> <p data-astro-cid-j7pv25f6>Kursus bahasa Jepang reguler dari level N5 hingga N1 — untuk semua tujuan belajar.</p> <span class="category-count" data-astro-cid-j7pv25f6>30 Kursus</span> </div> </div> </section>  <section id="courses" class="courses-section" data-astro-cid-j7pv25f6> <div class="section-header" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <span class="badge-accent" data-astro-cid-j7pv25f6>Top Quality Courses</span> <h2 data-astro-cid-j7pv25f6>Program Unggulan</h2> </div> <a href="/courses" class="link-more" data-astro-cid-j7pv25f6>Lihat Semua →</a> </div> ${(!classes || classes.length === 0) && renderTemplate`<div class="empty-state" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>No courses available at the moment.</p> </div>`} ${classes && classes.length > 0 && renderTemplate`<div class="course-grid" data-astro-cid-j7pv25f6> ${classes.map((course) => renderTemplate`<div class="course-card" data-astro-cid-j7pv25f6> <div class="course-badge" data-astro-cid-j7pv25f6>Course</div> <div class="course-content" data-astro-cid-j7pv25f6> <h3 data-astro-cid-j7pv25f6>${course.title}</h3> <p class="description" data-astro-cid-j7pv25f6>${course.description}</p> <div class="footer" data-astro-cid-j7pv25f6> <span class="price" data-astro-cid-j7pv25f6> ${course.price ? `Rp ${course.price.toLocaleString("id-ID")}` : "Gratis"} </span> <a${addAttribute(`/courses/${course.id}`, "href")} class="btn btn-sm btn-primary" data-astro-cid-j7pv25f6>
Lihat Program
</a> </div> </div> </div>`)} </div>`} </section>  <section class="cta-section" data-astro-cid-j7pv25f6> <div class="cta-card" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>Siap Melangkah Ke Jepang?</h2> <p data-astro-cid-j7pv25f6>
Bergabunglah dengan ribuan alumni kami yang telah sukses
				berkarier di Negeri Sakura.
</p> <div class="cta-actions" data-astro-cid-j7pv25f6> <a href="/contact" class="btn btn-dark btn-lg" data-astro-cid-j7pv25f6>Hubungi Konsultan</a> <a href="https://wa.me/6208776022000" target="_blank" rel="noopener noreferrer" class="btn btn-wa btn-lg" data-astro-cid-j7pv25f6>
💬 WhatsApp 0877 6022 000
</a> </div> </div> </section> ` })} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/index.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

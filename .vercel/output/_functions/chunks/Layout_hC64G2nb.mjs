import { e as createComponent, g as addAttribute, p as renderHead, r as renderTemplate, k as renderComponent, n as renderSlot, l as renderScript, h as createAstro, q as Fragment } from './astro/server_BeBNlddD.mjs';
import 'piccolore';
/* empty css                           */

const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Hashiwa E-Learning",
    description = "Hashiwa Japanese Academy \u2014 Pusat studi bahasa Jepang untuk kamu yang siap melangkah dari lokal ke global."
  } = Astro2.props;
  const user = Astro2.locals.user;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title} | Hashiwa Japanese Academy</title><meta name="description"${addAttribute(description, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body> <header> <nav> <div class="logo">Hashiwa</div> <button class="mobile-menu-toggle" aria-label="Toggle Menu"> <span></span> <span></span> <span></span> </button> <div id="nav-overlay" class="nav-overlay"></div> <div class="nav-container"> <ul class="nav-links"> <li><a href="/">Home</a></li> <li><a href="/dashboard">Dashboard</a></li> ${user?.role === "admin" && renderTemplate`<li> <a href="/admin/dashboard" style="color: #ef4444; font-weight: 700;">
Admin
</a> </li>`} ${user?.role === "instructor" && renderTemplate`<li> <a href="/instructor/dashboard" style="color: #059669; font-weight: 700;">
Instructor
</a> </li>`} </ul> <div class="auth-buttons" id="nav-auth-buttons"> ${user ? renderTemplate`<div class="user-pill-container" style="display:flex; gap:10px; align-items:center;"> <div class="user-pill"> <a href="/profile" class="profile-link"> <span class="user-name"> ${user.name} </span> <span class="user-role-tag"> ${user.role} </span> </a> </div> <button id="logout-btn" class="btn btn-outline" style="padding: 0.4rem 0.8rem; border-color: #ef4444; color: #ef4444; line-height: 1;">
Logout
</button> </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <a href="/login" class="btn btn-outline">
Login
</a> <a href="/register" class="btn btn-primary">
Sign Up
</a> ` })}`} </div> </div> </nav> </header> <main> ${renderSlot($$result, $$slots["default"])} </main> ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} <footer> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Hashiwa E-Learning. All rights reserved.</p> </footer> </body></html>`;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };

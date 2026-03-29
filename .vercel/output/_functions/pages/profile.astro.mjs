import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_hC64G2nb.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-wwes6yjo": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="user-data"${addAttribute(JSON.stringify(user), "data-user")} class="hidden" data-astro-cid-wwes6yjo></div> <div class="profile-container" data-astro-cid-wwes6yjo> <h1 data-astro-cid-wwes6yjo>Account Settings</h1> <div class="profile-card" data-astro-cid-wwes6yjo> <div class="avatar-section" data-astro-cid-wwes6yjo> <div class="avatar-circle" id="avatar-placeholder" data-astro-cid-wwes6yjo>?</div> <div class="info" data-astro-cid-wwes6yjo> <h2 id="display-name" data-astro-cid-wwes6yjo>Loading...</h2> <p id="display-role" class="role-badge" data-astro-cid-wwes6yjo>Student</p> </div> </div> <form id="profile-form" data-astro-cid-wwes6yjo> <div class="form-grid" data-astro-cid-wwes6yjo> <div class="form-group" data-astro-cid-wwes6yjo> <label for="name" data-astro-cid-wwes6yjo>Full Name</label> <input type="text" id="name" name="name" required data-astro-cid-wwes6yjo> </div> <div class="form-group" data-astro-cid-wwes6yjo> <label for="email" data-astro-cid-wwes6yjo>Email Address</label> <input type="email" id="email" name="email" readonly disabled data-astro-cid-wwes6yjo> <small data-astro-cid-wwes6yjo>Email cannot be changed contact admin.</small> </div> <div class="form-group" data-astro-cid-wwes6yjo> <label for="phone" data-astro-cid-wwes6yjo>Phone Number</label> <input type="tel" id="phone" name="phone" placeholder="+62..." data-astro-cid-wwes6yjo> </div> <div class="form-group" data-astro-cid-wwes6yjo> <label for="avatar_url" data-astro-cid-wwes6yjo>Avatar URL</label> <input type="url" id="avatar_url" name="avatar_url" placeholder="https://..." data-astro-cid-wwes6yjo> </div> </div> <div class="form-actions" data-astro-cid-wwes6yjo> <button type="submit" class="btn btn-primary" data-astro-cid-wwes6yjo>Save Changes</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/profile.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/profile.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Profile,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

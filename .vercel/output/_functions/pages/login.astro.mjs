import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DH5mszyI.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_5IANKJKH.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-sgpqyurt": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="auth-container" data-astro-cid-sgpqyurt> <div class="auth-card" data-astro-cid-sgpqyurt> <h2 data-astro-cid-sgpqyurt>Welcome Back</h2> <p class="subtitle" data-astro-cid-sgpqyurt>Sign in to continue learning</p> <form class="auth-form" id="login-form" data-astro-cid-sgpqyurt> <div class="form-group" data-astro-cid-sgpqyurt> <label for="email" data-astro-cid-sgpqyurt>Email Address</label> <input type="email" id="email" name="email" required placeholder="you@example.com" data-astro-cid-sgpqyurt> </div> <div class="form-group" data-astro-cid-sgpqyurt> <label for="password" data-astro-cid-sgpqyurt>Password</label> <input type="password" id="password" name="password" required placeholder="••••••••" data-astro-cid-sgpqyurt> </div> <button type="submit" class="btn btn-primary btn-block" data-astro-cid-sgpqyurt>Sign In</button> </form> <p class="footer-text" data-astro-cid-sgpqyurt>
Don't have an account? <a href="/register" data-astro-cid-sgpqyurt>Sign Up</a> </p> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/login.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/login.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Login,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

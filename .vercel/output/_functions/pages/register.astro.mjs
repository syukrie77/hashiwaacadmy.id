import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BeBNlddD.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_hC64G2nb.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-qraosrxq": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="auth-container" data-astro-cid-qraosrxq> <div class="auth-card" data-astro-cid-qraosrxq> <h2 data-astro-cid-qraosrxq>Create Account</h2> <p class="subtitle" data-astro-cid-qraosrxq>Join Hashiwa E-Learning today</p> <form class="auth-form" id="register-form" data-astro-cid-qraosrxq> <div class="form-group" data-astro-cid-qraosrxq> <label for="name" data-astro-cid-qraosrxq>Full Name</label> <input type="text" id="name" name="name" required placeholder="John Doe" data-astro-cid-qraosrxq> </div> <div class="form-group" data-astro-cid-qraosrxq> <label for="email" data-astro-cid-qraosrxq>Email Address</label> <input type="email" id="email" name="email" required placeholder="you@example.com" data-astro-cid-qraosrxq> </div> <div class="form-group" data-astro-cid-qraosrxq> <label for="password" data-astro-cid-qraosrxq>Password</label> <input type="password" id="password" name="password" required placeholder="Create a password" data-astro-cid-qraosrxq> </div> <button type="submit" class="btn btn-primary btn-block" data-astro-cid-qraosrxq>Sign Up</button> </form> <p class="footer-text" data-astro-cid-qraosrxq>
Already have an account? <a href="/login" data-astro-cid-qraosrxq>Sign In</a> </p> </div> </div> ` })} ${renderScript($$result, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/register.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/register.astro", void 0);

const $$file = "C:/Users/syukr/Proyek/E-Learning-Hashiwa-Figma/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Register,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

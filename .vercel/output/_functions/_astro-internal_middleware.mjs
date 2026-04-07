import { d as defineMiddleware, s as sequence } from './chunks/index_CAVbSk8R.mjs';
import { g as getSupabaseServerClient } from './chunks/supabase_CLFJcle_.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_B0Kl6Wwy.mjs';
import 'piccolore';
import './chunks/astro/server_DH5mszyI.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const isStaticAsset = path.startsWith("/favicon") || path.startsWith("/_astro");
  if (isStaticAsset) {
    return next();
  }
  const publicPaths = ["/", "/login", "/register"];
  const isPublicPage = publicPaths.includes(path);
  const isApiRoute = path.startsWith("/api/");
  context.locals.user = null;
  if (!isPublicPage) {
    try {
      const supabaseServer = getSupabaseServerClient(context);
      const { data: { user }, error } = await supabaseServer.auth.getUser();
      if (error) {
        console.error("[Middleware] getUser error:", error.message);
      }
      if (user) {
        try {
          const { data: profile, error: profileError } = await supabaseServer.from("users").select("*").eq("id", user.id).single();
          if (profileError) {
            console.error("[Middleware] Profile fetch error:", profileError.message);
          }
          const profileData = profile;
          if (profileData) {
            context.locals.user = {
              id: user.id,
              name: profileData.name,
              email: user.email,
              role: profileData.role
            };
          } else {
            const metaRole = user.app_metadata?.role || user.user_metadata?.role || "student";
            console.warn(
              `[Middleware] Profile not found for ${user.email}. Using metadata role: ${metaRole}`
            );
            context.locals.user = {
              id: user.id,
              name: user.user_metadata?.name || user.email.split("@")[0],
              email: user.email,
              role: metaRole
            };
          }
        } catch (profileErr) {
          console.error("[Middleware] Profile fetch crashed:", profileErr);
          const metaRole = user.app_metadata?.role || user.user_metadata?.role || "student";
          context.locals.user = {
            id: user.id,
            name: user.user_metadata?.name || user.email.split("@")[0],
            email: user.email,
            role: metaRole
          };
        }
      }
    } catch (err) {
      console.error("[Middleware] Auth check failed:", err);
      context.locals.user = null;
    }
  }
  if (!isApiRoute) {
    const isLoggedIn = !!context.locals.user;
    const userRole = context.locals.user?.role;
    if (path.startsWith("/admin")) {
      if (!isLoggedIn) return context.redirect("/login");
      if (userRole !== "admin") return context.redirect("/dashboard");
    }
    if (path.startsWith("/instructor")) {
      if (!isLoggedIn) return context.redirect("/login");
      if (userRole !== "instructor" && userRole !== "admin") {
        return context.redirect("/dashboard");
      }
    }
    const protectedRoutes = ["/dashboard", "/profile", "/courses/*/learn", "/courses/*/exams"];
    const isProtected = protectedRoutes.some((route) => {
      if (route.includes("*")) {
        const regex = new RegExp("^" + route.replace("*", ".*"));
        return regex.test(path);
      }
      return path.startsWith(route);
    });
    if (isProtected && !isLoggedIn) {
      return context.redirect("/login?redirect=" + encodeURIComponent(path));
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };

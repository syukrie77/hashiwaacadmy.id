import { d as defineMiddleware, s as sequence } from './chunks/index_VXhmQjC3.mjs';
import { g as getSupabaseServerClient, s as supabase } from './chunks/supabase_DDcE5sYV.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_Bd2OqEtw.mjs';
import 'piccolore';
import './chunks/astro/server_BeBNlddD.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const isStaticAsset = path.startsWith("/favicon") || path.startsWith("/_astro");
  const isApiRoute = path.startsWith("/api/");
  path.startsWith("/api/auth/");
  if (isStaticAsset) {
    return next();
  }
  const supabaseServer = getSupabaseServerClient(context);
  const { data: { user }, error } = await supabaseServer.auth.getUser();
  if (user) {
    const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single();
    if (profileError) {
      console.error("Error fetching user profile:", profileError.message, profileError.code);
    }
    if (profile) {
      context.locals.user = {
        id: user.id,
        name: profile.name,
        email: user.email,
        role: profile.role
      };
    } else {
      const metaRole = user.app_metadata?.role || user.user_metadata?.role || "student";
      console.warn(
        `Profile not found for ${user.email} (RLS error?). Using metadata role: ${metaRole}`
      );
      context.locals.user = {
        id: user.id,
        name: user.user_metadata?.name || user.email.split("@")[0],
        email: user.email,
        role: metaRole
      };
    }
  } else {
    context.locals.user = null;
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

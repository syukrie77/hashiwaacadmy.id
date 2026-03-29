import { defineMiddleware } from "astro:middleware";
import { getSupabaseServerClient, supabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);
    const path = url.pathname;

    // Skip auth check ONLY for static assets
    const publicPaths = ["/", "/login", "/register"];
    const isPublicPage = publicPaths.includes(path);
    const isStaticAsset = path.startsWith("/favicon") || path.startsWith("/_astro");
    const isApiRoute = path.startsWith("/api/");
    const isAuthApi = path.startsWith("/api/auth/");

    if (isStaticAsset) {
        return next();
    }

    // 1. Initialize Supabase SSR client (ONLY for auth.getUser - talks to GoTrue, not PostgREST)
    const supabaseServer = getSupabaseServerClient(context);

    // 2. Validate session directly from Supabase via getUser()
    const { data: { user }, error } = await supabaseServer.auth.getUser();

    // 3. Inject user data into Astro.locals if valid
    if (user) {
        // Fetch profile using BASIC client (avoids PostgREST "role "" does not exist" error)
        const { data: profile, error: profileError } = await (supabase as any)
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            console.error("Error fetching user profile:", profileError.message, profileError.code);
        }

        if (profile) {
            context.locals.user = {
                id: user.id,
                name: profile.name,
                email: user.email!,
                role: profile.role,
            };
        } else {
            // Fallback: try to read role from auth metadata (set via SQL)
            const metaRole =
                user.app_metadata?.role ||
                user.user_metadata?.role ||
                "student";
            console.warn(
                `Profile not found for ${user.email} (RLS error?). Using metadata role: ${metaRole}`
            );
            context.locals.user = {
                id: user.id,
                name: user.user_metadata?.name || user.email!.split("@")[0],
                email: user.email!,
                role: metaRole,
            };
        }
    } else {
        context.locals.user = null;
    }

    // 4. Implement Route Protection System (ONLY for page routes, NOT API routes)
    //    API routes handle their own authorization and return JSON errors
    if (!isApiRoute) {
        const isLoggedIn = !!context.locals.user;
        const userRole = context.locals.user?.role;

        // A. Protect /admin routes
        if (path.startsWith("/admin")) {
            if (!isLoggedIn) return context.redirect("/login");
            if (userRole !== "admin") return context.redirect("/dashboard");
        }

        // B. Protect /instructor routes
        if (path.startsWith("/instructor")) {
            if (!isLoggedIn) return context.redirect("/login");
            if (userRole !== "instructor" && userRole !== "admin") {
                return context.redirect("/dashboard");
            }
        }

        // C. Protect general authorized routes
        const protectedRoutes = ["/dashboard", "/profile", "/courses/*/learn", "/courses/*/exams"];
        const isProtected = protectedRoutes.some(route => {
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

    // Pass control to the next middleware or request handler
    return next();
});

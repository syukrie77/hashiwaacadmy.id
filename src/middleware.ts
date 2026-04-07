import { defineMiddleware } from "astro:middleware";
import { getSupabaseServerClient } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);
    const path = url.pathname;

    // Skip entirely for static assets
    const isStaticAsset = path.startsWith("/favicon") || path.startsWith("/_astro");
    if (isStaticAsset) {
        return next();
    }

    // Public paths that don't need auth check at all
    const publicPaths = ["/", "/login", "/register"];
    // Auth routes and Xendit webhook don't need session validation
    const isPublicApiRoute =
        path.startsWith("/api/auth/") ||
        path === "/api/payments/xendit-webhook";
    const isPublicPage = publicPaths.includes(path);
    const isApiRoute = path.startsWith("/api/");

    // Default: no user
    context.locals.user = null;

    // Only attempt Supabase auth for non-public pages and API routes that need it
    if (!isPublicPage && !isPublicApiRoute) {
        try {
            // 1. Initialize Supabase SSR client
            const supabaseServer = getSupabaseServerClient(context);

            // 2. Validate session directly from Supabase via getUser()
            const { data: { user }, error } = await supabaseServer.auth.getUser();

            if (error) {
                console.error("[Middleware] getUser error:", error.message);
            }

            // 3. Inject user data into Astro.locals if valid
            if (user) {
                try {
                    // Fetch profile using SERVER client (avoids PostgREST issues)
                    const { data: profile, error: profileError } = await supabaseServer
                        .from("users")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                    if (profileError) {
                        console.error("[Middleware] Profile fetch error:", profileError.message);
                    }

                    const profileData = profile as any;
                    if (profileData) {
                        context.locals.user = {
                            id: user.id,
                            name: profileData.name,
                            email: user.email!,
                            role: profileData.role,
                        };
                    } else {
                        // Fallback: try to read role from auth metadata (set via SQL)
                        const metaRole =
                            user.app_metadata?.role ||
                            user.user_metadata?.role ||
                            "student";
                        console.warn(
                            `[Middleware] Profile not found for ${user.email}. Using metadata role: ${metaRole}`
                        );
                        context.locals.user = {
                            id: user.id,
                            name: user.user_metadata?.name || user.email!.split("@")[0],
                            email: user.email!,
                            role: metaRole,
                        };
                    }
                } catch (profileErr) {
                    console.error("[Middleware] Profile fetch crashed:", profileErr);
                    // Still set user from auth data even if profile fetch fails
                    const metaRole =
                        user.app_metadata?.role ||
                        user.user_metadata?.role ||
                        "student";
                    context.locals.user = {
                        id: user.id,
                        name: user.user_metadata?.name || user.email!.split("@")[0],
                        email: user.email!,
                        role: metaRole,
                    };
                }
            }
        } catch (err) {
            // CRITICAL: Never crash the middleware - log and continue as unauthenticated
            console.error("[Middleware] Auth check failed:", err);
            context.locals.user = null;
        }
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
        const protectedRoutes = ["/dashboard", "/profile", "/payment", "/courses/*/learn", "/courses/*/exams"];
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

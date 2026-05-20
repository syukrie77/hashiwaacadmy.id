import 'es-module-lexer';
import './chunks/shared_B6bdXPNh.mjs';
import 'piccolore';
import { o as originPathnameSymbol, A as AstroError, F as ForbiddenRewrite } from './chunks/astro/server_VTTAJAsk.mjs';
import 'clsx';
import 'html-escaper';
import { g as getSupabaseServerClient } from './chunks/supabase_BbPdcCKu.mjs';
import { a as appendForwardSlash, r as removeTrailingForwardSlash } from './chunks/path_BV6vj9ag.mjs';

function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}

function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
  if (!pathname) {
    pathname = "/";
  }
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  let finalPathname;
  if (pathname === "/") {
    finalPathname = "/";
  } else if (shouldAppendSlash) {
    finalPathname = appendForwardSlash(pathname);
  } else {
    finalPathname = removeTrailingForwardSlash(pathname);
  }
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}

function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(pathname) || route.fallbackRoutes.map((fallbackRoute) => fallbackRoute.pattern.exec(pathname)).find((x) => x);
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}

const apiContextRoutesSymbol = Symbol.for("context.routes");

function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, async (payload) => {
        if (i < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request.clone());
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request.clone()
              );
            }
            const oldPathname = handleContext.url.pathname;
            const pipeline = Reflect.get(handleContext, apiContextRoutesSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            if (pipeline.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(
                  handleContext.url.pathname,
                  pathname,
                  routeData.component
                ),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.params = getParams(routeData, pathname);
            handleContext.routePattern = routeData.route;
            setOriginPathname(
              handleContext.request,
              oldPathname,
              pipeline.manifest.trailingSlash,
              pipeline.manifest.buildFormat
            );
          }
          return applyHandle(i + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
  });
}

function defineMiddleware(fn) {
  return fn;
}

const onRequest$1 = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const isStaticAsset = path.startsWith("/favicon") || path.startsWith("/_astro");
  if (isStaticAsset) {
    return next();
  }
  const publicPaths = ["/", "/login", "/register"];
  const isPublicApiRoute = path.startsWith("/api/auth/") || path === "/api/payments/xendit-webhook";
  const isPublicPage = publicPaths.includes(path);
  const isApiRoute = path.startsWith("/api/");
  context.locals.user = null;
  if (!isPublicPage && !isPublicApiRoute) {
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
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      "/payment",
      "/courses/*/learn",
      "/courses/*/exams",
      "/courses/*/assignments"
    ];
    const isProtected = protectedRoutes.some((route) => {
      if (route.includes("*")) {
        const escaped = route.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp("^" + escaped.replace("\\*", "[^/]+"));
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

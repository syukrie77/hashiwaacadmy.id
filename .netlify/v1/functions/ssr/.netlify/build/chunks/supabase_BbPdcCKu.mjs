import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

const supabaseUrl = typeof process !== "undefined" && process.env.PUBLIC_SUPABASE_URL ? process.env.PUBLIC_SUPABASE_URL : "https://api.hashiwaacademy.id";
const supabaseKey = typeof process !== "undefined" && process.env.PUBLIC_SUPABASE_ANON_KEY ? process.env.PUBLIC_SUPABASE_ANON_KEY : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTI2NDA3LCJleHAiOjE5Mjk2MDY0MDd9.gnS8W2NYNTLlqpR-ewzn8L2Lm2kdsnV3LVDY9wqj-kM";
const supabaseInternalUrl = typeof process !== "undefined" && process.env.SUPABASE_INTERNAL_URL ? process.env.SUPABASE_INTERNAL_URL : "";
const serverUrl = supabaseInternalUrl || supabaseUrl;
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);
if (!isSupabaseConfigured) {
  console.warn(
    "[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY environment variables. The app will run in degraded mode."
  );
}
if (supabaseInternalUrl) {
  console.log(`[Supabase] Using internal URL for server-side: ${supabaseInternalUrl}`);
}
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key"
);
const getSupabaseServerClient = (context) => {
  if (!serverUrl || !supabaseKey) {
    throw new Error(
      "[Supabase] Cannot create server client: missing SUPABASE URL or ANON_KEY."
    );
  }
  return createServerClient(
    serverUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          const parsed = parseCookieHeader(context.request.headers.get("Cookie") ?? "");
          return parsed.map((c) => ({ name: c.name, value: c.value || "" }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            context.cookies.set(name, value, options);
          });
        }
      }
    }
  );
};

export { getSupabaseServerClient as g, isSupabaseConfigured as i, supabase as s };

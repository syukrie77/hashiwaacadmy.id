import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

const supabaseUrl = "http://101.32.239.76:8001";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTI2NDA3LCJleHAiOjE5Mjk2MDY0MDd9.gnS8W2NYNTLlqpR-ewzn8L2Lm2kdsnV3LVDY9wqj-kM";
const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
const getSupabaseServerClient = (context) => {
  return createServerClient(
    supabaseUrl,
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

export { getSupabaseServerClient as g, supabase as s };

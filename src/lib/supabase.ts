import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error(
        'Error: Missing environment variables. Please check your .env file and ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set.'
    );
}

// Client-side Supabase client (used for public operations or when logged in on the client side)
export const supabase = createClient<Database>(
    supabaseUrl,
    supabaseKey
);

// Server-side Supabase client for Astro SSR (handles cookies)
export const getSupabaseServerClient = (context: any) => {
    return createServerClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    const parsed = parseCookieHeader(context.request.headers.get('Cookie') ?? '');
                    return parsed.map(c => ({ name: c.name, value: c.value || '' }));
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        context.cookies.set(name, value, options);
                    });
                },
            },
        }
    );
};

import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { Database } from '../types/database';

// PUBLIC_SUPABASE_URL: used for client-side (browser) requests
// SUPABASE_INTERNAL_URL: used for server-side in Docker (internal network, faster)
// process.env is used as primary source for server-side runtime env vars (Docker).
// import.meta.env is Vite's build-time replacement — empty if build args weren't passed.
const supabaseUrl = (typeof process !== 'undefined' && process.env.PUBLIC_SUPABASE_URL)
    ? process.env.PUBLIC_SUPABASE_URL
    : (import.meta.env.PUBLIC_SUPABASE_URL as string || '');
const supabaseKey = (typeof process !== 'undefined' && process.env.PUBLIC_SUPABASE_ANON_KEY)
    ? process.env.PUBLIC_SUPABASE_ANON_KEY
    : (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string || '');
const supabaseInternalUrl = (typeof process !== 'undefined' && process.env.SUPABASE_INTERNAL_URL)
    ? process.env.SUPABASE_INTERNAL_URL
    : (import.meta.env.SUPABASE_INTERNAL_URL as string || '');

// Server-side URL: prefer internal URL if available (Docker), fallback to public URL
const serverUrl = supabaseInternalUrl || supabaseUrl;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
    console.warn(
        '[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY environment variables. ' +
        'The app will run in degraded mode.'
    );
}

if (supabaseInternalUrl) {
    console.log(`[Supabase] Using internal URL for server-side: ${supabaseInternalUrl}`);
}

// Client-side Supabase client (uses PUBLIC_SUPABASE_URL — must be accessible from browser)
export const supabase = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
);

// Server-side Supabase client for Astro SSR (uses internal URL if available)
export const getSupabaseServerClient = (context: any) => {
    if (!serverUrl || !supabaseKey) {
        throw new Error(
            '[Supabase] Cannot create server client: missing SUPABASE URL or ANON_KEY.'
        );
    }

    return createServerClient<Database>(
        serverUrl,
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

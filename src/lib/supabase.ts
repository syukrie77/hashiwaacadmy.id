import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string || '';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
    console.warn(
        '[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY environment variables. ' +
        'The app will run in degraded mode. Please set these in your .env file (local) or Vercel Environment Variables (production).'
    );
}

// Client-side Supabase client (used for public operations or when logged in on the client side)
// Uses placeholder values if not configured to avoid crashes at import time
export const supabase = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
);

// Server-side Supabase client for Astro SSR (handles cookies)
export const getSupabaseServerClient = (context: any) => {
    if (!isSupabaseConfigured) {
        throw new Error(
            '[Supabase] Cannot create server client: missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY. ' +
            'Please set these in Vercel Environment Variables.'
        );
    }

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

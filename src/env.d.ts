/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        } | null;
    }
}

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly SUPABASE_INTERNAL_URL: string;
    readonly XENDIT_API_KEY: string;
    readonly XENDIT_WEBHOOK_TOKEN: string;
    readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

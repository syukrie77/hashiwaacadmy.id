import type { APIRoute } from "astro";
import { getSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async (context) => {
    const supabase = getSupabaseServerClient(context);

    // This will clear the session cookies as defined in createServerClient
    const { error } = await supabase.auth.signOut();

    if (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(
        JSON.stringify({ message: "Logout successful" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};

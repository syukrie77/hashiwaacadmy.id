import type { APIRoute } from "astro";
import { getSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return new Response(
            JSON.stringify({ error: "Email and password are required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const supabase = getSupabaseServerClient(context);

    // Authenticate using Supabase Auth, this will set the cookies automatically
    // because we configured createServerClient to use context.cookies.set
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(
        JSON.stringify({ message: "Login successful", user: { id: data.user.id, email: data.user.email } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};

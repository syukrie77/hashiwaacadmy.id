import type { APIRoute } from "astro";
import { getSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const name = formData.get("name")?.toString() || "";
    // SECURITY: Always force role to 'student' for self-registration
    // Only admins can promote users to instructor/admin via admin panel
    const role = "student";

    if (!email || !password) {
        return new Response(
            JSON.stringify({ error: "Email and password are required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (password.length < 6) {
        return new Response(
            JSON.stringify({ error: "Password harus minimal 6 karakter" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const supabase = getSupabaseServerClient(context);

    // Sign up using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (data.user) {
        // Insert metadata to the custom users table
        const { error: profileError } = await (supabase as any).from("users").insert({
            id: data.user.id,
            name,
            email,
            role,
        });

        if (profileError) {
            console.error("Profile creation error:", profileError);
            // NOTE: We don't fail here since the auth account is created, but it's something to log
        }
    }

    return new Response(
        JSON.stringify({ message: "Registration successful" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};

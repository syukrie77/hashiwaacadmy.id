import type { APIRoute } from "astro";
import { getSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async (context) => {
    try {
        console.log("[API/LOGIN] Request received");
        
        const formData = await context.request.formData();
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        console.log("[API/LOGIN] Email:", email, "Password length:", password?.length);

        if (!email || !password) {
            console.error("[API/LOGIN] Missing email or password");
            return new Response(
                JSON.stringify({ error: "Email and password are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log("[API/LOGIN] Initializing Supabase server client...");
        let supabase;
        try {
            supabase = getSupabaseServerClient(context);
            console.log("[API/LOGIN] Supabase client initialized");
        } catch (clientErr) {
            console.error("[API/LOGIN] Failed to initialize Supabase client:", clientErr);
            return new Response(
                JSON.stringify({ 
                    error: "Failed to initialize auth service",
                    details: clientErr instanceof Error ? clientErr.message : String(clientErr)
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Authenticate using Supabase Auth
        console.log("[API/LOGIN] Attempting signInWithPassword...");
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("[API/LOGIN] Auth error:", error.message, "Code:", error.code);
            return new Response(
                JSON.stringify({ 
                    error: error.message,
                    code: error.code 
                }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!data.user) {
            console.error("[API/LOGIN] No user data returned from Supabase");
            return new Response(
                JSON.stringify({ error: "No user data returned" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log("[API/LOGIN] Login successful for user:", data.user.email);
        return new Response(
            JSON.stringify({ 
                message: "Login successful", 
                user: { id: data.user.id, email: data.user.email } 
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[API/LOGIN] Unexpected error:", err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        return new Response(
            JSON.stringify({ 
                error: "Internal server error",
                details: errorMsg
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

// Gunakan admin client dengan service role key untuk bypass email confirmation.
// Self-hosted Supabase biasanya tidak punya SMTP dikonfigurasi, sehingga
// supabase.auth.signUp() akan gagal dengan "Error sending confirmation email".
// admin.createUser() dengan email_confirm: true membuat user langsung aktif.
function getAdminClient() {
    const url =
        process.env.SUPABASE_INTERNAL_URL ||
        process.env.PUBLIC_SUPABASE_URL ||
        import.meta.env.PUBLIC_SUPABASE_URL ||
        "";
    const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!url || !serviceKey) {
        throw new Error("[register] SUPABASE_SERVICE_ROLE_KEY tidak dikonfigurasi");
    }
    return createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const email = formData.get("email")?.toString()?.trim();
    const password = formData.get("password")?.toString();
    const name = formData.get("name")?.toString()?.trim() || "";
    // SECURITY: Always force role to 'student' for self-registration.
    // Only admins can promote users to instructor/admin via admin panel.
    const role = "student";

    if (!email || !password) {
        return new Response(
            JSON.stringify({ error: "Email dan password wajib diisi" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (password.length < 6) {
        return new Response(
            JSON.stringify({ error: "Password harus minimal 6 karakter" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    let adminClient: ReturnType<typeof createClient>;
    try {
        adminClient = getAdminClient();
    } catch (configErr: any) {
        console.error("[register] Config error:", configErr.message);
        return new Response(
            JSON.stringify({ error: "Konfigurasi server tidak lengkap. Hubungi admin." }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    // Buat user via Admin API — email_confirm: true agar langsung aktif tanpa email konfirmasi.
    // Ini solusi untuk self-hosted Supabase tanpa SMTP terkonfigurasi.
    const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
    });

    if (error) {
        console.error("[register] Auth admin createUser error:", error.message);
        // Tangani duplikat email dengan pesan yang lebih ramah
        if (error.message.toLowerCase().includes("already") || error.status === 422) {
            return new Response(
                JSON.stringify({ error: "Email sudah terdaftar" }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (data.user) {
        // Simpan data profil ke tabel users kustom.
        // Jika trigger handle_auth_user_created sudah aktif di DB, ini akan di-skip (ON CONFLICT).
        const { error: profileError } = await (adminClient as any).from("users").upsert({
            id: data.user.id,
            name: name || email.split("@")[0],
            email,
            role,
        }, { onConflict: "id" });

        if (profileError) {
            // Bukan error fatal — auth user sudah dibuat, profil bisa dibuat ulang via trigger
            console.error("[register] Profile upsert error:", profileError.message);
        }
    }

    return new Response(
        JSON.stringify({ message: "Registrasi berhasil! Silakan login." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};

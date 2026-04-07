import type { APIRoute } from "astro";
import { getSupabaseServerClient } from "../../../lib/supabase";

export const GET: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const paymentId = context.url.searchParams.get("id");
    if (!paymentId) {
        return new Response(JSON.stringify({ error: "Missing payment id" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const supabase = getSupabaseServerClient(context);

    const { data: payment, error } = await supabase
        .from("payments")
        .select("id, status, amount, class_id, module_id, payment_type")
        .eq("id", paymentId)
        .eq("user_id", user.id) // pastikan hanya pemilik yang bisa cek
        .single();

    if (error || !payment) {
        return new Response(JSON.stringify({ error: "Payment not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ status: payment.status }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

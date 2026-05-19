import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const GET: APIRoute = async (context) => {
    const user = context.locals.user;
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { id } = context.params;
    if (!id) {
        return new Response(JSON.stringify({ error: "Course ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const [
        { data: course },
        { data: modules },
        { data: materials },
        { data: assignments },
        { data: exams },
    ] = await Promise.all([
        (supabase as any).from("classes").select("*").eq("id", id).single(),
        (supabase as any).from("modules").select("*").eq("class_id", id).order("order_no"),
        (supabase as any)
            .from("materials")
            .select("*, modules!inner(class_id)")
            .eq("modules.class_id", id)
            .order("order_no"),
        (supabase as any).from("assignments").select("*").eq("class_id", id),
        (supabase as any).from("exams").select("*").eq("class_id", id),
    ]);

    if (!course) {
        return new Response(JSON.stringify({ error: "Course not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Instructor can only access their own courses
    if (user.role === "instructor" && (course as any).owner_id !== user.id) {
        return new Response(JSON.stringify({ error: "Access denied" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(
        JSON.stringify({ course, modules, materials, assignments, exams }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};

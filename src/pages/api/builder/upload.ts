import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_PDF_SIZE = 50 * 1024 * 1024;    // 50MB
const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const VALID_PDF_TYPES = ["application/pdf"];

const JSON_HEADERS = { "Content-Type": "application/json" };

function jsonError(message: string, status: number) {
    return new Response(JSON.stringify({ error: message }), { status, headers: JSON_HEADERS });
}

// POST /api/builder/upload — proxy file upload to Supabase Storage
export const POST: APIRoute = async (context) => {
    try {
        const user = context.locals.user;
        if (!user || (user.role !== "admin" && user.role !== "instructor")) {
            return jsonError("Unauthorized", 403);
        }

        let formData: FormData;
        try {
            formData = await context.request.formData();
        } catch {
            return jsonError("Invalid form data", 400);
        }

        const file = formData.get("file") as File | null;
        const courseId = formData.get("courseId")?.toString();

        if (!file || !courseId) {
            return jsonError("File dan courseId diperlukan", 400);
        }

        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const fileExt = fileName.split(".").pop() || "unknown";
        const isVideo = VALID_VIDEO_TYPES.includes(fileType) || ["mp4","webm","ogg","mov","avi","mkv"].includes(fileExt);
        const isPdf = VALID_PDF_TYPES.includes(fileType) || fileExt === "pdf";

        if (!isVideo && !isPdf) {
            return jsonError(`Format tidak didukung: ${fileType || fileExt}`, 400);
        }

        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_PDF_SIZE;
        if (file.size > maxSize) {
            const maxMB = isVideo ? 500 : 50;
            return jsonError(`Ukuran file melebihi batas ${maxMB}MB`, 400);
        }

        const filePath = `${courseId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await (supabase as any).storage
            .from("materials")
            .upload(filePath, fileBuffer, {
                contentType: fileType || (isVideo ? "video/mp4" : "application/pdf"),
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            return jsonError(uploadError.message, 500);
        }

        const { data: { publicUrl } } = (supabase as any).storage
            .from("materials")
            .getPublicUrl(filePath);

        return new Response(JSON.stringify({ publicUrl }), {
            status: 200,
            headers: JSON_HEADERS,
        });
    } catch (err) {
        console.error("[upload] Unhandled error:", err);
        return jsonError(
            err instanceof Error ? err.message : "Terjadi kesalahan saat upload",
            500
        );
    }
};

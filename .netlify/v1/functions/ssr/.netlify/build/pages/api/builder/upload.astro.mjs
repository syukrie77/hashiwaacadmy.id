import { s as supabase } from '../../../chunks/supabase_BbPdcCKu.mjs';
export { renderers } from '../../../renderers.mjs';

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_PDF_SIZE = 50 * 1024 * 1024;
const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const VALID_PDF_TYPES = ["application/pdf"];
const POST = async (context) => {
  const user = context.locals.user;
  if (!user || user.role !== "admin" && user.role !== "instructor") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  let formData;
  try {
    formData = await context.request.formData();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid form data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const file = formData.get("file");
  const courseId = formData.get("courseId")?.toString();
  if (!file || !courseId) {
    return new Response(JSON.stringify({ error: "File dan courseId diperlukan" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  const fileExt = fileName.split(".").pop() || "unknown";
  const isVideo = VALID_VIDEO_TYPES.includes(fileType) || ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(fileExt);
  const isPdf = VALID_PDF_TYPES.includes(fileType) || fileExt === "pdf";
  if (!isVideo && !isPdf) {
    return new Response(JSON.stringify({ error: `Format tidak didukung: ${fileType || fileExt}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_PDF_SIZE;
  if (file.size > maxSize) {
    const maxMB = isVideo ? 500 : 50;
    return new Response(JSON.stringify({ error: `Ukuran file melebihi batas ${maxMB}MB` }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const filePath = `${courseId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);
  const { error: uploadError } = await supabase.storage.from("materials").upload(filePath, fileBuffer, {
    contentType: fileType || (isVideo ? "video/mp4" : "application/pdf"),
    cacheControl: "3600",
    upsert: false
  });
  if (uploadError) {
    return new Response(JSON.stringify({ error: uploadError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { data: { publicUrl } } = supabase.storage.from("materials").getPublicUrl(filePath);
  return new Response(JSON.stringify({ publicUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

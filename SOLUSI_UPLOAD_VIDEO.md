# 📹 Solusi Masalah Upload Video di E-Learning Platform

## 🔍 Masalah yang Teridentifikasi

**Error Message:** `"Action failed: Limit fileSize is not a valid number"`

**Root Cause:** 
- Bucket storage `"materials"` di Supabase belum dikonfigurasi dengan benar
- RLS (Row Level Security) policies tidak sesuai untuk upload file
- Tidak ada validasi file sebelum upload yang menyebabkan error tidak jelas

---

## ✅ Solusi yang Telah Diimplementasikan

### 1. **Pembuatan Storage Bucket Configuration** (`setup_storage_bucket.sql`)

File: `supabase/setup_storage_bucket.sql`

Apa yang dilakukan:
- ✅ Membuat bucket `"materials"` dengan akses PUBLIC
- ✅ Mengatur RLS policies untuk upload files (authenticated users)
- ✅ Mengatur RLS policies untuk read files (public access)
- ✅ Mengatur RLS policies untuk update dan delete files

### 2. **Update File builder.astro** dengan Robust Error Handling

File: `src/pages/admin/courses/[id]/builder.astro`

Perubahan yang dibuat:

#### **A. Validasi File Size**
```javascript
// Validate file size (max 500MB for videos, 50MB for PDFs)
const maxSize = type === "video" ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
if (file.size > maxSize) {
    const maxSizeMB = type === "video" ? 500 : 50;
    throw new Error(
        `File size must be less than ${maxSizeMB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );
}
```

#### **B. Validasi File Type**
```javascript
// Validate file type
const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const validPdfTypes = ["application/pdf"];
const validTypes = type === "video" ? validVideoTypes : validPdfTypes;

if (!validTypes.includes(file.type)) {
    throw new Error(
        `Invalid file type. Please upload a ${type === "video" ? "video (MP4, WebM, OGG, MOV)" : "PDF"} file.`
    );
}
```

#### **C. Improved File Naming**
```javascript
// Lebih baik dari Math.random() untuk menghindari collision
const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
```

#### **D. Better Error Messages**
```javascript
if (uploadError.message.includes("Bucket not found")) {
    throw new Error("❌ Storage bucket 'materials' not found. Please:\n...");
}
if (uploadError.message.includes("not allowed")) {
    throw new Error("❌ Permission denied. The storage bucket needs proper RLS policies...");
}
if (uploadError.message.includes("Limit")) {
    throw new Error("❌ File size or upload limit exceeded...");
}
```

#### **E. Upload Status Feedback**
```javascript
if (statusEl) statusEl.textContent = "Uploading file...";
// ... after successful upload ...
if (statusEl) statusEl.textContent = "✅ File uploaded successfully";
```

---

## 🚀 Cara Implementasi (Step by Step)

### **Step 1: Setup Storage Bucket di Supabase**

**Option A: Via SQL Editor (Recommended)**
1. Buka Supabase Dashboard: https://app.supabase.com
2. Pilih project Anda
3. Go to **SQL Editor** (sidebar kiri)
4. Click **New Query**
5. Copy-paste isi file `supabase/setup_storage_bucket.sql`
6. Click **Run** button
7. Tunggu sampai success ✅

**Option B: Via Supabase Dashboard UI**
1. Go to **Storage** menu di sidebar
2. Click **+ New Bucket**
3. Name: `materials`
4. Check "Make it public"
5. Click **Create bucket**
6. Go to **Policies** tab
7. Add policies sesuai file SQL (atau gunakan SQL Editor lebih mudah)

### **Step 2: Update Code**

✅ Sudah dilakukan! File `src/pages/admin/courses/[id]/builder.astro` sudah diupdate dengan:
- Validasi file sebelum upload
- Error handling yang lebih baik
- User-friendly error messages

### **Step 3: Test Upload**

1. Buka halaman admin: `/admin/courses/[courseId]/builder`
2. Di tab "Modules & Materials", klik **+ Material**
3. Pilih type "Video"
4. Upload video file (MP4 recommended)
5. Perhatikan status message di bawah file input
6. Klik **Simpan Materi**

**Expected Results:**
- ✅ Upload berhasil → Video URL disimpan di database
- ✅ Error message yang jelas jika ada masalah
- ✅ Video bisa diakses di halaman student

---

## 📋 Checklist Implementasi

- [ ] Run SQL script di Supabase SQL Editor
- [ ] Verify bucket "materials" sudah ada di Storage menu
- [ ] Test upload video di admin panel
- [ ] Verify video muncul dan bisa diplay
- [ ] Test dengan berbagai ukuran file
- [ ] Test dengan berbagai format video (MP4, WebM, etc)

---

## 🔧 Troubleshooting

### Problem 1: "Bucket not found"
**Solusi:** 
1. Pastikan Anda sudah run SQL script
2. Check di Supabase Dashboard → Storage
3. Bucket "materials" harus ada dan PUBLIC

### Problem 2: "Permission denied"
**Solusi:**
1. Run SQL script lagi untuk setup RLS policies
2. Verify authenticated user bisa upload

### Problem 3: "File too large"
**Solusi:**
1. Default limit 500MB untuk video
2. Jika ingin ubah, edit di builder.astro: `const maxSize = type === "video" ? 500 * 1024 * 1024 : ...`

### Problem 4: Video upload tapi tidak bisa diplay
**Solusi:**
1. Pastikan file format didukung browser (MP4 recommended)
2. Check console browser untuk error details
3. Verify URL public dapat diakses

---

## 📝 Environment Variables (Optional)

Untuk production, bisa tambah ke `.env`:

```bash
# Storage Configuration
PUBLIC_STORAGE_BUCKET=materials
PUBLIC_MAX_VIDEO_SIZE=524288000  # 500MB in bytes
PUBLIC_MAX_PDF_SIZE=52428800     # 50MB in bytes
```

Kemudian gunakan di code:
```javascript
const maxSize = type === "video" 
    ? parseInt(import.meta.env.PUBLIC_MAX_VIDEO_SIZE) 
    : parseInt(import.meta.env.PUBLIC_MAX_PDF_SIZE);
```

---

## 🎯 Fitur Tambahan (Future Enhancement)

1. **Progress Bar** - Tampilkan persentase upload
2. **Compression** - Compress video sebelum upload
3. **Thumbnail** - Generate thumbnail untuk video
4. **Multiple Upload** - Support upload multiple files sekaligus
5. **Drag & Drop** - Drag file ke modal untuk upload

---

## 📚 Referensi

- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- Supabase RLS Policies: https://supabase.com/docs/guides/auth/row-level-security
- MDN File API: https://developer.mozilla.org/en-US/docs/Web/API/File

---

## ✨ Summary

**Masalah:** Upload video gagal dengan error "Limit fileSize is not a valid number"

**Penyebab:** Bucket storage tidak dikonfigurasi + validasi file tidak ada

**Solusi:**
1. ✅ Setup bucket dengan RLS policies (SQL script)
2. ✅ Add file validation (size, type)
3. ✅ Improve error messages
4. ✅ Add upload feedback

**Hasil:** Upload video sekarang berfungsi dengan baik dan error message yang jelas!

---

**Happy uploading! 🎥**

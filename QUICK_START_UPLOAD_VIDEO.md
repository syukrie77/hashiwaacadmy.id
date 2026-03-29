# ⚡ Quick Start: Fix Upload Video dalam 5 Menit

## 🎯 Yang Perlu Dilakukan

### Langkah 1: Setup Bucket (2 menit)
1. Buka https://app.supabase.com
2. Login ke project Anda
3. Klik **SQL Editor** (sidebar kiri)
4. Klik **+ New Query**
5. Copy-paste seluruh isi file: `supabase/setup_storage_bucket.sql`
6. Klik tombol **Run** (berwarna biru)
7. Tunggu hasilnya ✅

**Alternatif (Jika tidak bisa SQL):**
1. Buka **Storage** menu
2. Klik **+ New bucket**
3. Nama: `materials`
4. Centang "Make it public"
5. Klik **Create**

### Langkah 2: Code Sudah Diupdate ✅
Tidak perlu apa-apa! File `src/pages/admin/courses/[id]/builder.astro` sudah diupdate dengan:
- ✅ Validasi file size
- ✅ Validasi file type
- ✅ Error messages yang jelas
- ✅ Upload status feedback

### Langkah 3: Test (2 menit)
1. Buka halaman admin: `http://localhost:3000/admin/courses/[courseId]/builder`
2. Klik tab **"Modules & Materials"**
3. Klik **+ Material**
4. Pilih type: **Video**
5. Upload file MP4 (test dengan file kecil dulu)
6. Klik **Simpan Materi**

---

## ✅ Indikator Berhasil

- ✅ File upload tanpa error
- ✅ Muncul pesan "✅ File uploaded successfully"
- ✅ Material muncul di list
- ✅ Video bisa diplay di halaman student

---

## ❌ Jika Masih Error

| Error | Solusi |
|-------|--------|
| "Bucket not found" | Pastikan sudah run SQL script atau buat bucket di Storage menu |
| "Permission denied" | Run SQL script lagi di SQL Editor |
| "File too large" | Upload file yang lebih kecil (max 500MB) |
| "Invalid file type" | Gunakan format MP4, WebM, atau OGG |

---

## 📂 File yang Berubah

```
✅ supabase/setup_storage_bucket.sql      (BARU - SQL script)
✅ src/pages/admin/courses/[id]/builder.astro  (DIUPDATE)
✅ SOLUSI_UPLOAD_VIDEO.md                 (BARU - Dokumentasi lengkap)
```

---

## 🚀 Selesai!

Cukup itu! Upload video sekarang siap digunakan. 

**Pertanyaan?** Lihat file `SOLUSI_UPLOAD_VIDEO.md` untuk detail lengkap.

Happy learning! 🎓

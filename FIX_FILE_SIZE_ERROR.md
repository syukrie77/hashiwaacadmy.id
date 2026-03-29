# 🔧 FIX: "Limit fileSize is not a valid number" Error

## 🚨 Masalah yang Terjadi

Saat upload video, error muncul:
```
Action failed: ❌ File size or upload limit exceeded. 
Please ensure your file is under 500MB.
```

Padahal file video kurang dari 500MB. **Root cause:** Bucket storage tidak punya `file_size_limit` yang valid.

---

## ✅ Solusi (3 Langkah Mudah)

### **Langkah 1: Jalankan SQL Fix Script** (3 menit)

1. Buka **https://app.supabase.com**
2. Login ke project Anda
3. Pilih **SQL Editor** (sidebar kiri)
4. Klik **+ New Query**
5. **Copy-paste SELURUH isi file:** `supabase/fix_storage_bucket.sql`
6. Klik tombol **RUN** (berwarna biru)
7. Tunggu completion ✅

**Apa yang dilakukan script ini:**
- ✅ Menghapus bucket lama yang error
- ✅ Membuat bucket baru dengan file_size_limit = 512MB
- ✅ Setup RLS policies yang benar

### **Langkah 2: Refresh Browser** (30 detik)

1. Close halaman admin
2. Refresh browser (Ctrl + F5)
3. Login ulang jika diperlukan

### **Langkah 3: Test Upload** (2 menit)

1. Buka halaman admin: `/admin/courses/[courseId]/builder`
2. Tab **"Modules & Materials"** → Klik **+ Material**
3. Pilih type: **Video**
4. Upload file MP4 (test dengan file kecil dulu, misalnya 10MB)
5. Klik **Simpan Materi**

**Expected Result:**
```
✅ File uploaded successfully
✅ Material muncul di list
✅ Tidak ada error
```

---

## 🎯 Kenapa Error Terjadi?

| Aspek | Masalah | Solusi |
|-------|---------|--------|
| **Bucket Config** | Tidak ada `file_size_limit` yang valid | Set ke 536870912 bytes (512MB) |
| **RLS Policies** | Policies tidak sesuai untuk upload | Create policies yang benar |
| **Client-Side** | Error message generic | Tambah validasi dan error handling |

---

## 📊 File Size Limits

| Jenis File | Limit |
|-----------|-------|
| Video (MP4, WebM, OGG, MOV) | 512 MB |
| PDF Document | 50 MB |

Jika ingin ubah limit, edit di `supabase/fix_storage_bucket.sql`:
```sql
-- Ubah nilai ini (dalam bytes):
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', true, 536870912);  -- 512MB

-- Contoh:
-- 1GB = 1073741824
-- 256MB = 268435456
-- 100MB = 104857600
```

---

## ❌ Jika Masih Error

### "Bucket not found"
```
Solusi:
1. Pastikan SQL script berhasil run (cek console untuk error)
2. Cek di Storage menu - bucket "materials" harus ada
3. Refresh browser beberapa kali
```

### "Permission denied"
```
Solusi:
1. Run SQL script lagi
2. Pastikan authenticated users memiliki upload permission
```

### "Still can't upload"
```
Solusi:
1. Buka browser developer console (F12)
2. Check tab Network & Console untuk error details
3. Copy error message dan report
```

---

## 🔍 Verify Bucket Setup

Untuk memverifikasi bucket sudah benar:

1. Buka Supabase Dashboard
2. Pergi ke **Storage** menu
3. Klik bucket **"materials"**
4. Check tab **"Settings"**:
   - ✅ Public: **enabled**
   - ✅ Max file size: **536870912** (atau sesuai setting Anda)
5. Check tab **"Policies"**:
   - ✅ Ada 5 policies (read public, read authenticated, insert, update, delete)

---

## 📝 File yang Berubah

```
✅ supabase/fix_storage_bucket.sql  (BARU - SQL fix script)
✅ src/pages/admin/courses/[id]/builder.astro  (SUDAH DIUPDATE)
✅ FIX_FILE_SIZE_ERROR.md  (BARU - Dokumentasi ini)
```

---

## 🚀 Next Steps

1. ✅ Run `supabase/fix_storage_bucket.sql`
2. ✅ Test upload video
3. ✅ Verify video bisa diplay di student page
4. ✅ Try dengan berbagai ukuran file
5. ✅ Selesai!

---

**Any issues?** Check the error message in browser console (F12) and report the exact error text.

Happy learning! 🎓

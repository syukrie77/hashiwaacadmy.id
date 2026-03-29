# ✅ UPDATED FIX GUIDE: Upload Video Error

## 🚨 Error yang Anda Alami

```
"Action failed: ❌ File size or upload limit exceeded. 
Please ensure your file is under 500MB."
```

**Padahal file video kurang dari 500MB!**

### Root Cause:
Bucket storage Supabase tidak memiliki `file_size_limit` yang valid dikonfigurasi.

---

## 🔧 SOLUSI CEPAT (5 menit)

### **STEP 1: Run SQL Script di Supabase** ⭐ PENTING!

1. Buka https://app.supabase.com
2. Login ke project Anda  
3. Click **SQL Editor** (sidebar kiri)
4. Click **+ New Query**
5. **Copy-paste SELURUH isi file:** `supabase/fix_storage_bucket_v2.sql`
6. Click **RUN** (tombol biru)
7. Tunggu sampai selesai ✅

**Output yang diharapkan:**
```
Query executed successfully
```

> **PENTING:** Jangan pakai file `fix_storage_bucket.sql` yang lama (v1)!
> Gunakan **`fix_storage_bucket_v2.sql`** yang sudah diperbaiki!

### **STEP 2: Refresh Browser**

```
Ctrl + F5  (Force refresh)
atau
Cmd + Shift + R  (Mac)
```

### **STEP 3: Test Upload Video**

1. Buka halaman admin: `http://localhost:3000/admin/courses/[courseId]/builder`
2. Tab **"Modules & Materials"** → Klik **+ Material**
3. Pilih type: **Video**
4. Upload file MP4 (test dengan file kecil dulu, 10-50 MB)
5. Klik **Simpan Materi**

**Expected Result:**
```
✅ Tidak ada error
✅ Muncul pesan "File uploaded successfully"
✅ Material muncul di list dengan icon 📽️
✅ Video bisa diplay di student page
```

---

## 📋 Apa yang SQL Script Lakukan?

Script `fix_storage_bucket_v2.sql` melakukan:

```sql
1. ✅ Create/Update bucket "materials" dengan:
   - Public: true (bisa diakses publik)
   - file_size_limit: 536870912 bytes (512 MB)

2. ✅ Drop old RLS policies yang error

3. ✅ Create 5 RLS policies yang benar:
   - Public READ (untuk download video)
   - Authenticated READ
   - Authenticated INSERT (upload)
   - Authenticated UPDATE (replace)
   - Authenticated DELETE
```

---

## ✨ File yang Sudah Diupdate

| File | Status | Deskripsi |
|------|--------|-----------|
| `supabase/fix_storage_bucket_v2.sql` | ✅ BARU | **USE THIS!** SQL script yang benar |
| `supabase/fix_storage_bucket.sql` | ⚠️ OLD | Jangan pakai (ada error di v1) |
| `src/pages/admin/courses/[id]/builder.astro` | ✅ UPDATED | Code sudah diupdate dengan validasi & error handling |
| `FIX_FILE_SIZE_ERROR.md` | ✅ DOCS | Dokumentasi fix |

---

## 🎯 Troubleshooting

### ❌ Masih Error "File size exceeded"?

**Solusi:**
1. Pastikan SQL script berhasil run (check console untuk error)
2. Refresh browser beberapa kali (Ctrl + F5)
3. Test dengan file lebih kecil (5MB dulu)
4. Check Supabase Storage bucket "materials" ada dan public

### ❌ Error: "Bucket not found"?

**Solusi:**
1. Pastikan SQL script sudah selesai run
2. Buka Supabase Dashboard → Storage menu
3. Verify bucket "materials" sudah ada
4. Check bucket "materials" punya setting "public: true"

### ❌ Error: "Permission denied"?

**Solusi:**
1. Run SQL script lagi
2. Ensure authenticated users punya upload permission
3. Check RLS policies di storage (harus 5 policies)

---

## 🔍 Verify Setup (Optional)

Untuk memastikan bucket sudah benar:

1. **Di Supabase Dashboard:**
   - Storage → materials bucket
   - Settings tab: Check file_size_limit = 536870912
   - Policies tab: Check ada 5 policies

2. **Run verification SQL:**
   ```sql
   SELECT id, name, public, file_size_limit 
   FROM storage.buckets 
   WHERE id = 'materials';
   ```
   
   **Expected output:**
   ```
   id       | materials
   name     | materials
   public   | true
   file_size_limit | 536870912
   ```

---

## 📊 File Size Limits

| Jenis File | Limit | Contoh |
|-----------|-------|--------|
| Video (MP4, WebM, OGG, MOV) | 512 MB | Avatar.mp4 (100MB) ✅ |
| PDF Document | 50 MB | Modul.pdf (30MB) ✅ |

**Ingin ubah limit?**
Edit file `supabase/fix_storage_bucket_v2.sql`:
```sql
-- Change this value (dalam bytes):
file_size_limit = 536870912  -- 512MB

-- Contoh:
-- 1GB = 1073741824
-- 256MB = 268435456
-- 100MB = 104857600
```

---

## 🚀 Summary

| Step | Action | Status |
|------|--------|--------|
| 1 | Run `supabase/fix_storage_bucket_v2.sql` | ← **DO THIS NOW** |
| 2 | Refresh browser | Auto after step 1 |
| 3 | Test upload video | Verify success |
| 4 | Check student page | Video playback works |

**Cukup itu! Upload video sekarang siap digunakan.** ✅

---

## 💡 Tips

- Test dengan file kecil dulu (5-10 MB) untuk memastikan setup benar
- Video format MP4 paling compatible untuk semua browser
- Jika upload lambat, gunakan video quality lebih rendah (bitrate 2-5 Mbps)

---

## 📞 Butuh Bantuan?

1. Check browser console (F12) untuk error details
2. Verify SQL script run successfully
3. Try force refresh (Ctrl + Shift + F5)
4. Check Supabase Storage bucket configuration

**Happy learning! 🎓**

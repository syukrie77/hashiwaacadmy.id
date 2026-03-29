# 🔧 DIAGNOSTIC GUIDE: Masalah Upload Video

## Error yang Anda Alami
```
"Action failed: ❌ File size or upload limit exceeded. Please ensure your file is under 500MB."
```

---

## 🔍 STEP 1: Check Browser Console untuk Detail Error

1. **Buka Admin Page** → Upload video → Error
2. **Tekan F12** untuk buka Developer Console
3. **Tab "Console"** - cari messages yang mulai dengan "Upload error details:"
4. **Copy error message LENGKAP**

**Contoh error messages yang mungkin:**
```
- "Bucket not found"
- "Policy ... does not exist"
- "Limit fileSize is not a valid number"
- "permission denied"
- "not allowed to insert"
```

---

## 🔍 STEP 2: Check Supabase Storage Configuration

### ✅ Bucket Exists?
1. Buka **Supabase Dashboard**
2. Sidebar kiri → **Storage**
3. Harus ada bucket bernama **"materials"**
4. Jika tidak ada → **Create bucket "materials" (PUBLIC)**

### ✅ Bucket Settings?
1. Klik bucket **"materials"**
2. Tab **"Settings"**
3. Check:
   - Public: **Enabled** ✅
   - File size limit: Should be **536870912** (512MB) atau lebih

### ✅ RLS Policies?
1. Klik bucket **"materials"**
2. Tab **"Policies"**
3. Harus ada minimum 3 policies:
   - ✅ "Allow public to read files" (SELECT)
   - ✅ "Allow authenticated to upload files" (INSERT)
   - ✅ "Allow authenticated to read files" (SELECT)

---

## 🔍 STEP 3: Test Upload dengan Debug

1. **Inject Test Code** di browser console:
```javascript
// Test bucket accessibility
const { data, error } = await supabase.storage.listBuckets();
console.log("Buckets:", data, "Error:", error);

// Test specific bucket
const { data: files, error: err } = await supabase.storage
  .from("materials")
  .list();
console.log("Files:", files, "Error:", err);
```

2. **Lihat hasil di console:**
   - Jika error: "Bucket not found" → Bucket tidak ada
   - Jika error: "permission denied" → RLS policy blocked
   - Jika success: Bucket sudah benar configured

---

## 🛠️ SOLUSI BERDASARKAN ERROR

### Error 1: "Bucket not found"
**Penyebab:** Bucket "materials" tidak ada di Supabase

**Solusi:**
```
1. Supabase Dashboard → Storage
2. Click "+ New Bucket"
3. Name: materials
4. Check "Make it public"
5. Click "Create"
6. Refresh browser (Ctrl + F5)
7. Try upload again
```

### Error 2: "Limit fileSize is not a valid number"
**Penyebab:** Bucket ada tapi file_size_limit tidak dikonfigurasi

**Solusi:**
```
1. Go to Supabase SQL Editor
2. Run this query:

UPDATE storage.buckets 
SET file_size_limit = 536870912
WHERE id = 'materials';

3. Refresh browser
4. Try upload again
```

### Error 3: "Permission denied" / "not allowed"
**Penyebab:** RLS policies tidak benar

**Solusi:**
```
1. Supabase Dashboard → Storage → materials → Policies
2. Delete existing policies yang error
3. Go to SQL Editor
4. Run fix_storage_bucket_v3.sql
5. Refresh browser
6. Try upload again
```

### Error 4: File too large (tapi file < 500MB)
**Penyebab:** File size limit di bucket terlalu kecil

**Solusi:**
```
1. Supabase SQL Editor:

UPDATE storage.buckets 
SET file_size_limit = 1073741824
WHERE id = 'materials';

(This sets limit to 1GB)

2. Refresh browser
3. Try upload again
```

---

## 🧪 FULL DIAGNOSTIC TEST

**Copy-paste ke browser console saat di admin page:**

```javascript
async function diagnoseUploadIssue() {
    try {
        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Current user:", user?.email, "ID:", user?.id);

        // Test bucket access
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        console.log("Buckets:", buckets?.map(b => b.name), "Error:", bucketsError?.message);

        // Test materials bucket specifically
        const { data: files, error: filesError } = await supabase.storage
            .from("materials")
            .list();
        console.log("Materials bucket files:", files, "Error:", filesError?.message);

        // Test write permission with small file
        const testBlob = new Blob(["test"], { type: "text/plain" });
        const testFile = new File([testBlob], "test.txt", { type: "text/plain" });
        const { data, error: uploadError } = await supabase.storage
            .from("materials")
            .upload(`test_${Date.now()}.txt`, testFile, { upsert: true });
        
        if (uploadError) {
            console.error("❌ UPLOAD FAILED:", uploadError.message);
        } else {
            console.log("✅ UPLOAD SUCCESS:", data);
            // Clean up
            await supabase.storage
                .from("materials")
                .remove([data.path]);
        }
    } catch (err) {
        console.error("Diagnostic error:", err);
    }
}

diagnoseUploadIssue();
```

**Lihat hasilnya di console:**
- ✅ Jika test file berhasil upload → Bucket OK, problem ada di file Anda
- ❌ Jika test file gagal → Problem di Supabase configuration

---

## 📋 CHECKLIST IMPLEMENTATION

- [ ] Bucket "materials" ada di Supabase Storage
- [ ] Bucket set ke PUBLIC
- [ ] file_size_limit = 536870912 (atau lebih besar)
- [ ] RLS Policies ada minimum 3:
  - [ ] Allow public to read files
  - [ ] Allow authenticated to upload files
  - [ ] Allow authenticated to read files
- [ ] Test file upload (text file kecil) berhasil
- [ ] Video upload berhasil

---

## 🎯 Next Steps

1. **Run diagnostic test** di browser console
2. **Identify error** dari console output
3. **Apply solution** based on error type
4. **Test small file** upload first
5. **Test video** upload

---

## 💡 Quick Fix All-in-One

Jika masih error setelah diagnostic:

1. **SQL Editor → Run ini:**
```sql
-- Drop and recreate bucket with proper config
DELETE FROM storage.buckets WHERE id = 'materials';

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', true, 536870912);

-- Create policies
CREATE POLICY "Allow public to read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'materials');

CREATE POLICY "Allow authenticated to upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'materials');

CREATE POLICY "Allow authenticated to delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'materials');
```

2. **Refresh browser** (Ctrl + F5)
3. **Test upload**

---

**Problem solved or need more help? Check console output carefully!** 🚀

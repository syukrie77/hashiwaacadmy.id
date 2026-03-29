-- FIX v2: Storage Bucket Configuration untuk Materials Upload
-- JALANKAN INI di Supabase SQL Editor untuk memperbaiki file size limit error
-- Masalah: "Limit fileSize is not a valid number"
-- 
-- NOTE: Tidak bisa delete bucket langsung via SQL (Supabase protection)
-- Solusi: Update bucket configuration langsung atau buat bucket baru di UI

-- OPTION 1: Update existing bucket (Recommended - jika bucket sudah ada)
-- Uncomment dan jalankan jika bucket "materials" sudah ada
/*
UPDATE storage.buckets 
SET file_size_limit = 536870912
WHERE id = 'materials';
*/

-- OPTION 2: Create new bucket (Jika bucket belum ada atau ingin fresh start)
-- Jalankan ini jika belum pernah create bucket "materials"

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', true, 536870912)
ON CONFLICT (id) DO UPDATE 
SET 
  public = true,
  file_size_limit = 536870912;

-- DROP old policies jika ada (untuk replace dengan yang benar)
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous to upload files" ON storage.objects;

-- CREATE RLS Policies yang benar

-- Policy 1: Allow PUBLIC to READ files (untuk download video)
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'materials');

-- Policy 2: Allow AUTHENTICATED to READ files
CREATE POLICY "Allow authenticated to read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'materials');

-- Policy 3: Allow AUTHENTICATED to UPLOAD files (admin upload video)
CREATE POLICY "Allow authenticated to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- Policy 4: Allow AUTHENTICATED to UPDATE files (replace/overwrite)
CREATE POLICY "Allow authenticated to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'materials')
WITH CHECK (bucket_id = 'materials');

-- Policy 5: Allow AUTHENTICATED to DELETE files
CREATE POLICY "Allow authenticated to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'materials');

-- ============================================
-- FINAL CHECK: Verify bucket configuration
-- ============================================

-- Uncomment dibawah untuk verify (run as separate query)
/*
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'materials';
*/

-- DONE! Bucket sudah siap untuk upload dengan file size limit 512MB

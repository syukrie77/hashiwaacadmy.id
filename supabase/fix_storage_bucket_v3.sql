-- FIX v3: Storage Bucket Configuration untuk Materials Upload
-- JALANKAN INI di Supabase SQL Editor
-- Masalah: "Limit fileSize is not a valid number" / "File size exceeded"
-- 
-- Script ini smart - hanya update bucket config, tidak recreate policies

-- STEP 1: Update bucket configuration (set file_size_limit dan public)
-- Ini akan auto-create bucket jika belum ada, atau update jika sudah ada
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 536870912
WHERE id = 'materials';

-- JIKA query diatas tidak update apa-apa (bucket belum ada), jalankan ini:
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', true, 536870912)
ON CONFLICT (id) DO UPDATE 
SET 
  public = true,
  file_size_limit = 536870912;

-- STEP 2: Verify bucket sudah benar
-- Uncomment untuk check (run as separate query)
/*
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'materials';
*/

-- DONE! 
-- Bucket "materials" sudah dikonfigurasi dengan:
-- - Public access: true
-- - File size limit: 536870912 bytes (512MB)
-- 
-- Jika RLS policies belum ada, ikuti langkah di bawah:

-- OPTIONAL: Create RLS Policies (hanya jika belum ada)
-- Uncomment jika perlu

/*
-- Policy 1: Allow PUBLIC to READ files
CREATE POLICY IF NOT EXISTS "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'materials');

-- Policy 2: Allow AUTHENTICATED to READ files
CREATE POLICY IF NOT EXISTS "Allow authenticated to read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'materials');

-- Policy 3: Allow AUTHENTICATED to UPLOAD files
CREATE POLICY IF NOT EXISTS "Allow authenticated to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- Policy 4: Allow AUTHENTICATED to UPDATE files
CREATE POLICY IF NOT EXISTS "Allow authenticated to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'materials')
WITH CHECK (bucket_id = 'materials');

-- Policy 5: Allow AUTHENTICATED to DELETE files
CREATE POLICY IF NOT EXISTS "Allow authenticated to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'materials');
*/

-- Jika policies sudah ada tapi error saat run, gunakan approach ini:
-- DROP POLICY IF EXISTS "Allow public to read files" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated to read files" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated to upload files" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated to update files" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated to delete files" ON storage.objects;
-- 
-- Kemudian uncomment dan jalankan policy creation section di atas

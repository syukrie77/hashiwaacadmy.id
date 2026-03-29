-- FIX: Storage Bucket Configuration untuk Materials Upload
-- JALANKAN INI di Supabase SQL Editor untuk memperbaiki file size limit error
-- Masalah: "Limit fileSize is not a valid number"

-- STEP 1: Drop old bucket dan policies jika ada
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete files" ON storage.objects;

-- STEP 2: Delete old bucket
DELETE FROM storage.buckets WHERE id = 'materials';

-- STEP 3: Create bucket dengan file size limit yang VALID
-- 536870912 bytes = 512 MB
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', true, 536870912);

-- STEP 4: Create RLS Policies yang benar

-- Policy 1: Allow public to read/download files
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'materials');

-- Policy 2: Allow authenticated users to read files
CREATE POLICY "Allow authenticated to read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'materials');

-- Policy 3: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- Policy 4: Allow authenticated users to update files
CREATE POLICY "Allow authenticated to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'materials')
WITH CHECK (bucket_id = 'materials');

-- Policy 5: Allow authenticated users to delete files
CREATE POLICY "Allow authenticated to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'materials');

-- DONE! Bucket sudah siap untuk upload

-- Optional: Uncomment dibawah jika ingin allow ANONYMOUS uploads (admin yang tidak authenticated)
-- CREATE POLICY "Allow anonymous to upload files"
-- ON storage.objects
-- FOR INSERT
-- TO anon
-- WITH CHECK (bucket_id = 'materials');

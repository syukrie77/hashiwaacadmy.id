-- ============================================================
-- FIX: "Limit fileSize is not a valid number" error
-- ============================================================
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- atau via psql ke database Supabase Anda.
--
-- Penyebab error:
--   Kolom `file_size_limit` di tabel `storage.buckets` bernilai NULL.
--   Supabase Storage API menolak NULL karena bukan angka valid.
--
-- Solusi:
--   Set file_size_limit ke angka yang valid untuk setiap bucket.
-- ============================================================

-- 1. Fix bucket 'materials' (untuk upload video, set 500MB)
UPDATE storage.buckets
SET file_size_limit = 524288000,  -- 500 MB
    public = true
WHERE id = 'materials';

-- Jika bucket belum ada, buat:
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', true, 524288000)
ON CONFLICT (id) DO NOTHING;

-- 2. Disable RLS pada storage.objects (self-hosted, auth ditangani middleware)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 3. Verifikasi hasilnya
SELECT id, name, public, file_size_limit FROM storage.buckets;

-- FILE: supabase/disable_rls.sql
-- Gunakan skrip ini untuk menonaktifkan RLS agar autentikasi bisa bekerja melalui tabel user
-- Hanya untuk lingkungan pengembangan atau jika Anda memahami risiko keamanan

-- Nonaktifkan RLS untuk tabel users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Berikan akses penuh ke tabel users untuk semua pengguna
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
-- ============================================================
-- SOLUSI AKHIR: Disable RLS pada semua tabel
-- ============================================================
-- Autentikasi & otorisasi sudah ditangani di level middleware.
-- RLS di self-hosted Supabase menyebabkan error JWT.
-- Solusi: matikan RLS, andalkan keamanan di level aplikasi.
-- ============================================================

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_forums DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- FIX: Storage bucket "Limit fileSize is not a valid number"
-- ============================================================
-- Penyebab: kolom file_size_limit di storage.buckets bernilai NULL.
-- Supabase Storage API menolak NULL sebagai angka valid.
-- Solusi: set file_size_limit ke 524288000 (500MB) untuk upload video.
-- ============================================================

-- Pastikan bucket 'materials' ada dan public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('materials', 'materials', true, 524288000, NULL)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 524288000,
    allowed_mime_types = NULL;

-- Pastikan bucket 'avatars' juga benar
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('avatars', 'avatars', true, 5242880)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880;

-- Pastikan bucket 'submissions' juga benar
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('submissions', 'submissions', false, 104857600)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 104857600;

-- Pastikan bucket 'certificates' juga benar
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('certificates', 'certificates', true, 10485760)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760;

-- Disable RLS pada storage.objects agar tidak bentrok dengan JWT issue
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Pastikan admin role tetap benar
UPDATE public.users SET role = 'admin' WHERE email = 'syukrie77@gmail.com';

-- Verifikasi
SELECT email, role FROM public.users WHERE email = 'syukrie77@gmail.com';
SELECT id, name, public, file_size_limit FROM storage.buckets;

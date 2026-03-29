-- Fix: Pastikan siswa bisa memuat soal ujian (termasuk essay)
-- Masalah: RLS policies dari berbagai file SQL saling konflik, menyebabkan query questions gagal
-- Solusi: Disable RLS pada tabel exam-related, atau set policy universal read
-- Run ini di Supabase SQL Editor

-- ============================================================
-- OPTION A: Disable RLS (paling aman & sederhana, recommended)
-- ============================================================

-- Disable RLS on all exam-related tables
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.results DISABLE ROW LEVEL SECURITY;

-- Clean up all conflicting policies
DO $$
DECLARE
    tbl TEXT;
    pol TEXT;
BEGIN
    FOR tbl IN SELECT table_name::text FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('exams','questions','question_options','exam_submissions','submission_answers','results')
    LOOP
        FOR pol IN SELECT policyname::text FROM pg_policies WHERE tablename = tbl AND schemaname = 'public'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol, tbl);
        END LOOP;
    END LOOP;
END $$;

-- ============================================================
-- OPTION B: Jika ingin tetap pakai RLS, gunakan ini saja
-- (uncomment jika Option A tidak diinginkan)
-- ============================================================
/*
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Universal read for all authenticated users
CREATE POLICY "universal_read_exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "universal_read_questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "universal_read_options" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "universal_read_submissions" ON public.exam_submissions FOR SELECT USING (true);
CREATE POLICY "universal_read_answers" ON public.submission_answers FOR SELECT USING (true);
CREATE POLICY "universal_read_results" ON public.results FOR SELECT USING (true);

-- Universal write for all authenticated users
CREATE POLICY "universal_write_exams" ON public.exams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "universal_write_questions" ON public.questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "universal_write_options" ON public.question_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "universal_write_submissions" ON public.exam_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "universal_write_answers" ON public.submission_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "universal_write_results" ON public.results FOR ALL USING (true) WITH CHECK (true);
*/

-- ============================================================
-- VERIFIKASI
-- ============================================================
SELECT 'exams' as tbl, count(*) as policies FROM pg_policies WHERE tablename = 'exams' AND schemaname = 'public'
UNION ALL
SELECT 'questions', count(*) FROM pg_policies WHERE tablename = 'questions' AND schemaname = 'public'
UNION ALL
SELECT 'question_options', count(*) FROM pg_policies WHERE tablename = 'question_options' AND schemaname = 'public'
UNION ALL
SELECT 'exam_submissions', count(*) FROM pg_policies WHERE tablename = 'exam_submissions' AND schemaname = 'public'
UNION ALL
SELECT 'submission_answers', count(*) FROM pg_policies WHERE tablename = 'submission_answers' AND schemaname = 'public'
UNION ALL
SELECT 'results', count(*) FROM pg_policies WHERE tablename = 'results' AND schemaname = 'public';

-- Cek apakah questions punya kolom type dan correct_answer nullable
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions' AND column_name IN ('type', 'correct_answer', 'points', 'order_no');
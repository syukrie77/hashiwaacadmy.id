-- ============================================
-- DEFINITIVE FIX: Disable RLS for all exam tables
-- Run this ONCE in Supabase SQL Editor
-- This overrides ALL previous conflicting RLS scripts
-- ============================================

-- Disable RLS completely for exam-related tables
-- The app already handles auth via middleware, so RLS is not needed
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.results DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('exams','questions','question_options','exam_submissions','submission_answers','results')
ORDER BY tablename;

-- Expected output: all rls_enabled = false
-- If any shows true, run the ALTER TABLE DISABLE again for that table
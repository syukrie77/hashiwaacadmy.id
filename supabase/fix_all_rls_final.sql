-- ============================================================
-- FIX FINAL: Classes + semua tabel lain
-- ============================================================
-- Sekarang tabel users sudah punya policy SELECT (true) yang AMAN,
-- jadi kita bisa query tabel users dari policy tabel lain
-- TANPA infinite recursion.
-- ============================================================

-- ──────────────────────────────────
-- CLASSES: Hapus semua policies, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'classes' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.classes', pol.policyname);
    END LOOP;
END $$;

-- Siapapun bisa lihat classes
CREATE POLICY "classes_select_public" ON public.classes
    FOR SELECT USING (true);

-- Admin/Instructor bisa INSERT
CREATE POLICY "classes_insert_admin" ON public.classes
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

-- Admin/Instructor bisa UPDATE
CREATE POLICY "classes_update_admin" ON public.classes
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

-- Admin/Instructor bisa DELETE
CREATE POLICY "classes_delete_admin" ON public.classes
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- MODULES: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'modules' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.modules', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "modules_select_public" ON public.modules
    FOR SELECT USING (true);

CREATE POLICY "modules_insert_admin" ON public.modules
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "modules_update_admin" ON public.modules
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "modules_delete_admin" ON public.modules
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- MATERIALS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'materials' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.materials', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "materials_select_public" ON public.materials
    FOR SELECT USING (true);

CREATE POLICY "materials_insert_admin" ON public.materials
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "materials_update_admin" ON public.materials
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "materials_delete_admin" ON public.materials
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- ASSIGNMENTS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'assignments' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.assignments', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "assignments_select_public" ON public.assignments
    FOR SELECT USING (true);

CREATE POLICY "assignments_insert_admin" ON public.assignments
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "assignments_update_admin" ON public.assignments
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "assignments_delete_admin" ON public.assignments
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- EXAMS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'exams' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.exams', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "exams_select_public" ON public.exams
    FOR SELECT USING (true);

CREATE POLICY "exams_insert_admin" ON public.exams
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "exams_update_admin" ON public.exams
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "exams_delete_admin" ON public.exams
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- QUESTIONS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'questions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.questions', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "questions_select_auth" ON public.questions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "questions_insert_admin" ON public.questions
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "questions_update_admin" ON public.questions
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "questions_delete_admin" ON public.questions
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- QUESTION OPTIONS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'question_options' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.question_options', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "qo_select_public" ON public.question_options
    FOR SELECT USING (true);

CREATE POLICY "qo_insert_admin" ON public.question_options
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "qo_update_admin" ON public.question_options
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "qo_delete_admin" ON public.question_options
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- ENROLLMENTS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'enrollments' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.enrollments', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "enrollments_select" ON public.enrollments
    FOR SELECT TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "enrollments_insert_own" ON public.enrollments
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "enrollments_update_admin" ON public.enrollments
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "enrollments_delete_admin" ON public.enrollments
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );


-- ──────────────────────────────────
-- PROGRESS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'progress' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.progress', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "progress_manage_own" ON public.progress
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "progress_select_admin" ON public.progress
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- SUBMISSIONS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'submissions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.submissions', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "submissions_select" ON public.submissions
    FOR SELECT TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "submissions_insert_own" ON public.submissions
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "submissions_update" ON public.submissions
    FOR UPDATE TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- EXAM SUBMISSIONS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'exam_submissions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.exam_submissions', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "exam_sub_select" ON public.exam_submissions
    FOR SELECT TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );

CREATE POLICY "exam_sub_insert_own" ON public.exam_submissions
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exam_sub_update" ON public.exam_submissions
    FOR UPDATE TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    );


-- ──────────────────────────────────
-- SUBMISSION ANSWERS: Hapus semua, buat ulang
-- ──────────────────────────────────
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'submission_answers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.submission_answers', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "sub_answers_select" ON public.submission_answers
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM exam_submissions s
            WHERE s.id = submission_id AND (
                s.user_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
            )
        )
    );

CREATE POLICY "sub_answers_insert" ON public.submission_answers
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM exam_submissions s
            WHERE s.id = submission_id AND s.user_id = auth.uid()
        )
    );


-- ──────────────────────────────────
-- PAYMENTS, CERTIFICATES, PROFILES, dll tetap aman
-- ──────────────────────────────────


-- ──────────────────────────────────
-- VERIFIKASI: Tampilkan semua policies
-- ──────────────────────────────────
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

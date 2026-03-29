-- ============================================================
-- FIX: Classes + other tables RLS policies (no more recursion)
-- ============================================================
-- Setelah menjalankan fix_admin_role.sql, jalankan script ini
-- untuk memperbaiki policy di tabel lain yang juga mengecek
-- tabel users (penyebab "infinite recursion").
-- ============================================================

-- ──────────────────────────────────────────
-- CLASSES: Hapus policy lama, buat baru tanpa recursion
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "classes_manage_admin_instructor" ON public.classes;
DROP POLICY IF EXISTS "Admins can do everything on classes" ON public.classes;

-- Admin/Instructor bisa kelola classes (menggunakan JWT metadata)
CREATE POLICY "classes_manage_admin_instructor" ON public.classes
    FOR ALL
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- MODULES: Perbaiki policy
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "modules_manage_admin_instructor" ON public.modules;

CREATE POLICY "modules_manage_admin_instructor" ON public.modules
    FOR ALL
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- MATERIALS: Perbaiki policy
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "materials_manage_admin_instructor" ON public.materials;

CREATE POLICY "materials_manage_admin_instructor" ON public.materials
    FOR ALL
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- ASSIGNMENTS: Perbaiki policy
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "assignments_manage_admin_instructor" ON public.assignments;

CREATE POLICY "assignments_manage_admin_instructor" ON public.assignments
    FOR ALL
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- EXAMS: Perbaiki policy
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "exams_manage_admin_instructor" ON public.exams;

CREATE POLICY "exams_manage_admin_instructor" ON public.exams
    FOR ALL
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- QUESTIONS: Perbaiki policies
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "questions_insert_admin_instructor" ON public.questions;
DROP POLICY IF EXISTS "questions_update_admin_instructor" ON public.questions;
DROP POLICY IF EXISTS "questions_delete_admin_instructor" ON public.questions;

CREATE POLICY "questions_insert_admin_instructor" ON public.questions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

CREATE POLICY "questions_update_admin_instructor" ON public.questions
    FOR UPDATE
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

CREATE POLICY "questions_delete_admin_instructor" ON public.questions
    FOR DELETE
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- QUESTION OPTIONS: Perbaiki policy
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "question_options_manage_admin_instructor" ON public.question_options;

CREATE POLICY "question_options_manage_admin_instructor" ON public.question_options
    FOR ALL
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- ENROLLMENTS: Perbaiki admin policies
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "enrollments_select" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_admin_update" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_admin_delete" ON public.enrollments;

CREATE POLICY "enrollments_select" ON public.enrollments
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

CREATE POLICY "enrollments_admin_update" ON public.enrollments
    FOR UPDATE
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) = 'admin'
    );

CREATE POLICY "enrollments_admin_delete" ON public.enrollments
    FOR DELETE
    TO authenticated
    USING (
        coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) = 'admin'
    );

-- ──────────────────────────────────────────
-- PROGRESS: Perbaiki admin select policy
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "progress_admin_select" ON public.progress;

CREATE POLICY "progress_admin_select" ON public.progress
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- SUBMISSIONS: Perbaiki policies
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "submissions_select" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update" ON public.submissions;

CREATE POLICY "submissions_select" ON public.submissions
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

CREATE POLICY "submissions_update" ON public.submissions
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

-- ──────────────────────────────────────────
-- EXAM SUBMISSIONS: Perbaiki policies
-- ──────────────────────────────────────────
DROP POLICY IF EXISTS "exam_submissions_select_own" ON public.exam_submissions;
DROP POLICY IF EXISTS "exam_submissions_update_own" ON public.exam_submissions;

CREATE POLICY "exam_submissions_select_own" ON public.exam_submissions
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );

CREATE POLICY "exam_submissions_update_own" ON public.exam_submissions
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR coalesce(
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            (auth.jwt() -> 'user_metadata' ->> 'role')
        ) IN ('admin', 'instructor')
    );


-- ──────────────────────────────────────────
-- SELESAI!
-- ──────────────────────────────────────────
-- Semua policy admin/instructor sekarang menggunakan JWT metadata
-- dan TIDAK lagi query ke tabel users (sehingga tidak infinite recursion).

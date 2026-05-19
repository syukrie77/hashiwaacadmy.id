-- ============================================================
-- HASHIWA E-LEARNING LMS - COMPLETE MIGRATION
-- ============================================================
-- Jalankan file ini di Supabase SQL Editor untuk database yang
-- SUDAH BERJALAN. Aman dijalankan berulang (idempotent).
--
-- CARA PAKAI:
--   Supabase Dashboard → SQL Editor → paste → Run
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. TAMBAH KOLOM YANG MISSING DI TABEL EXISTING
-- ────────────────────────────────────────────────────────────

-- profiles: tambah UNIQUE constraint (diperlukan untuk upsert onConflict:"user_id")
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_user_id_key' AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- enrollments: tambah UNIQUE constraint
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'enrollments_user_id_class_id_key' AND conrelid = 'enrollments'::regclass
    ) THEN
        ALTER TABLE enrollments ADD CONSTRAINT enrollments_user_id_class_id_key UNIQUE (user_id, class_id);
    END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- modules: tambah kolom price
ALTER TABLE modules
    ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;

-- materials: tambah kolom order_no (jika belum ada)
ALTER TABLE materials
    ADD COLUMN IF NOT EXISTS order_no INT DEFAULT 0;

-- progress: tambah UNIQUE constraint (diperlukan untuk upsert onConflict:"user_id,material_id")
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'progress_user_id_material_id_key' AND conrelid = 'progress'::regclass
    ) THEN
        ALTER TABLE progress ADD CONSTRAINT progress_user_id_material_id_key UNIQUE (user_id, material_id);
    END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- submissions (tugas): tambah UNIQUE constraint
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'submissions_assignment_id_user_id_key' AND conrelid = 'submissions'::regclass
    ) THEN
        ALTER TABLE submissions ADD CONSTRAINT submissions_assignment_id_user_id_key UNIQUE (assignment_id, user_id);
    END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- exams: tambah kolom yang missing
ALTER TABLE exams
    ADD COLUMN IF NOT EXISTS description    TEXT,
    ADD COLUMN IF NOT EXISTS passing_score  INT DEFAULT 60,
    ADD COLUMN IF NOT EXISTS total_points   INT DEFAULT 100,
    ADD COLUMN IF NOT EXISTS is_published   BOOLEAN DEFAULT false;

-- questions: tambah kolom yang missing
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS type            TEXT DEFAULT 'multiple_choice',
    ADD COLUMN IF NOT EXISTS points          INT DEFAULT 1,
    ADD COLUMN IF NOT EXISTS order_no        INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS code            TEXT,
    ADD COLUMN IF NOT EXISTS course_id       UUID REFERENCES classes(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS category        TEXT,
    ADD COLUMN IF NOT EXISTS submission_type TEXT DEFAULT 'multiple_choice';

-- Tambah CHECK constraint untuk questions.type (idempotent)
DO $$ BEGIN
    ALTER TABLE questions
        ADD CONSTRAINT questions_type_check
        CHECK (type IN ('multiple_choice', 'essay', 'true_false'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Ubah exam_id di questions menjadi nullable (untuk bank soal)
ALTER TABLE questions ALTER COLUMN exam_id DROP NOT NULL;
ALTER TABLE questions ALTER COLUMN correct_answer DROP NOT NULL;

-- results: tambah UNIQUE constraint (diperlukan untuk upsert onConflict:"exam_id,user_id")
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'results_exam_id_user_id_key' AND conrelid = 'results'::regclass
    ) THEN
        ALTER TABLE results ADD CONSTRAINT results_exam_id_user_id_key UNIQUE (exam_id, user_id);
    END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- payments: tambah kolom yang missing
ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS module_id          UUID REFERENCES modules(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS payment_type       TEXT NOT NULL DEFAULT 'course',
    ADD COLUMN IF NOT EXISTS xendit_invoice_id  TEXT,
    ADD COLUMN IF NOT EXISTS xendit_invoice_url TEXT,
    ADD COLUMN IF NOT EXISTS created_at         TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Update status constraint payments agar include semua nilai baru
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
DO $$ BEGIN
    ALTER TABLE payments
        ADD CONSTRAINT payments_status_check
        CHECK (status IN ('pending', 'completed', 'failed', 'expired'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tambah CHECK constraint untuk payment_type
DO $$ BEGIN
    ALTER TABLE payments
        ADD CONSTRAINT payments_payment_type_check
        CHECK (payment_type IN ('course', 'module'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- certificates: tambah UNIQUE constraint
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'certificates_user_id_class_id_key' AND conrelid = 'certificates'::regclass
    ) THEN
        ALTER TABLE certificates ADD CONSTRAINT certificates_user_id_class_id_key UNIQUE (user_id, class_id);
    END IF;
EXCEPTION WHEN others THEN NULL;
END $$;


-- ────────────────────────────────────────────────────────────
-- 2. BUAT TABEL BARU (jika belum ada)
-- ────────────────────────────────────────────────────────────

-- QUESTION OPTIONS
CREATE TABLE IF NOT EXISTS question_options (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text  TEXT NOT NULL,
    is_correct   BOOLEAN DEFAULT false,
    order_no     INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options (question_id);

-- EXAM SUBMISSIONS
CREATE TABLE IF NOT EXISTS exam_submissions (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id       UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        TEXT DEFAULT 'in_progress'
                      CHECK (status IN ('in_progress', 'submitted', 'graded')),
    score         NUMERIC DEFAULT 0,
    started_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at  TIMESTAMP WITH TIME ZONE,
    graded_at     TIMESTAMP WITH TIME ZONE,
    graded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE (exam_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_exam ON exam_submissions (exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_user ON exam_submissions (user_id);

-- SUBMISSION ANSWERS
CREATE TABLE IF NOT EXISTS submission_answers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id       UUID NOT NULL REFERENCES exam_submissions(id) ON DELETE CASCADE,
    question_id         UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id  UUID REFERENCES question_options(id) ON DELETE SET NULL,
    answer_text         TEXT,
    is_correct          BOOLEAN,
    points_awarded      INT DEFAULT 0,
    feedback            TEXT,
    UNIQUE (submission_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_submission_answers_submission ON submission_answers (submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_question   ON submission_answers (question_id);

-- MODULE ENROLLMENTS
CREATE TABLE IF NOT EXISTS module_enrollments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id   UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    amount      NUMERIC NOT NULL DEFAULT 0,
    status      TEXT DEFAULT 'active',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, module_id)
);
CREATE INDEX IF NOT EXISTS idx_module_enrollments_user   ON module_enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_module_enrollments_module ON module_enrollments (module_id);

-- COURSE SESSIONS
CREATE TABLE IF NOT EXISTS course_sessions (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id              UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    session_no            INT NOT NULL,
    instructor_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    meeting_type          TEXT DEFAULT 'tatap_muka',
    date                  DATE,
    start_time            TIME,
    end_time              TIME,
    room                  TEXT,
    method                TEXT,
    vicon_link            TEXT,
    teaching_materials    TEXT,
    material_plan         TEXT,
    material_realization  TEXT,
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (class_id, session_no)
);
CREATE INDEX IF NOT EXISTS idx_course_sessions_class      ON course_sessions (class_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_instructor ON course_sessions (instructor_id);

-- ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS attendance_records (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  UUID NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
    student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      CHAR(1) DEFAULT 'H' CHECK (status IN ('H', 'A', 'I', 'S')),
    marked_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (session_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance_records (session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records (student_id);

-- SESSION FORUMS
CREATE TABLE IF NOT EXISTS session_forums (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  UUID NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_forums_session ON session_forums (session_id);


-- ────────────────────────────────────────────────────────────
-- 3. TAMBAH INDEX YANG MISSING
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_payments_xendit_invoice_id ON payments (xendit_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_module            ON payments (module_id);


-- ────────────────────────────────────────────────────────────
-- 4. FUNCTIONS & TRIGGERS
-- ────────────────────────────────────────────────────────────

-- Auto-create profile saat user baru dibuat di public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_created ON public.users;
CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Sinkronisasi auth.users → public.users saat sign up
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name  = COALESCE(EXCLUDED.name, public.users.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auth_user_created();


-- ────────────────────────────────────────────────────────────
-- 5. RLS - Enable pada tabel baru
-- ────────────────────────────────────────────────────────────
ALTER TABLE question_options    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_enrollments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_forums       ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- 6. RLS POLICIES - Tabel baru
-- ────────────────────────────────────────────────────────────

-- QUESTION OPTIONS
DROP POLICY IF EXISTS "question_options_select_all" ON question_options;
CREATE POLICY "question_options_select_all" ON question_options
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "question_options_manage_admin_instructor" ON question_options;
CREATE POLICY "question_options_manage_admin_instructor" ON question_options
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'instructor'))
    );

-- EXAM SUBMISSIONS
DROP POLICY IF EXISTS "exam_submissions_select_own" ON exam_submissions;
CREATE POLICY "exam_submissions_select_own" ON exam_submissions
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'instructor'))
    );

DROP POLICY IF EXISTS "exam_submissions_insert_own" ON exam_submissions;
CREATE POLICY "exam_submissions_insert_own" ON exam_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "exam_submissions_update_own" ON exam_submissions;
CREATE POLICY "exam_submissions_update_own" ON exam_submissions
    FOR UPDATE USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'instructor'))
    );

-- SUBMISSION ANSWERS
DROP POLICY IF EXISTS "submission_answers_select_own" ON submission_answers;
CREATE POLICY "submission_answers_select_own" ON submission_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM exam_submissions
            WHERE exam_submissions.id = submission_answers.submission_id
            AND exam_submissions.user_id = auth.uid()
        )
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'instructor'))
    );

DROP POLICY IF EXISTS "submission_answers_insert_own" ON submission_answers;
CREATE POLICY "submission_answers_insert_own" ON submission_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM exam_submissions
            WHERE exam_submissions.id = submission_id
            AND exam_submissions.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "submission_answers_update" ON submission_answers;
CREATE POLICY "submission_answers_update" ON submission_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM exam_submissions
            WHERE exam_submissions.id = submission_answers.submission_id
            AND exam_submissions.user_id = auth.uid()
        )
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'instructor'))
    );

-- MODULE ENROLLMENTS
DROP POLICY IF EXISTS "module_enrollments_select_all" ON module_enrollments;
CREATE POLICY "module_enrollments_select_all" ON module_enrollments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "module_enrollments_insert" ON module_enrollments;
CREATE POLICY "module_enrollments_insert" ON module_enrollments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "module_enrollments_admin_manage" ON module_enrollments;
CREATE POLICY "module_enrollments_admin_manage" ON module_enrollments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- COURSE SESSIONS
DROP POLICY IF EXISTS "course_sessions_select_all" ON course_sessions;
CREATE POLICY "course_sessions_select_all" ON course_sessions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "course_sessions_manage_instructor" ON course_sessions;
CREATE POLICY "course_sessions_manage_instructor" ON course_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classes
            WHERE classes.id = course_sessions.class_id
            AND classes.owner_id = auth.uid()
        )
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- ATTENDANCE RECORDS
DROP POLICY IF EXISTS "attendance_select_own" ON attendance_records;
CREATE POLICY "attendance_select_own" ON attendance_records
    FOR SELECT USING (
        auth.uid() = student_id
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'instructor'))
    );

DROP POLICY IF EXISTS "attendance_manage_instructor" ON attendance_records;
CREATE POLICY "attendance_manage_instructor" ON attendance_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM course_sessions s
            JOIN classes c ON s.class_id = c.id
            WHERE s.id = attendance_records.session_id
            AND c.owner_id = auth.uid()
        )
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- SESSION FORUMS
DROP POLICY IF EXISTS "session_forums_select_all" ON session_forums;
CREATE POLICY "session_forums_select_all" ON session_forums
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "session_forums_manage" ON session_forums;
CREATE POLICY "session_forums_manage" ON session_forums
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'instructor'))
    );

-- ============================================================
-- SELESAI! Migration berhasil dijalankan.
-- ============================================================

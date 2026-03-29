-- ============================================================
-- HASHIWA E-LEARNING LMS - FULL DATABASE SCHEMA
-- ============================================================
-- File ini berisi SELURUH struktur database yang dibutuhkan
-- untuk aplikasi Hashiwa E-Learning LMS.
--
-- CARA IMPORT:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Copy-paste seluruh isi file ini
--   3. Klik "Run" untuk mengeksekusi
--
-- CATATAN:
--   - File ini bersifat IDEMPOTENT (aman dijalankan berulang kali)
--   - Menggunakan IF NOT EXISTS dan DROP POLICY IF EXISTS
--   - Jalankan pada database Supabase yang BARU/KOSONG untuk hasil terbaik
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- BAGIAN 1: EXTENSIONS
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ────────────────────────────────────────────────────────────
-- BAGIAN 2: CUSTOM TYPES (ENUM)
-- ────────────────────────────────────────────────────────────
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'student', 'instructor');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
        CREATE TYPE question_type AS ENUM ('multiple_choice', 'essay', 'true_false');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_type') THEN
        CREATE TYPE submission_type AS ENUM ('multiple_choice', 'upload_file', 'presentation');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_submission_status') THEN
        CREATE TYPE exam_submission_status AS ENUM ('in_progress', 'submitted', 'graded');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('H', 'A', 'I', 'S');
    END IF;
END $$;


-- ────────────────────────────────────────────────────────────
-- BAGIAN 3: TABEL UTAMA
-- ────────────────────────────────────────────────────────────

-- ================================
-- 3.1  USERS (Data pengguna publik)
-- ================================
-- Tabel ini menyimpan data profil publik pengguna.
-- ID-nya harus sinkron dengan auth.users dari Supabase Auth.
-- Kolom 'password' dihilangkan karena autentikasi ditangani oleh Supabase Auth.
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student', 'instructor')),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk pencarian cepat berdasarkan email & role
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);


-- ================================
-- 3.2  PROFILES (Data profil tambahan)
-- ================================
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    avatar      TEXT,
    phone       TEXT
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles (user_id);


-- ================================
-- 3.3  CLASSES (Kelas/Kursus)
-- ================================
CREATE TABLE IF NOT EXISTS classes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,
    description TEXT,
    price       NUMERIC DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    owner_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    -- Kolom tambahan untuk metadata kursus (sesi & presensi)
    course_code TEXT,
    study_day   TEXT,
    study_time  TEXT,
    room_name   TEXT
);

CREATE INDEX IF NOT EXISTS idx_classes_owner ON classes (owner_id);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes (is_active);


-- ================================
-- 3.4  ENROLLMENTS (Pendaftaran Kelas)
-- ================================
CREATE TABLE IF NOT EXISTS enrollments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    status      TEXT DEFAULT 'active',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments (class_id);


-- ================================
-- 3.5  MODULES (Modul dalam Kelas)
-- ================================
CREATE TABLE IF NOT EXISTS modules (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    order_no    INT DEFAULT 0,
    price       NUMERIC DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_modules_class ON modules (class_id);


-- ================================
-- 3.6  MATERIALS (Materi dalam Modul)
-- ================================
CREATE TABLE IF NOT EXISTS materials (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id   UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    type        TEXT NOT NULL,  -- 'video', 'pdf', 'text', dll.
    content     TEXT,
    duration    INT,            -- durasi dalam menit
    order_no    INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_materials_module ON materials (module_id);


-- ================================
-- 3.7  PROGRESS (Progress Belajar)
-- ================================
CREATE TABLE IF NOT EXISTS progress (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id     UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    completed       BOOLEAN DEFAULT false,
    completed_at    TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, material_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON progress (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_material ON progress (material_id);


-- ================================
-- 3.8  ASSIGNMENTS (Tugas)
-- ================================
CREATE TABLE IF NOT EXISTS assignments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    deadline    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments (class_id);


-- ================================
-- 3.9  SUBMISSIONS (Pengumpulan Tugas)
-- ================================
CREATE TABLE IF NOT EXISTS submissions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id   UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url        TEXT,
    score           NUMERIC,
    UNIQUE (assignment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions (assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions (user_id);


-- ================================
-- 3.10 EXAMS (Ujian)
-- ================================
CREATE TABLE IF NOT EXISTS exams (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id        UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    description     TEXT,
    duration        INT,            -- durasi dalam menit
    passing_score   INT DEFAULT 60,
    total_points    INT DEFAULT 100,
    is_published    BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_exams_class ON exams (class_id);


-- ================================
-- 3.11 QUESTIONS (Soal Ujian / Bank Soal)
-- ================================
-- exam_id nullable untuk mendukung fitur Bank Soal (soal independen)
CREATE TABLE IF NOT EXISTS questions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id         UUID REFERENCES exams(id) ON DELETE CASCADE,  -- nullable untuk bank soal
    question        TEXT NOT NULL,
    correct_answer  TEXT,
    type            TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (type IN ('multiple_choice', 'essay', 'true_false')),
    points          INT DEFAULT 1,
    order_no        INT DEFAULT 0,
    -- Kolom tambahan untuk Bank Soal
    code            TEXT,
    course_id       UUID REFERENCES classes(id) ON DELETE CASCADE,
    category        TEXT,           -- 'UTS', 'UAS', 'Quiz'
    submission_type TEXT DEFAULT 'multiple_choice' CHECK (submission_type IN ('multiple_choice', 'upload_file', 'presentation'))
);

CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions (exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_course ON questions (course_id);


-- ================================
-- 3.12 QUESTION OPTIONS (Pilihan Jawaban)
-- ================================
CREATE TABLE IF NOT EXISTS question_options (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id     UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text     TEXT NOT NULL,
    is_correct      BOOLEAN DEFAULT false,
    order_no        INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options (question_id);


-- ================================
-- 3.13 EXAM SUBMISSIONS (Pengerjaan Ujian)
-- ================================
CREATE TABLE IF NOT EXISTS exam_submissions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id         UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
    score           NUMERIC DEFAULT 0,
    started_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at    TIMESTAMP WITH TIME ZONE,
    UNIQUE (exam_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_exam_submissions_exam ON exam_submissions (exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_user ON exam_submissions (user_id);


-- ================================
-- 3.14 SUBMISSION ANSWERS (Jawaban per Soal)
-- ================================
CREATE TABLE IF NOT EXISTS submission_answers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id       UUID NOT NULL REFERENCES exam_submissions(id) ON DELETE CASCADE,
    question_id         UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id  UUID REFERENCES question_options(id) ON DELETE SET NULL,  -- untuk MCQ
    answer_text         TEXT,                 -- untuk Essay / Text
    is_correct          BOOLEAN,              -- otomatis untuk MCQ, manual untuk Essay
    points_awarded      INT DEFAULT 0,
    feedback            TEXT,                 -- feedback dari instruktur
    UNIQUE (submission_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_submission_answers_submission ON submission_answers (submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_question ON submission_answers (question_id);


-- ================================
-- 3.15 RESULTS (Hasil Ujian - Legacy)
-- ================================
CREATE TABLE IF NOT EXISTS results (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id     UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score       NUMERIC,
    UNIQUE (exam_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_results_exam ON results (exam_id);
CREATE INDEX IF NOT EXISTS idx_results_user ON results (user_id);


-- ================================
-- 3.16 PAYMENTS (Pembayaran)
-- ================================
CREATE TABLE IF NOT EXISTS payments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id    UUID REFERENCES classes(id) ON DELETE SET NULL,
    amount      NUMERIC NOT NULL,
    status      TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'paid', 'failed', 'refunded'
    paid_at     TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_class ON payments (class_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);


-- ================================
-- 3.17 CERTIFICATES (Sertifikat)
-- ================================
CREATE TABLE IF NOT EXISTS certificates (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    file_url    TEXT,
    issued_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_class ON certificates (class_id);


-- ================================
-- 3.18 MODULE ENROLLMENTS (Pembelian Modul)
-- ================================
CREATE TABLE IF NOT EXISTS module_enrollments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id   UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    amount      NUMERIC NOT NULL,
    status      TEXT DEFAULT 'active',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_module_enrollments_user ON module_enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_module_enrollments_module ON module_enrollments (module_id);


-- ================================
-- 3.19 COURSE SESSIONS (Sesi Pertemuan)
-- ================================
CREATE TABLE IF NOT EXISTS course_sessions (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id                UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    session_no              INT NOT NULL,
    instructor_id           UUID REFERENCES users(id) ON DELETE SET NULL,
    meeting_type            TEXT DEFAULT 'tatap_muka',  -- tatap_muka, daring
    date                    DATE,
    start_time              TIME,
    end_time                TIME,
    room                    TEXT,
    method                  TEXT,
    vicon_link              TEXT,
    teaching_materials      TEXT,
    material_plan           TEXT,
    material_realization    TEXT,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (class_id, session_no)
);

CREATE INDEX IF NOT EXISTS idx_course_sessions_class ON course_sessions (class_id);
CREATE INDEX IF NOT EXISTS idx_course_sessions_instructor ON course_sessions (instructor_id);


-- ================================
-- 3.20 ATTENDANCE RECORDS (Presensi Kehadiran)
-- ================================
CREATE TABLE IF NOT EXISTS attendance_records (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  UUID NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
    student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      CHAR(1) DEFAULT 'H' CHECK (status IN ('H', 'A', 'I', 'S')),
    -- H=Hadir, A=Alpa, I=Izin, S=Sakit
    marked_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (session_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance_records (session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records (student_id);


-- ================================
-- 3.21 SESSION FORUMS (Forum Diskusi Sesi)
-- ================================
CREATE TABLE IF NOT EXISTS session_forums (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  UUID NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_forums_session ON session_forums (session_id);


-- ────────────────────────────────────────────────────────────
-- BAGIAN 4: FUNCTIONS & TRIGGERS
-- ────────────────────────────────────────────────────────────

-- Fungsi untuk membuat profil otomatis saat user baru dibuat
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: otomatis buat profil saat INSERT ke tabel users
DROP TRIGGER IF EXISTS on_user_created ON public.users;
CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Fungsi untuk sinkronisasi data dari auth.users ke public.users
-- (dipanggil saat user baru sign up via Supabase Auth)
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
        name = COALESCE(EXCLUDED.name, public.users.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: sinkron auth.users → public.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auth_user_created();


-- ────────────────────────────────────────────────────────────
-- BAGIAN 5: ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────

-- 5.1 Enable RLS pada semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_forums ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- 5.2 POLICIES: USERS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "users_select_all" ON users;
CREATE POLICY "users_select_all" ON users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admin bisa update semua user (untuk ganti role, dll.)
DROP POLICY IF EXISTS "users_admin_all" ON users;
CREATE POLICY "users_admin_all" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.3 POLICIES: PROFILES
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_manage_own" ON profiles;
CREATE POLICY "profiles_manage_own" ON profiles
    FOR ALL USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 5.4 POLICIES: CLASSES
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "classes_select_all" ON classes;
CREATE POLICY "classes_select_all" ON classes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "classes_manage_admin_instructor" ON classes;
CREATE POLICY "classes_manage_admin_instructor" ON classes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.5 POLICIES: ENROLLMENTS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "enrollments_select" ON enrollments;
CREATE POLICY "enrollments_select" ON enrollments
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

DROP POLICY IF EXISTS "enrollments_insert_own" ON enrollments;
CREATE POLICY "enrollments_insert_own" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "enrollments_admin_update" ON enrollments;
CREATE POLICY "enrollments_admin_update" ON enrollments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "enrollments_admin_delete" ON enrollments;
CREATE POLICY "enrollments_admin_delete" ON enrollments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.6 POLICIES: MODULES
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "modules_select_all" ON modules;
CREATE POLICY "modules_select_all" ON modules
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "modules_manage_admin_instructor" ON modules;
CREATE POLICY "modules_manage_admin_instructor" ON modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.7 POLICIES: MATERIALS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "materials_select_all" ON materials;
CREATE POLICY "materials_select_all" ON materials
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "materials_manage_admin_instructor" ON materials;
CREATE POLICY "materials_manage_admin_instructor" ON materials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.8 POLICIES: PROGRESS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "progress_manage_own" ON progress;
CREATE POLICY "progress_manage_own" ON progress
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_admin_select" ON progress;
CREATE POLICY "progress_admin_select" ON progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.9 POLICIES: ASSIGNMENTS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "assignments_select_all" ON assignments;
CREATE POLICY "assignments_select_all" ON assignments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "assignments_manage_admin_instructor" ON assignments;
CREATE POLICY "assignments_manage_admin_instructor" ON assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.10 POLICIES: SUBMISSIONS (Tugas)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "submissions_select" ON submissions;
CREATE POLICY "submissions_select" ON submissions
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

DROP POLICY IF EXISTS "submissions_insert_own" ON submissions;
CREATE POLICY "submissions_insert_own" ON submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "submissions_update" ON submissions;
CREATE POLICY "submissions_update" ON submissions
    FOR UPDATE USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.11 POLICIES: EXAMS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "exams_select_all" ON exams;
CREATE POLICY "exams_select_all" ON exams
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "exams_manage_admin_instructor" ON exams;
CREATE POLICY "exams_manage_admin_instructor" ON exams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.12 POLICIES: QUESTIONS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "questions_select_authenticated" ON questions;
CREATE POLICY "questions_select_authenticated" ON questions
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "questions_insert_admin_instructor" ON questions;
CREATE POLICY "questions_insert_admin_instructor" ON questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

DROP POLICY IF EXISTS "questions_update_admin_instructor" ON questions;
CREATE POLICY "questions_update_admin_instructor" ON questions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

DROP POLICY IF EXISTS "questions_delete_admin_instructor" ON questions;
CREATE POLICY "questions_delete_admin_instructor" ON questions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.13 POLICIES: QUESTION OPTIONS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "question_options_select_all" ON question_options;
CREATE POLICY "question_options_select_all" ON question_options
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "question_options_manage_admin_instructor" ON question_options;
CREATE POLICY "question_options_manage_admin_instructor" ON question_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.14 POLICIES: EXAM SUBMISSIONS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "exam_submissions_select_own" ON exam_submissions;
CREATE POLICY "exam_submissions_select_own" ON exam_submissions
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

DROP POLICY IF EXISTS "exam_submissions_insert_own" ON exam_submissions;
CREATE POLICY "exam_submissions_insert_own" ON exam_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "exam_submissions_update_own" ON exam_submissions;
CREATE POLICY "exam_submissions_update_own" ON exam_submissions
    FOR UPDATE USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.15 POLICIES: SUBMISSION ANSWERS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "submission_answers_select_own" ON submission_answers;
CREATE POLICY "submission_answers_select_own" ON submission_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM exam_submissions
            WHERE exam_submissions.id = submission_answers.submission_id
            AND exam_submissions.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
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
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.16 POLICIES: RESULTS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "results_select" ON results;
CREATE POLICY "results_select" ON results
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

DROP POLICY IF EXISTS "results_manage_admin_instructor" ON results;
CREATE POLICY "results_manage_admin_instructor" ON results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.17 POLICIES: PAYMENTS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "payments_select" ON payments;
CREATE POLICY "payments_select" ON payments
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "payments_insert_own" ON payments;
CREATE POLICY "payments_insert_own" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_admin_manage" ON payments;
CREATE POLICY "payments_admin_manage" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.18 POLICIES: CERTIFICATES
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "certificates_select" ON certificates;
CREATE POLICY "certificates_select" ON certificates
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

DROP POLICY IF EXISTS "certificates_manage_admin" ON certificates;
CREATE POLICY "certificates_manage_admin" ON certificates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.19 POLICIES: MODULE ENROLLMENTS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "module_enrollments_select_all" ON module_enrollments;
CREATE POLICY "module_enrollments_select_all" ON module_enrollments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "module_enrollments_insert" ON module_enrollments;
CREATE POLICY "module_enrollments_insert" ON module_enrollments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "module_enrollments_admin_manage" ON module_enrollments;
CREATE POLICY "module_enrollments_admin_manage" ON module_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.20 POLICIES: COURSE SESSIONS
-- ────────────────────────────────────────────────────────────
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
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.21 POLICIES: ATTENDANCE RECORDS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "attendance_select_own" ON attendance_records;
CREATE POLICY "attendance_select_own" ON attendance_records
    FOR SELECT USING (
        auth.uid() = student_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
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
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5.22 POLICIES: SESSION FORUMS
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "session_forums_select_all" ON session_forums;
CREATE POLICY "session_forums_select_all" ON session_forums
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "session_forums_manage" ON session_forums;
CREATE POLICY "session_forums_manage" ON session_forums
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );


-- ────────────────────────────────────────────────────────────
-- BAGIAN 6: STORAGE BUCKETS (Opsional)
-- ────────────────────────────────────────────────────────────
-- Buat bucket untuk menyimpan file (avatar, tugas, materi, sertifikat)
-- Catatan: Jalankan bagian ini terpisah jika gagal (karena storage API)

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Avatars: Public read, authenticated upload for own folder
DROP POLICY IF EXISTS "Avatar public read" ON storage.objects;
CREATE POLICY "Avatar public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatar authenticated upload" ON storage.objects;
CREATE POLICY "Avatar authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );

-- Materials: Only admin/instructor can upload, authenticated can download
DROP POLICY IF EXISTS "Materials authenticated read" ON storage.objects;
CREATE POLICY "Materials authenticated read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'materials'
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Materials admin instructor upload" ON storage.objects;
CREATE POLICY "Materials admin instructor upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'materials'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
        )
    );

-- Submissions: Students upload own, admin/instructor can view all
DROP POLICY IF EXISTS "Submissions authenticated read" ON storage.objects;
CREATE POLICY "Submissions authenticated read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'submissions'
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Submissions authenticated upload" ON storage.objects;
CREATE POLICY "Submissions authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'submissions'
        AND auth.role() = 'authenticated'
    );


-- ────────────────────────────────────────────────────────────
-- BAGIAN 7: SEED DATA (ADMIN USER - Opsional)
-- ────────────────────────────────────────────────────────────
-- Untuk membuat akun admin, gunakan cara berikut:
--   1. Register via halaman /register di aplikasi
--   2. Kemudian jalankan SQL berikut:
--
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@hashiwa.com';
--
-- ATAU gunakan script create_admin.sql yang sudah ada.


-- ============================================================
-- SELESAI! Database Hashiwa E-Learning LMS siap digunakan.
-- ============================================================
-- Total 21 tabel:
--   1.  users                - Data pengguna
--   2.  profiles             - Profil tambahan
--   3.  classes              - Kelas/Kursus
--   4.  enrollments          - Pendaftaran kelas
--   5.  modules              - Modul dalam kelas
--   6.  materials            - Materi dalam modul
--   7.  progress             - Progress belajar
--   8.  assignments          - Tugas
--   9.  submissions          - Pengumpulan tugas
--   10. exams                - Ujian
--   11. questions            - Soal (+ Bank Soal)
--   12. question_options     - Pilihan jawaban
--   13. exam_submissions     - Pengerjaan ujian
--   14. submission_answers   - Jawaban per soal
--   15. results              - Hasil ujian (legacy)
--   16. payments             - Pembayaran
--   17. certificates         - Sertifikat
--   18. module_enrollments   - Pembelian modul
--   19. course_sessions      - Sesi pertemuan
--   20. attendance_records   - Presensi kehadiran
--   21. session_forums       - Forum diskusi sesi
-- ============================================================

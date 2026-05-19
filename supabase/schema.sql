-- ============================================================
-- HASHIWA E-LEARNING LMS - COMPLETE DATABASE SCHEMA
-- ============================================================
-- File ini adalah referensi schema LENGKAP dan FINAL.
-- Untuk database baru: jalankan full_database.sql
-- Untuk database existing: jalankan migration_complete.sql
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- TABEL UTAMA
-- ────────────────────────────────────────────────────────────

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student', 'instructor')),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users (role);

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id  UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    avatar   TEXT,
    phone    TEXT
);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles (user_id);

-- CLASSES
CREATE TABLE IF NOT EXISTS classes (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title        TEXT NOT NULL,
    description  TEXT,
    price        NUMERIC DEFAULT 0,
    is_active    BOOLEAN DEFAULT true,
    owner_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    course_code  TEXT,
    study_day    TEXT,
    study_time   TEXT,
    room_name    TEXT
);
CREATE INDEX IF NOT EXISTS idx_classes_owner  ON classes (owner_id);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes (is_active);

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS enrollments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    status      TEXT DEFAULT 'active',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, class_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_user  ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments (class_id);

-- MODULES
CREATE TABLE IF NOT EXISTS modules (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id  UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title     TEXT NOT NULL,
    order_no  INT DEFAULT 0,
    price     NUMERIC DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_modules_class ON modules (class_id);

-- MATERIALS
CREATE TABLE IF NOT EXISTS materials (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id  UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title      TEXT NOT NULL,
    type       TEXT NOT NULL,
    content    TEXT,
    duration   INT,
    order_no   INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_materials_module ON materials (module_id);

-- PROGRESS
CREATE TABLE IF NOT EXISTS progress (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id  UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    completed    BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, material_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user     ON progress (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_material ON progress (material_id);

-- ASSIGNMENTS
CREATE TABLE IF NOT EXISTS assignments (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id     UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    description  TEXT,
    deadline     TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments (class_id);

-- SUBMISSIONS (tugas)
CREATE TABLE IF NOT EXISTS submissions (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id  UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url       TEXT,
    score          NUMERIC,
    UNIQUE (assignment_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions (assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user       ON submissions (user_id);

-- EXAMS
CREATE TABLE IF NOT EXISTS exams (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id       UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title          TEXT NOT NULL,
    description    TEXT,
    duration       INT,
    passing_score  INT DEFAULT 60,
    total_points   INT DEFAULT 100,
    is_published   BOOLEAN DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_exams_class ON exams (class_id);

-- QUESTIONS (soal + bank soal)
CREATE TABLE IF NOT EXISTS questions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id          UUID REFERENCES exams(id) ON DELETE CASCADE,
    question         TEXT NOT NULL,
    correct_answer   TEXT,
    type             TEXT NOT NULL DEFAULT 'multiple_choice'
                         CHECK (type IN ('multiple_choice', 'essay', 'true_false')),
    points           INT DEFAULT 1,
    order_no         INT DEFAULT 0,
    code             TEXT,
    course_id        UUID REFERENCES classes(id) ON DELETE CASCADE,
    category         TEXT,
    submission_type  TEXT DEFAULT 'multiple_choice'
                         CHECK (submission_type IN ('multiple_choice', 'upload_file', 'presentation'))
);
CREATE INDEX IF NOT EXISTS idx_questions_exam   ON questions (exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_course ON questions (course_id);

-- QUESTION OPTIONS (pilihan jawaban)
CREATE TABLE IF NOT EXISTS question_options (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text  TEXT NOT NULL,
    is_correct   BOOLEAN DEFAULT false,
    order_no     INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options (question_id);

-- EXAM SUBMISSIONS (pengerjaan ujian)
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
CREATE INDEX IF NOT EXISTS idx_exam_submissions_exam  ON exam_submissions (exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_user  ON exam_submissions (user_id);

-- SUBMISSION ANSWERS (jawaban per soal)
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

-- RESULTS (hasil ujian - legacy, tetap dipertahankan)
CREATE TABLE IF NOT EXISTS results (
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id  UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score    NUMERIC,
    UNIQUE (exam_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_results_exam ON results (exam_id);
CREATE INDEX IF NOT EXISTS idx_results_user ON results (user_id);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id            UUID REFERENCES classes(id) ON DELETE SET NULL,
    module_id           UUID REFERENCES modules(id) ON DELETE SET NULL,
    payment_type        TEXT NOT NULL DEFAULT 'course'
                            CHECK (payment_type IN ('course', 'module')),
    amount              NUMERIC NOT NULL,
    status              TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
    xendit_invoice_id   TEXT,
    xendit_invoice_url  TEXT,
    paid_at             TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_payments_user               ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_class              ON payments (class_id);
CREATE INDEX IF NOT EXISTS idx_payments_status             ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_xendit_invoice_id  ON payments (xendit_invoice_id);

-- CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id  UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    file_url  TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, class_id)
);
CREATE INDEX IF NOT EXISTS idx_certificates_user  ON certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_class ON certificates (class_id);

-- MODULE ENROLLMENTS (pembelian modul)
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

-- COURSE SESSIONS (sesi pertemuan)
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

-- ATTENDANCE RECORDS (presensi)
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

-- SESSION FORUMS (forum diskusi sesi)
CREATE TABLE IF NOT EXISTS session_forums (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  UUID NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_forums_session ON session_forums (session_id);

-- LMS Session & Attendance Structure Migration
-- 1. Modify CLASSES table for course metadata
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS course_code TEXT,
    ADD COLUMN IF NOT EXISTS study_day TEXT,
    ADD COLUMN IF NOT EXISTS study_time TEXT,
    ADD COLUMN IF NOT EXISTS room_name TEXT;
-- 2. Create COURSE_SESSIONS table
CREATE TABLE IF NOT EXISTS course_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    session_no INT NOT NULL,
    instructor_id UUID REFERENCES users(id) ON DELETE
    SET NULL,
        meeting_type TEXT DEFAULT 'tatap_muka',
        -- tatap_muka, daring, dll
        date DATE,
        start_time TIME,
        end_time TIME,
        room TEXT,
        method TEXT,
        vicon_link TEXT,
        teaching_materials TEXT,
        material_plan TEXT,
        material_realization TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(class_id, session_no)
);
-- 3. Create ATTENDANCE_RECORDS table
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES course_sessions(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status CHAR(1) DEFAULT 'H' CHECK (status IN ('H', 'A', 'I', 'S')),
    -- Hadir, Alpa, Izin, Sakit
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(session_id, student_id)
);
-- 4. Create SESSION_FORUMS table
CREATE TABLE IF NOT EXISTS session_forums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES course_sessions(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- 5. Enable RLS
ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_forums ENABLE ROW LEVEL SECURITY;
-- 6. Basic Policies (Admin & Instructor manage everything, Students read)
-- Course Sessions
DROP POLICY IF EXISTS "Anyone can view sessions" ON course_sessions;
CREATE POLICY "Anyone can view sessions" ON course_sessions FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Instructors manage own sessions" ON course_sessions;
CREATE POLICY "Instructors manage own sessions" ON course_sessions FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM classes
        WHERE classes.id = course_sessions.class_id
            AND classes.owner_id = auth.uid()
    )
);
-- Attendance Records
DROP POLICY IF EXISTS "Instructors manage attendance" ON attendance_records;
CREATE POLICY "Instructors manage attendance" ON attendance_records FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM course_sessions s
            JOIN classes c ON s.class_id = c.id
        WHERE s.id = attendance_records.session_id
            AND c.owner_id = auth.uid()
    )
);
DROP POLICY IF EXISTS "Students view own attendance" ON attendance_records;
CREATE POLICY "Students view own attendance" ON attendance_records FOR
SELECT USING (auth.uid() = student_id);
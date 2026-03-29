-- ============================================
-- COMPLETE EXAM SYSTEM - Single Migration
-- Run this in Supabase SQL Editor (one time)
-- ============================================

-- 1. Add columns to exams table
ALTER TABLE exams
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS passing_score INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- 2. Add type, points, order_no to questions table
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'type'
    ) THEN
        ALTER TABLE questions ADD COLUMN type TEXT NOT NULL DEFAULT 'multiple_choice';
        ALTER TABLE questions ADD CONSTRAINT questions_type_check
            CHECK (type IN ('multiple_choice', 'essay', 'true_false'));
    END IF;
END $$;

ALTER TABLE questions
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS order_no INTEGER DEFAULT 0;

-- Make correct_answer nullable (needed for essay questions)
ALTER TABLE questions ALTER COLUMN correct_answer DROP NOT NULL;

-- 3. Create question_options table
CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_no INT DEFAULT 0
);

-- 4. Create exam_submissions table
CREATE TABLE IF NOT EXISTS exam_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
    score NUMERIC DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    graded_at TIMESTAMPTZ,
    graded_by UUID
);

-- 5. Create submission_answers table
CREATE TABLE IF NOT EXISTS submission_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES exam_submissions(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
    answer_text TEXT,
    is_correct BOOLEAN,
    points_awarded INT DEFAULT 0,
    feedback TEXT
);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_exam_submissions_status ON exam_submissions(exam_id, status);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_user ON exam_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_submission ON submission_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_question ON submission_answers(question_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_exam_submissions_unique ON exam_submissions(exam_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_results_unique ON results(exam_id, user_id);

-- 7. Enable RLS
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;

-- 8. Drop old policies (ignore errors)
DROP POLICY IF EXISTS "Public read options" ON question_options;
DROP POLICY IF EXISTS "Read options" ON question_options;
DROP POLICY IF EXISTS "Manage options" ON question_options;
DROP POLICY IF EXISTS "Students create submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students view own submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students update own submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Anyone can read exams" ON exam_submissions;
DROP POLICY IF EXISTS "Students read own submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Read all submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Update submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students create answers" ON submission_answers;
DROP POLICY IF EXISTS "Students view own answers" ON submission_answers;
DROP POLICY IF EXISTS "Read answers" ON submission_answers;
DROP POLICY IF EXISTS "Insert answers" ON submission_answers;
DROP POLICY IF EXISTS "Update answers" ON submission_answers;
DROP POLICY IF EXISTS "Anyone can read exams" ON exams;
DROP POLICY IF EXISTS "Instructors can manage exams" ON exams;
DROP POLICY IF EXISTS "Read exams" ON exams;
DROP POLICY IF EXISTS "Manage exams" ON exams;
DROP POLICY IF EXISTS "Read questions" ON questions;
DROP POLICY IF EXISTS "Manage questions" ON questions;
DROP POLICY IF EXISTS "Read results" ON results;
DROP POLICY IF EXISTS "Insert results" ON results;
DROP POLICY IF EXISTS "Update results" ON results;

-- 9. Create new policies
CREATE POLICY "Read options" ON question_options FOR SELECT USING (true);
CREATE POLICY "Manage options" ON question_options FOR ALL USING (true);
CREATE POLICY "Read all submissions" ON exam_submissions FOR SELECT USING (true);
CREATE POLICY "Create submissions" ON exam_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Update submissions" ON exam_submissions FOR UPDATE USING (true);
CREATE POLICY "Read answers" ON submission_answers FOR SELECT USING (true);
CREATE POLICY "Insert answers" ON submission_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Update answers" ON submission_answers FOR UPDATE USING (true);
CREATE POLICY "Read exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Manage exams" ON exams FOR ALL USING (true);
CREATE POLICY "Read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Manage questions" ON questions FOR ALL USING (true);
CREATE POLICY "Read results" ON results FOR SELECT USING (true);
CREATE POLICY "Insert results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Update results" ON results FOR UPDATE USING (true);

-- 10. Auto-grade trigger for MCQ and True/False
CREATE OR REPLACE FUNCTION auto_grade_mcq_tf()
RETURNS TRIGGER AS $$
DECLARE
    v_question_type TEXT;
    v_correct_answer TEXT;
    v_question_points INT := 0;
    v_is_correct BOOLEAN := false;
BEGIN
    SELECT type, points, correct_answer
    INTO v_question_type, v_question_points, v_correct_answer
    FROM questions WHERE id = NEW.question_id;

    IF v_question_type = 'multiple_choice' AND NEW.selected_option_id IS NOT NULL THEN
        SELECT is_correct INTO v_is_correct
        FROM question_options WHERE id = NEW.selected_option_id;

        IF v_is_correct THEN
            NEW.is_correct := true;
            NEW.points_awarded := COALESCE(v_question_points, 10);
        ELSE
            NEW.is_correct := false;
            NEW.points_awarded := 0;
        END IF;

    ELSIF v_question_type = 'true_false' AND NEW.answer_text IS NOT NULL THEN
        IF LOWER(TRIM(COALESCE(NEW.answer_text, ''))) = LOWER(TRIM(COALESCE(v_correct_answer, ''))) THEN
            NEW.is_correct := true;
            NEW.points_awarded := COALESCE(v_question_points, 10);
        ELSE
            NEW.is_correct := false;
            NEW.points_awarded := 0;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_grade_mcq ON submission_answers;
CREATE TRIGGER trg_auto_grade_mcq
    BEFORE INSERT ON submission_answers
    FOR EACH ROW
    EXECUTE FUNCTION auto_grade_mcq_tf();

-- 11. Update submission score trigger
CREATE OR REPLACE FUNCTION update_submission_score()
RETURNS TRIGGER AS $$
DECLARE
    v_total_awarded NUMERIC;
    v_max_score NUMERIC;
    v_exam_id UUID;
BEGIN
    SELECT exam_id INTO v_exam_id FROM exam_submissions WHERE id = NEW.submission_id;
    IF v_exam_id IS NULL THEN RETURN NEW; END IF;

    SELECT COALESCE(SUM(COALESCE(points_awarded, 0)), 0) INTO v_total_awarded
    FROM submission_answers WHERE submission_id = NEW.submission_id;

    SELECT COALESCE(SUM(COALESCE(points, 10)), 0) INTO v_max_score
    FROM questions WHERE exam_id = v_exam_id;

    IF v_max_score > 0 THEN
        UPDATE exam_submissions
        SET score = ROUND((v_total_awarded / v_max_score) * 100)
        WHERE id = NEW.submission_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_submission_score ON submission_answers;
CREATE TRIGGER trg_update_submission_score
    AFTER INSERT OR UPDATE OF points_awarded ON submission_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_score();

-- ============================================
-- DONE! Exam system is ready.
-- ============================================
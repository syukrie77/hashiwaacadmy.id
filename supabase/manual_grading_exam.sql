-- ============================================
-- Manual Grading Exam System - Complete Migration
-- Run this AFTER enhance_exam_system.sql
-- ============================================

-- ==========================================
-- STEP 1: Add missing columns to exams
-- ==========================================
ALTER TABLE exams
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS passing_score INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- ==========================================
-- STEP 2: Add grading columns to exam_submissions
-- ==========================================
ALTER TABLE exam_submissions
ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS graded_by UUID;

-- ==========================================
-- STEP 3: Ensure feedback column exists on submission_answers
-- ==========================================
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'submission_answers' AND column_name = 'feedback'
    ) THEN
        ALTER TABLE submission_answers ADD COLUMN feedback TEXT;
    END IF;
END $$;

-- ==========================================
-- STEP 4: Create indexes for performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_exam_submissions_status ON exam_submissions(exam_id, status);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_user ON exam_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_submission ON submission_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_question ON submission_answers(question_id);

-- ==========================================
-- STEP 5: Unique constraint - one submission per student per exam
-- ==========================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_exam_submissions_unique
ON exam_submissions(exam_id, user_id);

-- ==========================================
-- STEP 6: Database trigger for auto-grading MCQ & True/False
-- ==========================================
CREATE OR REPLACE FUNCTION auto_grade_mcq_tf()
RETURNS TRIGGER AS $$
DECLARE
    v_question_type TEXT;
    v_correct_answer TEXT;
    v_question_points INT := 0;
    v_is_correct BOOLEAN := false;
BEGIN
    -- Get question details
    SELECT type, points, correct_answer
    INTO v_question_type, v_question_points, v_correct_answer
    FROM questions WHERE id = NEW.question_id;

    IF v_question_type = 'multiple_choice' AND NEW.selected_option_id IS NOT NULL THEN
        -- Check if selected option is correct
        SELECT is_correct INTO v_is_correct
        FROM question_options
        WHERE id = NEW.selected_option_id;

        IF v_is_correct THEN
            NEW.is_correct := true;
            NEW.points_awarded := COALESCE(v_question_points, 10);
        ELSE
            NEW.is_correct := false;
            NEW.points_awarded := 0;
        END IF;

    ELSIF v_question_type = 'true_false' AND NEW.answer_text IS NOT NULL THEN
        -- Compare answer with correct_answer
        IF LOWER(TRIM(COALESCE(NEW.answer_text, ''))) = LOWER(TRIM(COALESCE(v_correct_answer, ''))) THEN
            NEW.is_correct := true;
            NEW.points_awarded := COALESCE(v_question_points, 10);
        ELSE
            NEW.is_correct := false;
            NEW.points_awarded := 0;
        END IF;

    END IF;
    -- Essay: leave is_correct NULL and points_awarded NULL for manual grading

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_grade_mcq ON submission_answers;
CREATE TRIGGER trg_auto_grade_mcq
    BEFORE INSERT ON submission_answers
    FOR EACH ROW
    EXECUTE FUNCTION auto_grade_mcq_tf();

-- ==========================================
-- STEP 7: Trigger to update submission score
-- ==========================================
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
    FROM submission_answers
    WHERE submission_id = NEW.submission_id;

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

-- ==========================================
-- STEP 8: Fix RLS Policies
-- Drop conflicting policies from enhance_exam_system.sql first
-- ==========================================

-- EXAM SUBMISSIONS
DROP POLICY IF EXISTS "Students create submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students view own submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students update own submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Anyone can read exams" ON exam_submissions;
DROP POLICY IF EXISTS "Students read own submissions" ON exam_submissions;

-- Allow students to create their own submissions
CREATE POLICY "Students create submissions" ON exam_submissions
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read submissions (instructors need access for grading)
CREATE POLICY "Read all submissions" ON exam_submissions
    FOR SELECT USING (true);

-- Allow update (status changes, grading)
CREATE POLICY "Update submissions" ON exam_submissions
    FOR UPDATE USING (true);

-- SUBMISSION ANSWERS
DROP POLICY IF EXISTS "Students create answers" ON submission_answers;
DROP POLICY IF EXISTS "Students view own answers" ON submission_answers;
DROP POLICY IF EXISTS "Read answers" ON submission_answers;
DROP POLICY IF EXISTS "Insert answers" ON submission_answers;
DROP POLICY IF EXISTS "Update answers" ON submission_answers;

-- Allow insert answers
CREATE POLICY "Insert answers" ON submission_answers
    FOR INSERT WITH CHECK (true);

-- Allow read answers (instructors need for grading)
CREATE POLICY "Read answers" ON submission_answers
    FOR SELECT USING (true);

-- Allow update answers (for grading)
CREATE POLICY "Update answers" ON submission_answers
    FOR UPDATE USING (true);

-- EXAMS
DROP POLICY IF EXISTS "Anyone can read exams" ON exams;
DROP POLICY IF EXISTS "Instructors can manage exams" ON exams;
CREATE POLICY "Read exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Manage exams" ON exams FOR ALL USING (true);

-- QUESTIONS
DROP POLICY IF EXISTS "Read questions" ON questions;
DROP POLICY IF EXISTS "Manage questions" ON questions;
CREATE POLICY "Read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Manage questions" ON questions FOR ALL USING (true);

-- QUESTION OPTIONS
DROP POLICY IF EXISTS "Public read options" ON question_options;
DROP POLICY IF EXISTS "Read options" ON question_options;
DROP POLICY IF EXISTS "Manage options" ON question_options;
CREATE POLICY "Read options" ON question_options FOR SELECT USING (true);
CREATE POLICY "Manage options" ON question_options FOR ALL USING (true);

-- RESULTS
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Add unique constraint for upsert (onConflict: "exam_id, user_id")
CREATE UNIQUE INDEX IF NOT EXISTS idx_results_unique ON results(exam_id, user_id);

DROP POLICY IF EXISTS "Read results" ON results;
DROP POLICY IF EXISTS "Insert results" ON results;
DROP POLICY IF EXISTS "Update results" ON results;
CREATE POLICY "Read results" ON results FOR SELECT USING (true);
CREATE POLICY "Insert results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Update results" ON results FOR UPDATE USING (true);

-- ==========================================
-- DONE! Run this migration in Supabase SQL Editor
-- ==========================================
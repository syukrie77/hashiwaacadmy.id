-- ENHANCED EXAM SCHEMA
-- 1. Update EXAMS table
ALTER TABLE exams
ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS passing_score INT DEFAULT 60,
    ADD COLUMN IF NOT EXISTS total_points INT DEFAULT 100,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
-- 2. Update QUESTIONS table
-- We alter the type check constraint if possible, but safer to add new column if needed or drop constraint.
-- Assuming 'questions' already exists with simple structure.
-- We will add 'type' column.
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'questions'
        AND column_name = 'type'
) THEN
ALTER TABLE questions
ADD COLUMN type TEXT NOT NULL DEFAULT 'multiple_choice';
ALTER TABLE questions
ADD CONSTRAINT questions_type_check CHECK (
        type IN ('multiple_choice', 'essay', 'true_false')
    );
END IF;
END $$;
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS points INT DEFAULT 1,
    ADD COLUMN IF NOT EXISTS order_no INT DEFAULT 0;
-- Drop correct_answer not null constraint
ALTER TABLE questions
ALTER COLUMN correct_answer DROP NOT NULL;
-- 3. Create QUESTION_OPTIONS table (for Multiple Choice)
CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_no INT DEFAULT 0
);
-- 4. Create EXAM_SUBMISSIONS table
CREATE TABLE IF NOT EXISTS exam_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
    score NUMERIC DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE
);
-- 5. Create SUBMISSION_ANSWERS table
CREATE TABLE IF NOT EXISTS submission_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES exam_submissions(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    -- For MCQ:
    selected_option_id UUID REFERENCES question_options(id) ON DELETE
    SET NULL,
        -- For Essay / Text:
        answer_text TEXT,
        -- Grading
        is_correct BOOLEAN,
        -- calculated for MCQ, manual for Essay
        points_awarded INT DEFAULT 0,
        feedback TEXT -- Instructor feedback
);
-- RLS Policies (Basic)
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read options" ON question_options;
DROP POLICY IF EXISTS "Students create submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students view own submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students update own submissions" ON exam_submissions;
DROP POLICY IF EXISTS "Students create answers" ON submission_answers;
DROP POLICY IF EXISTS "Students view own answers" ON submission_answers;
-- Allow read access to options for everyone (or enrolled students)
CREATE POLICY "Public read options" ON question_options FOR
SELECT USING (true);
-- Allow students to create their own submissions
CREATE POLICY "Students create submissions" ON exam_submissions FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students view own submissions" ON exam_submissions FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students update own submissions" ON exam_submissions FOR
UPDATE USING (auth.uid() = user_id);
-- Allow students to create answers
CREATE POLICY "Students create answers" ON submission_answers FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM exam_submissions
            WHERE id = submission_id
                AND user_id = auth.uid()
        )
    );
CREATE POLICY "Students view own answers" ON submission_answers FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM exam_submissions
            WHERE id = submission_id
                AND user_id = auth.uid()
        )
    );
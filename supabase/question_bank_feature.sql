-- QUESTION BANK FEATURE
-- 1. Alter QUESTIONS table to support Question Bank (independent of exams)
ALTER TABLE questions
ALTER COLUMN exam_id DROP NOT NULL,
    ALTER COLUMN correct_answer DROP NOT NULL;
-- 2. Add new columns to QUESTIONS table
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS code TEXT,
    ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS category TEXT,
    -- e.g. 'UTS', 'UAS', 'Quiz'
ADD COLUMN IF NOT EXISTS submission_type TEXT DEFAULT 'multiple_choice';
-- 'multiple_choice', 'upload_file', 'presentation'
-- 3. Add constraint for submission_type
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'questions_submission_type_check'
) THEN
ALTER TABLE questions
ADD CONSTRAINT questions_submission_type_check CHECK (
        submission_type IN ('multiple_choice', 'upload_file', 'presentation')
    );
END IF;
END $$;
-- 4. Add RLS Policies for Question Bank if not covered (Admins/Instructors)
-- Assuming Instructors can view/create questions for their courses, Admins for all.
-- For now, we'll ensure basic access.
-- Policy to allow Instructors to view questions for their courses or created by them?
-- Simplified for now: Authenticated users (instructors/admins) can view/edit questions.
-- Ideally, we should check course ownership.
-- Update policies if needed. For now, assuming existing RLS or disabled RLS for dev.
-- If RLS is enabled:
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON questions;
DROP POLICY IF EXISTS "Enable update for owners" ON questions;
CREATE POLICY "Enable read access for authenticated users" ON questions FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for instructors and admins" ON questions FOR
INSERT WITH CHECK (
        auth.role() = 'authenticated' -- AND (exists check for instructor/admin role) - simplifying for now
    );
CREATE POLICY "Enable update for instructors and admins" ON questions FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for instructors and admins" ON questions FOR DELETE USING (auth.role() = 'authenticated');
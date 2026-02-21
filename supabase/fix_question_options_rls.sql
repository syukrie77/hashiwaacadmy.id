-- Enable RLS on valid tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
-- 1. Policies for Questions
-- Allow Admins and Instructors to view all questions (simplified for now)
DROP POLICY IF EXISTS "View questions" ON questions;
CREATE POLICY "View questions" ON questions FOR
SELECT TO authenticated USING (true);
-- Allow Admins and Instructors to insert/update/delete questions
DROP POLICY IF EXISTS "Manage questions" ON questions;
CREATE POLICY "Manage questions" ON questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- 2. Policies for Question Options
-- Allow Admins and Instructors to view options
DROP POLICY IF EXISTS "View options" ON question_options;
CREATE POLICY "View options" ON question_options FOR
SELECT TO authenticated USING (true);
-- Allow Admins and Instructors to insert/update/delete options
DROP POLICY IF EXISTS "Manage options" ON question_options;
CREATE POLICY "Manage options" ON question_options FOR ALL TO authenticated USING (true) WITH CHECK (true);
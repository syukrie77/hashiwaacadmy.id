-- Fix Question Bank Relationships
-- Ensures that the course_id foreign key is correctly applied, even if the column already existed.
-- 1. Ensure column exists (idempotent)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS course_id UUID;
-- 2. Explicitly add Foreign Key Constraint (safely)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_questions_classes'
        AND table_name = 'questions'
) THEN -- Check if there's already a constraint with a different name or auto-generated name?
-- We'll try to add a named constraint.
-- First, we might need to clean up bad data if enforced?
-- Assuming course_id is nullable (it is), so invalid data isn't an issue unless values exist that are not in classes.
ALTER TABLE questions
ADD CONSTRAINT fk_questions_classes FOREIGN KEY (course_id) REFERENCES classes(id) ON DELETE CASCADE;
END IF;
END $$;
-- 3. Create Index for performance (and to help Supabase detect relation)
CREATE INDEX IF NOT EXISTS idx_questions_course_id ON questions(course_id);
-- 4. Ensure RLS on classes covers reading for joins
-- If RLS is enabled on classes, we need to ensure authenticated users can read it to perform the join.
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'classes'
        AND policyname = 'Enable read access for authenticated users'
) THEN CREATE POLICY "Enable read access for authenticated users" ON classes FOR
SELECT USING (auth.role() = 'authenticated');
END IF;
END $$;
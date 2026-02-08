-- FILE: supabase/fix_progress_tracking.sql
-- EXECUTING THIS SCRIPT IN SUPABASE DASHBOARD > SQL EDITOR IS REQUIRED.
-- 1. Enable RLS on progress table
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
-- 2. Add UNIQUE constraint for (user_id, material_id) to allow UPSERT to work
-- This is critical for the "onConflict" logic in the code.
ALTER TABLE progress
ADD CONSTRAINT progress_user_material_unique UNIQUE (user_id, material_id);
-- 3. Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Public progress access" ON progress;
DROP POLICY IF EXISTS "Enable all functionality for progress" ON progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON progress;
-- 4. Create permissive policy for Anon users (since you are using custom client-side auth)
-- This allows the "Mark as Completed" button to actually write to the database.
CREATE POLICY "Public progress access" ON progress FOR ALL USING (true) WITH CHECK (true);
-- 5. Also fix Enrollments table just in case (similar issue might happen there)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public enrollments access" ON enrollments;
CREATE POLICY "Public enrollments access" ON enrollments FOR ALL USING (true) WITH CHECK (true);
-- 6. Add UNIQUE constraint for enrollments too (one enrollment per course per user)
ALTER TABLE enrollments
ADD CONSTRAINT enrollments_user_class_unique UNIQUE (user_id, class_id);
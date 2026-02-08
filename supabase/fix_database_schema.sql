-- FILE: supabase/fix_database_schema.sql
-- EXECUTING THIS SCRIPT IN SUPABASE DASHBOARD > SQL EDITOR IS REQUIRED.
-- 1. Fix missing 'order_no' column in 'materials' table
ALTER TABLE materials
ADD COLUMN IF NOT EXISTS order_no INT DEFAULT 0;
-- 2. Fix missing 'order_no' column in 'modules' table (just in case)
ALTER TABLE modules
ADD COLUMN IF NOT EXISTS order_no INT DEFAULT 0;
-- 3. Fix potential missing 'duration' column in 'materials'
ALTER TABLE materials
ADD COLUMN IF NOT EXISTS duration INT DEFAULT 0;
-- 4. Fix potential missing 'content' column in 'materials'
ALTER TABLE materials
ADD COLUMN IF NOT EXISTS content TEXT;
-- 5. Ensure RLS policies are actually applied (Repeated from previous fix to be 100% sure)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public materials access" ON materials;
CREATE POLICY "Public materials access" ON materials FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public modules access" ON modules;
CREATE POLICY "Public modules access" ON modules FOR ALL USING (true) WITH CHECK (true);
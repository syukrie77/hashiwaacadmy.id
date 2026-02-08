-- FILE: supabase/fix_rls_policies.sql
-- Run this script in your Supabase Dashboard > SQL Editor to fix the RLS errors.
-- ==========================================
-- 1. DATABASE TABLES POLICIES
-- ==========================================
-- Enable RLS (just to be sure we are configuring it correctly)
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Drop ALL logical variations of previous policies to ensure a clean slate
DROP POLICY IF EXISTS "Public modules access" ON modules;
DROP POLICY IF EXISTS "Public materials access" ON materials;
DROP POLICY IF EXISTS "Public assignments access" ON assignments;
DROP POLICY IF EXISTS "Public exams access" ON exams;
DROP POLICY IF EXISTS "Public classes access" ON classes;
DROP POLICY IF EXISTS "Public users access" ON users;
DROP POLICY IF EXISTS "Enable all functionality for modules" ON modules;
DROP POLICY IF EXISTS "Enable all functionality for materials" ON materials;
DROP POLICY IF EXISTS "Enable all functionality for assignments" ON assignments;
DROP POLICY IF EXISTS "Enable all functionality for exams" ON exams;
DROP POLICY IF EXISTS "Enable read access for classes" ON classes;
DROP POLICY IF EXISTS "Enable intent/update/delete for classes (admin only via anon?)" ON classes;
DROP POLICY IF EXISTS "Enable read access for users" ON users;
-- Create FULL ACCESS policies for 'anon' public role
-- (Necessary because your app uses localStorage auth, not Supabase auth sessions)
CREATE POLICY "Public modules access" ON modules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public materials access" ON materials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public assignments access" ON assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public exams access" ON exams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public classes access" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public users access" ON users FOR ALL USING (true) WITH CHECK (true);
-- ==========================================
-- 2. STORAGE POLICIES (For File Uploads)
-- ==========================================
-- Ensure the 'materials' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true) ON CONFLICT (id) DO
UPDATE
SET public = true;
-- Drop existing storage policies for this bucket
DROP POLICY IF EXISTS "Public materials storage access" ON storage.objects;
DROP POLICY IF EXISTS "Give me access to own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
-- Create FULL ACCESS policy for storage objects in 'materials' bucket
CREATE POLICY "Public materials storage access" ON storage.objects FOR ALL USING (bucket_id = 'materials') WITH CHECK (bucket_id = 'materials');
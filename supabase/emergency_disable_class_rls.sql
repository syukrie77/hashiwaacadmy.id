-- EMERGENCY FIX: Disable RLS on classes table to rule out permission issues
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
-- If you prefer NOT to disable RLS, ensure the admin user exists in the 'users' table with role 'admin'
-- SELECT * FROM users WHERE id = auth.uid();
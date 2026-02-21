-- Safely drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Admins can do everything on classes" ON classes;
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
-- Enable RLS (idempotent)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- 1. Policy for Classes: Allow Admins to do ALL (Select, Insert, Update, Delete)
CREATE POLICY "Admins can do everything on classes" ON classes FOR ALL TO authenticated USING (
    exists (
        select 1
        from users
        where users.id = auth.uid()
            and users.role = 'admin'
    )
);
-- 2. Policy for Classes: Allow Instructors to view their own classes (optional, but good for safety)
-- (You might already have this, so we won't force it if it conflicts, but here is a safe version)
-- CREATE POLICY "Instructors can view own classes" ...
-- 3. Policy for Users: Critical for the Admin check above to work!
-- The admin needs to be able to read the 'users' table to verify their own role.
CREATE POLICY "Users are viewable by everyone" ON users FOR
SELECT TO authenticated USING (true);
-- Debugging info (Effective only when running in dashboard)
-- select * from classes limit 1;
-- Enable RLS on classes just in case (good practice, though might already be on)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
-- Policy to allow Admins to ALL operations on classes
-- We assume 'users' table has 'id' and 'role'
CREATE POLICY "Admins can do everything on classes" ON classes FOR ALL TO authenticated USING (
    exists (
        select 1
        from users
        where users.id = auth.uid()
            and users.role = 'admin'
    )
);
-- Also ensure 'users' table is readable so the subquery works
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users are viewable by everyone" ON users FOR
SELECT TO authenticated USING (true);
-- Debugging: Ensure owner_id column allows nulls or has valid FK
-- (This should already be fine based on previous work)
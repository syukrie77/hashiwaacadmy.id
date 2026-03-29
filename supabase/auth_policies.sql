-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- POLICIES FOR USERS TABLE
CREATE POLICY "Users can read all users (needed for display)" ON users FOR
SELECT USING (true);
CREATE POLICY "Users can update their own data" ON users FOR
UPDATE USING (auth.uid() = id);
-- POLICIES FOR PROFILES
CREATE POLICY "Public read profiles" ON profiles FOR
SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR ALL USING (auth.uid() = user_id);
-- POLICIES FOR CLASSES
CREATE POLICY "Classes are public readable" ON classes FOR
SELECT USING (true);
CREATE POLICY "Only admins and instructors can manage classes" ON classes FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
    )
);
-- POLICIES FOR ENROLLMENTS
CREATE POLICY "Users can read their own enrollments" ON enrollments FOR
SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1
            FROM users
            WHERE users.id = auth.uid()
                AND users.role IN ('admin', 'instructor')
        )
    );
CREATE POLICY "Users can enroll themselves" ON enrollments FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Only admins can update/delete enrollments" ON enrollments FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM users
            WHERE users.id = auth.uid()
                AND users.role = 'admin'
        )
    );
-- POLICIES FOR PROGRESS 
CREATE POLICY "Users can read and update their own progress" ON progress FOR ALL USING (auth.uid() = user_id);
-- POLICIES FOR MODULES AND MATERIALS
CREATE POLICY "Public read modules" ON modules FOR
SELECT USING (true);
CREATE POLICY "Public read materials" ON materials FOR
SELECT USING (true);
CREATE POLICY "Only admins/instructors can manage course contents" ON modules FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
    )
);
CREATE POLICY "Only admins/instructors can manage materials" ON materials FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'instructor')
    )
);
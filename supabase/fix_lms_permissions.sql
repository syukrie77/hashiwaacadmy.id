-- Refined RLS for Sessions & Attendance
-- Allows both Admins and assigned Instructors to manage sessions.
-- 1. Helper Function to check if user is admin (to avoid repetitive subqueries)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID) RETURNS BOOLEAN AS $$
SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE id = user_id
            AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER;
-- 2. Course Sessions Policies
DROP POLICY IF EXISTS "Instructors manage own sessions" ON course_sessions;
CREATE POLICY "Admin and Instructor Manage Sessions" ON course_sessions FOR ALL TO authenticated USING (
    is_admin(auth.uid())
    OR EXISTS (
        SELECT 1
        FROM classes
        WHERE classes.id = course_sessions.class_id
            AND classes.owner_id = auth.uid()
    )
) WITH CHECK (
    is_admin(auth.uid())
    OR EXISTS (
        SELECT 1
        FROM classes
        WHERE classes.id = course_sessions.class_id
            AND classes.owner_id = auth.uid()
    )
);
-- 3. Attendance Records Policies
DROP POLICY IF EXISTS "Instructors manage attendance" ON attendance_records;
CREATE POLICY "Admin and Instructor Manage Attendance" ON attendance_records FOR ALL TO authenticated USING (
    is_admin(auth.uid())
    OR EXISTS (
        SELECT 1
        FROM course_sessions s
            JOIN classes c ON s.class_id = c.id
        WHERE s.id = attendance_records.session_id
            AND (
                c.owner_id = auth.uid()
                OR is_admin(auth.uid())
            )
    )
) WITH CHECK (
    is_admin(auth.uid())
    OR EXISTS (
        SELECT 1
        FROM course_sessions s
            JOIN classes c ON s.class_id = c.id
        WHERE s.id = attendance_records.session_id
            AND (
                c.owner_id = auth.uid()
                OR is_admin(auth.uid())
            )
    )
);
-- 4. Session Forums Policies
DROP POLICY IF EXISTS "Admin and Instructor Manage Forums" ON session_forums;
CREATE POLICY "Admin and Instructor Manage Forums" ON session_forums FOR ALL TO authenticated USING (
    is_admin(auth.uid())
    OR EXISTS (
        SELECT 1
        FROM course_sessions s
            JOIN classes c ON s.class_id = c.id
        WHERE s.id = session_forums.session_id
            AND (
                c.owner_id = auth.uid()
                OR is_admin(auth.uid())
            )
    )
);
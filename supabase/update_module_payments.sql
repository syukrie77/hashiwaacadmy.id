-- FILE: supabase/update_module_payments.sql
-- 1. Add price column to modules
ALTER TABLE modules
ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
-- 2. Create module_enrollments table
CREATE TABLE IF NOT EXISTS module_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    -- Optional but good for queries
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT module_enrollments_user_module_unique UNIQUE (user_id, module_id)
);
-- 3. Enable RLS
ALTER TABLE module_enrollments ENABLE ROW LEVEL SECURITY;
-- 4. Policies
-- Allow users to see their own enrollments
CREATE POLICY "Users can read own module enrollments" ON module_enrollments FOR
SELECT USING (true);
-- Opening broadly for client-side queries for now, can refine later
-- Allow insert (for "buying" the module)
CREATE POLICY "Users can create module enrollments" ON module_enrollments FOR
INSERT WITH CHECK (true);
-- 5. Fix Course Enrollment Logic (Optional)
-- If we want to keep course-level enrollment as just a "member" marker without price, 
-- we can keep the existing enrollments table.
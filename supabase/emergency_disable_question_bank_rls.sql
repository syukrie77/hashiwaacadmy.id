-- EMERGENCY FIX: Disable RLS on Question Bank tables
-- This removes ALL permission checks for these tables.
-- The user must be authenticated at the endpoint level, but DB will accept any query.
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE question_options DISABLE ROW LEVEL SECURITY;
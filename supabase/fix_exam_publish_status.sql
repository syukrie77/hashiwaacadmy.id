-- Fix: Set is_published = true for all existing exams that have questions
-- This fixes exams created via admin builder that were missing is_published flag
-- Run this in Supabase SQL Editor

-- Option 1: Publish all exams that have at least 1 question (recommended)
UPDATE exams
SET is_published = true,
    passing_score = COALESCE(passing_score, 60)
WHERE is_published IS DISTINCT FROM true
  AND EXISTS (
    SELECT 1 FROM questions WHERE questions.exam_id = exams.id LIMIT 1
  );

-- Option 2 (alternative): Publish ALL existing exams regardless of questions
-- UPDATE exams SET is_published = true, passing_score = COALESCE(passing_score, 60) WHERE is_published IS DISTINCT FROM true;

-- Verify the fix
SELECT id, title, is_published, passing_score, 
       (SELECT COUNT(*) FROM questions WHERE questions.exam_id = exams.id) as question_count
FROM exams;

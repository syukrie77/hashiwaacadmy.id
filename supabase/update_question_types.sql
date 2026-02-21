-- Drop the existing check constraint
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check;
-- Add the new check constraint with all supported types
ALTER TABLE questions
ADD CONSTRAINT questions_type_check CHECK (
        type IN (
            'multiple_choice',
            'essay',
            'upload_file',
            'presentation'
        )
    );
-- Comment to document usage in Supabase dashboard
COMMENT ON CONSTRAINT questions_type_check ON questions IS 'Enforces valid question types: multiple_choice, essay, upload_file, presentation';
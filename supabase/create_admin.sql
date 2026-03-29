-- Setup Admin User for Hashiwa LMS
-- This script safely attempts to create an admin user or update an existing one
-- Replace the email and password below with your desired admin credentials
DO $$
DECLARE v_email TEXT := 'admin@hashiwa.com';
v_password TEXT := 'admin123';
v_name TEXT := 'Admin System';
v_role TEXT := 'admin';
v_user_id UUID;
v_encrypted_pw TEXT;
BEGIN -- 1. Get or create the auth user
SELECT id INTO v_user_id
FROM auth.users
WHERE email = v_email;
IF v_user_id IS NULL THEN -- Standard way to insert into auth.users in Postgres 
-- Note: using a quick crypt function if pgcrypto is available, 
-- otherwise we recommend doing this via the UI.
-- Generate a random UUID
v_user_id := gen_random_uuid();
-- WARNING: Supabase auth.users raw password insertion can be tricky due to their custom hashing.
-- For a true script, you usually generate the bcrypt hash outside and insert here.
-- If this fails, the foolproof way is:
-- 1. Register 'admin@hashiwa.com' normally through your app's /register page.
-- 2. Then run the UPDATE statement in section 2 below.
-- Assuming standard crypt:
v_encrypted_pw := crypt(v_password, gen_salt('bf'));
INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        v_email,
        v_encrypted_pw,
        now(),
        null,
        null,
        '{}',
        '{}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );
RAISE NOTICE 'Created auth.user %',
v_email;
ELSE RAISE NOTICE 'Auth user % already exists',
v_email;
END IF;
-- 2. Update or insert into public.users
IF EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = v_user_id
) THEN
UPDATE public.users
SET role = v_role,
    name = v_name
WHERE id = v_user_id;
RAISE NOTICE 'Updated public.user % to admin role',
v_email;
ELSE
INSERT INTO public.users (id, name, email, role)
VALUES (v_user_id, v_name, v_email, v_role);
RAISE NOTICE 'Inserted public.user % with admin role',
v_email;
END IF;
END $$;
-- ---------------------------------------------------------
-- ALTERNATIVE (EASIEST) METHOD:
-- If you already registered an account via the website (e.g., myadmin@email.com),
-- just run this single line in the Supabase SQL Editor:
-- 
-- UPDATE public.users SET role = 'admin' WHERE email = 'YOUR_EMAIL@HERE.COM';
-- ---------------------------------------------------------
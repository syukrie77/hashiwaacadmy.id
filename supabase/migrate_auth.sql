-- Migration script to move users from public.users to auth.users safely
-- NOTE: RUN THIS SCRIPT IN SUPABASE SQL EDITOR
-- 1. Insert into auth.users (to allow login)
INSERT INTO auth.users (
        instance_id,
        id,
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
SELECT '00000000-0000-0000-0000-000000000000',
    id,
    'authenticated',
    'authenticated',
    email,
    password,
    -- This is the bcrypt hash from the app
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('name', name, 'role', role),
    created_at,
    created_at,
    '',
    '',
    '',
    ''
FROM public.users ON CONFLICT (id) DO NOTHING;
-- 2. Insert into auth.identities
INSERT INTO auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
SELECT id::text,
    id,
    jsonb_build_object('sub', id::text, 'email', email),
    'email',
    now(),
    created_at,
    created_at
FROM public.users ON CONFLICT (provider_id, provider) DO NOTHING;
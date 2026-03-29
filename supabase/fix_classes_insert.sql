-- ============================================================
-- FIX: "new row violates row-level security policy for table classes"
-- ============================================================
-- Masalah: FOR ALL policy memerlukan WITH CHECK untuk INSERT.
-- Juga perlu memastikan format JWT metadata benar.
-- ============================================================

-- LANGKAH 0: Cek dulu format JWT metadata Anda
-- Jalankan ini untuk melihat isi token (hasilnya akan muncul di bawah)
SELECT 
    au.email,
    au.raw_app_meta_data,
    au.raw_user_meta_data
FROM auth.users au
WHERE au.email = 'syukrie77@gmail.com';

-- ──────────────────────────────────
-- LANGKAH 1: Hapus SEMUA policies pada classes
-- ──────────────────────────────────
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname FROM pg_policies WHERE tablename = 'classes' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.classes', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- ──────────────────────────────────
-- LANGKAH 2: Buat ulang policies classes DENGAN WITH CHECK
-- ──────────────────────────────────

-- Siapapun bisa melihat classes
CREATE POLICY "classes_select_public" ON public.classes
    FOR SELECT
    USING (true);

-- Admin/Instructor bisa INSERT classes baru
CREATE POLICY "classes_insert_admin_instructor" ON public.classes
    FOR INSERT
    TO authenticated
    WITH CHECK (
        coalesce(
            current_setting('request.jwt.claims', true)::json -> 'app_metadata' ->> 'role',
            current_setting('request.jwt.claims', true)::json -> 'user_metadata' ->> 'role',
            (SELECT role FROM public.users WHERE id = auth.uid())
        ) IN ('admin', 'instructor')
    );

-- Admin/Instructor bisa UPDATE classes
CREATE POLICY "classes_update_admin_instructor" ON public.classes
    FOR UPDATE
    TO authenticated
    USING (
        coalesce(
            current_setting('request.jwt.claims', true)::json -> 'app_metadata' ->> 'role',
            current_setting('request.jwt.claims', true)::json -> 'user_metadata' ->> 'role',
            (SELECT role FROM public.users WHERE id = auth.uid())
        ) IN ('admin', 'instructor')
    );

-- Admin/Instructor bisa DELETE classes
CREATE POLICY "classes_delete_admin_instructor" ON public.classes
    FOR DELETE
    TO authenticated
    USING (
        coalesce(
            current_setting('request.jwt.claims', true)::json -> 'app_metadata' ->> 'role',
            current_setting('request.jwt.claims', true)::json -> 'user_metadata' ->> 'role',
            (SELECT role FROM public.users WHERE id = auth.uid())
        ) IN ('admin', 'instructor')
    );


-- ──────────────────────────────────
-- LANGKAH 3: Pastikan metadata admin benar di auth.users
-- ──────────────────────────────────
UPDATE auth.users
SET 
    raw_app_meta_data = jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email'],
        'role', 'admin'
    ),
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin", "name": "Syukrie"}'::jsonb
WHERE email = 'syukrie77@gmail.com';

-- Juga pastikan public.users benar
UPDATE public.users SET role = 'admin' WHERE email = 'syukrie77@gmail.com';


-- ──────────────────────────────────
-- LANGKAH 4: Verifikasi
-- ──────────────────────────────────
SELECT 
    u.email,
    u.role as "public_role",
    au.raw_app_meta_data as "app_metadata",
    au.raw_user_meta_data as "user_metadata"
FROM public.users u
JOIN auth.users au ON au.id = u.id
WHERE u.email = 'syukrie77@gmail.com';

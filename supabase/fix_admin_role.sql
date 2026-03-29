-- ============================================================
-- FIX FINAL: Users table RLS + Set Admin
-- ============================================================
-- Script ini HARUS dijalankan SEBELUM fix_all_rls_final.sql
-- ============================================================

-- LANGKAH 1: Hapus SEMUA policies pada tabel users
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
        RAISE NOTICE 'Dropped: %', pol.policyname;
    END LOOP;
END $$;

-- LANGKAH 2: Buat policies BARU yang SEDERHANA dan AMAN
-- Kuncinya: policy SELECT pada users TIDAK PERNAH query tabel users itu sendiri

-- Semua orang bisa baca tabel users (termasuk anon, untuk registrasi)
CREATE POLICY "users_read_all" ON public.users
    FOR SELECT USING (true);

-- User bisa insert data sendiri saat register
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Anon juga bisa insert (untuk trigger saat sign up)
CREATE POLICY "users_insert_anon" ON public.users
    FOR INSERT TO anon
    WITH CHECK (true);

-- User bisa update data sendiri
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

-- Admin bisa update semua user — AMAN karena SELECT policy di atas 
-- tidak query users (jadi tidak recursive)
CREATE POLICY "users_admin_update_all" ON public.users
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin bisa delete user
CREATE POLICY "users_admin_delete" ON public.users
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin bisa insert user baru
CREATE POLICY "users_admin_insert" ON public.users
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );


-- LANGKAH 3: Set syukrie77@gmail.com sebagai admin
DO $$
DECLARE v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'syukrie77@gmail.com';
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Email syukrie77@gmail.com TIDAK ditemukan di auth.users!';
    END IF;

    -- Update/Insert di public.users
    INSERT INTO public.users (id, name, email, role)
    VALUES (v_user_id, 'Syukrie', 'syukrie77@gmail.com', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';

    -- Update metadata auth
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin", "name": "Syukrie"}'::jsonb
    WHERE id = v_user_id;

    RAISE NOTICE 'User syukrie77@gmail.com = ADMIN ✓';
END $$;


-- LANGKAH 4: Verifikasi
SELECT u.email, u.role, au.raw_app_meta_data, au.raw_user_meta_data
FROM public.users u
JOIN auth.users au ON au.id = u.id
WHERE u.email = 'syukrie77@gmail.com';

-- ============================================================
-- Migration: Add Xendit payment columns
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add Xendit columns to payments table
ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS xendit_invoice_id  TEXT,
    ADD COLUMN IF NOT EXISTS xendit_invoice_url TEXT,
    ADD COLUMN IF NOT EXISTS module_id          UUID REFERENCES modules(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS payment_type       TEXT NOT NULL DEFAULT 'course' CHECK (payment_type IN ('course', 'module')),
    ADD COLUMN IF NOT EXISTS created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Update status column constraint to match new values
-- (existing 'completed' maps to new values; add 'pending', 'failed', 'expired')
ALTER TABLE payments
    DROP CONSTRAINT IF EXISTS payments_status_check;

ALTER TABLE payments
    ADD CONSTRAINT payments_status_check CHECK (status IN ('pending', 'completed', 'failed', 'expired'));

-- 2. Add price column to modules if it doesn't exist
ALTER TABLE modules
    ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0;

-- 3. Index for fast webhook lookup
CREATE INDEX IF NOT EXISTS idx_payments_xendit_invoice_id ON payments(xendit_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

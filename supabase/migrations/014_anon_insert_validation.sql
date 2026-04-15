-- ══════════════════════════════════════════════════════════════
-- Migration 014: Tighten anon INSERT policy on quiz_leads
--
-- Problem (ACHADO-04): anon_insert_quiz_leads used WITH CHECK(true),
-- allowing any anonymous caller to insert arbitrary rows — including
-- completely fake/empty leads — into the quiz_leads table, polluting
-- the CRM and wasting n8n/email automation credits.
--
-- Fix: replace the permissive policy with one that validates the
-- minimum required quality of inserted data at the database level.
-- Validation rules:
--   • nome      : 2–200 non-whitespace characters
--   • empresa   : 2–200 non-whitespace characters
--   • email     : basic RFC-5321 format check + max 254 chars
--   • whatsapp  : NULL or 8–20 chars (digits/+/spaces)
--   • score     : must be in [0, 100]
--   • tier      : must be one of A, B, C, D (enforced by column CHECK too,
--                 but defence-in-depth at policy level)
-- ══════════════════════════════════════════════════════════════

-- Drop the old permissive policy
DROP POLICY IF EXISTS "anon_insert_quiz_leads" ON public.quiz_leads;

-- Recreate with field-level validation
CREATE POLICY "anon_insert_quiz_leads" ON public.quiz_leads
  FOR INSERT TO anon
  WITH CHECK (
    -- Nome: 2–200 printable characters after trimming
    char_length(trim(nome))    BETWEEN 2 AND 200
    -- Empresa: same
    AND char_length(trim(empresa)) BETWEEN 2 AND 200
    -- Email: at least one char @ at least one char . at least two chars,
    -- no spaces, total <= 254 chars (RFC 5321 maximum)
    AND email ~ '^[^@\s]{1,64}@[^@\s]{1,253}\.[^@\s]{2,}$'
    AND char_length(email) <= 254
    -- Whatsapp: optional, but if present must look like a phone number
    AND (
      whatsapp IS NULL
      OR (char_length(whatsapp) BETWEEN 8 AND 20
          AND whatsapp ~ '^[\d\+\s\-\(\)]+$')
    )
    -- Score must be in the valid quiz range
    AND score BETWEEN 0 AND 100
    -- Tier must be a known value (defence-in-depth — column has CHECK too)
    AND tier IN ('A', 'B', 'C', 'D')
  );

-- ══════════════════════════════════════════════════════════════
-- Verification (run in Supabase SQL Editor after applying):
--
-- 1) Should succeed (valid lead):
--    INSERT INTO public.quiz_leads
--      (nome, empresa, email, score, tier)
--    VALUES ('João Silva', 'ACME', 'joao@acme.com.br', 75, 'B');
--
-- 2) Should fail — empty nome:
--    INSERT INTO public.quiz_leads
--      (nome, empresa, email, score, tier)
--    VALUES ('', 'ACME', 'x@x.com', 50, 'C');
--
-- 3) Should fail — invalid email:
--    INSERT INTO public.quiz_leads
--      (nome, empresa, email, score, tier)
--    VALUES ('Test', 'Co', 'notanemail', 50, 'C');
--
-- 4) Should fail — score out of range:
--    INSERT INTO public.quiz_leads
--      (nome, empresa, email, score, tier)
--    VALUES ('Test', 'Co', 'x@x.com', 999, 'C');
-- ══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- Migration 015: Audit trigger for quiz_leads INSERT / UPDATE
--
-- Purpose: record every public lead insertion (and any subsequent
-- update) in the existing audit_log table so that abuse patterns
-- (e.g. repeated submissions from the same IP, bot traffic that
-- slips past the honeypot, suspicious user-agents) can be
-- investigated without touching application code.
--
-- IP and User-Agent come from the HTTP headers that Supabase
-- injects into the Postgres session via the PostgREST request
-- context (current_setting('request.headers')).  The function
-- degrades gracefully when those settings are absent (e.g. during
-- direct psql / migration runs).
-- ══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- 1. Add ip and user_agent columns to audit_log if not present
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.audit_log
  ADD COLUMN IF NOT EXISTS ip         text,
  ADD COLUMN IF NOT EXISTS user_agent text;

-- ──────────────────────────────────────────────────────────────
-- 2. Trigger function
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_quiz_lead_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- runs as the function owner, not the caller
SET search_path = public  -- pin search_path against hijacking
AS $$
DECLARE
  v_headers  json;
  v_ip       text := 'unknown';
  v_ua       text := 'unknown';
BEGIN
  -- Extract HTTP request headers injected by Supabase / PostgREST.
  -- These are available during REST API calls; fall back silently during
  -- direct DB connections (migrations, psql, pg_dump, etc.).
  BEGIN
    v_headers := current_setting('request.headers', true)::json;
    IF v_headers IS NOT NULL THEN
      -- Prefer Cloudflare real-IP, then standard X-Forwarded-For
      v_ip := coalesce(
        nullif(v_headers->>'cf-connecting-ip', ''),
        nullif(v_headers->>'x-real-ip',        ''),
        -- X-Forwarded-For may be a comma-separated list; take the first value
        split_part(nullif(v_headers->>'x-forwarded-for', ''), ',', 1),
        'unknown'
      );
      v_ua := coalesce(nullif(v_headers->>'user-agent', ''), 'unknown');
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Silently ignore — request headers are not available in all contexts
    NULL;
  END;

  INSERT INTO public.audit_log (
    action,
    table_name,
    record_id,
    ip,
    user_agent,
    details
  ) VALUES (
    TG_OP,                   -- 'INSERT' or 'UPDATE'
    'quiz_leads',
    NEW.id::text,
    v_ip,
    v_ua,
    jsonb_build_object(
      'email',      NEW.email,
      'empresa',    NEW.empresa,
      'tier',       NEW.tier,
      'score',      NEW.score,
      'created_at', NEW.created_at
    )
  );

  RETURN NEW;
END;
$$;

-- ──────────────────────────────────────────────────────────────
-- 3. Attach trigger to quiz_leads
-- ──────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS audit_quiz_leads ON public.quiz_leads;

CREATE TRIGGER audit_quiz_leads
  AFTER INSERT OR UPDATE ON public.quiz_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.log_quiz_lead_audit();

-- ──────────────────────────────────────────────────────────────
-- 4. Verification queries (run in Supabase SQL Editor after applying)
-- ──────────────────────────────────────────────────────────────
-- Check trigger exists:
--   SELECT tgname, tgenabled FROM pg_trigger
--   WHERE tgrelid = 'quiz_leads'::regclass AND tgname = 'audit_quiz_leads';
--
-- Inspect recent audit entries:
--   SELECT action, ip, user_agent, details, created_at
--   FROM audit_log
--   WHERE table_name = 'quiz_leads'
--   ORDER BY created_at DESC
--   LIMIT 20;
--
-- Find suspicious IPs (>5 submissions in 1 hour):
--   SELECT ip, count(*) AS submissions,
--          min(created_at) AS first_seen, max(created_at) AS last_seen
--   FROM audit_log
--   WHERE table_name = 'quiz_leads'
--     AND action = 'INSERT'
--     AND created_at >= now() - interval '1 hour'
--   GROUP BY ip
--   HAVING count(*) > 5
--   ORDER BY submissions DESC;

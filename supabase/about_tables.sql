-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION: About/Profile Tables
-- Date: 2026-01-22
-- Description: Create tables for profile, socials, skills, and timeline
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: profile (singleton - one row only)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  bio TEXT[] NOT NULL DEFAULT '{}',
  bio_muted TEXT DEFAULT '',
  cta_text TEXT DEFAULT '',
  cta_href TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: socials
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS socials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  href TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: skills
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: timeline (experiences + education unified)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('experience', 'education')),
  -- For experience
  title TEXT,
  company TEXT,
  -- For education
  degree TEXT,
  school TEXT,
  -- Common fields
  period TEXT NOT NULL,
  description TEXT DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add constraint to ensure correct fields based on type (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'timeline_type_check'
  ) THEN
    ALTER TABLE timeline ADD CONSTRAINT timeline_type_check CHECK (
      (type = 'experience' AND title IS NOT NULL AND company IS NOT NULL) OR
      (type = 'education' AND degree IS NOT NULL AND school IS NOT NULL)
    );
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILE POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "profile_select_policy" ON profile;
DROP POLICY IF EXISTS "profile_update_policy" ON profile;
DROP POLICY IF EXISTS "profile_insert_policy" ON profile;

-- Anyone can read profile
CREATE POLICY "profile_select_policy" ON profile
  FOR SELECT
  USING (true);

-- Only authenticated users can update profile
CREATE POLICY "profile_update_policy" ON profile
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can insert profile (for initial seed)
CREATE POLICY "profile_insert_policy" ON profile
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- SOCIALS POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "socials_select_policy" ON socials;
DROP POLICY IF EXISTS "socials_insert_policy" ON socials;
DROP POLICY IF EXISTS "socials_update_policy" ON socials;
DROP POLICY IF EXISTS "socials_delete_policy" ON socials;

-- Anyone can read socials
CREATE POLICY "socials_select_policy" ON socials
  FOR SELECT
  USING (true);

-- Only authenticated users can modify socials
CREATE POLICY "socials_insert_policy" ON socials
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "socials_update_policy" ON socials
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "socials_delete_policy" ON socials
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- SKILLS POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "skills_select_policy" ON skills;
DROP POLICY IF EXISTS "skills_insert_policy" ON skills;
DROP POLICY IF EXISTS "skills_update_policy" ON skills;
DROP POLICY IF EXISTS "skills_delete_policy" ON skills;

-- Anyone can read skills
CREATE POLICY "skills_select_policy" ON skills
  FOR SELECT
  USING (true);

-- Only authenticated users can modify skills
CREATE POLICY "skills_insert_policy" ON skills
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "skills_update_policy" ON skills
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "skills_delete_policy" ON skills
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- TIMELINE POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "timeline_select_policy" ON timeline;
DROP POLICY IF EXISTS "timeline_insert_policy" ON timeline;
DROP POLICY IF EXISTS "timeline_update_policy" ON timeline;
DROP POLICY IF EXISTS "timeline_delete_policy" ON timeline;

-- Anyone can read timeline
CREATE POLICY "timeline_select_policy" ON timeline
  FOR SELECT
  USING (true);

-- Only authenticated users can modify timeline
CREATE POLICY "timeline_insert_policy" ON timeline
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "timeline_update_policy" ON timeline
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "timeline_delete_policy" ON timeline
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_socials_order ON socials ("order");
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills ("order");
CREATE INDEX IF NOT EXISTS idx_timeline_order ON timeline ("order");
CREATE INDEX IF NOT EXISTS idx_timeline_type ON timeline (type);

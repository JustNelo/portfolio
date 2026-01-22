-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION: i18n Support (French/English)
-- Date: 2026-01-22
-- Description: Add English translation columns to translatable tables
-- Strategy: FR = default columns, EN = _en suffix columns
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: profile - Add English translations
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE profile 
  ADD COLUMN IF NOT EXISTS bio_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS bio_muted_en TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_text_en TEXT DEFAULT '';

COMMENT ON COLUMN profile.bio_en IS 'English translation of bio paragraphs';
COMMENT ON COLUMN profile.bio_muted_en IS 'English translation of muted bio text';
COMMENT ON COLUMN profile.cta_text_en IS 'English translation of CTA button text';

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: projects - Add English translations
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS category_en TEXT,
  ADD COLUMN IF NOT EXISTS responsibilities_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS development_en TEXT;

COMMENT ON COLUMN projects.title_en IS 'English translation of project title';
COMMENT ON COLUMN projects.description_en IS 'English translation of project description';
COMMENT ON COLUMN projects.category_en IS 'English translation of category';
COMMENT ON COLUMN projects.responsibilities_en IS 'English translation of responsibilities';
COMMENT ON COLUMN projects.development_en IS 'English translation of development info';

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: project_medias - Add English translations
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE project_medias
  ADD COLUMN IF NOT EXISTS alt_en TEXT;

COMMENT ON COLUMN project_medias.alt_en IS 'English translation of alt text';

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: skills - Add English translations
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS category_en TEXT;

COMMENT ON COLUMN skills.category_en IS 'English translation of skill category';
-- Note: items are kept as-is (technical terms usually in English)

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: timeline - Add English translations
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE timeline
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS degree_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

COMMENT ON COLUMN timeline.title_en IS 'English translation of job title';
COMMENT ON COLUMN timeline.degree_en IS 'English translation of degree';
COMMENT ON COLUMN timeline.description_en IS 'English translation of description';
-- Note: company/school names are proper nouns, no translation needed

-- ═══════════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTION: Get localized value
-- Usage: SELECT get_localized(title, title_en, 'en') FROM projects;
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_localized(
  fr_value TEXT,
  en_value TEXT,
  locale TEXT DEFAULT 'fr'
) RETURNS TEXT AS $$
BEGIN
  IF locale = 'en' AND en_value IS NOT NULL AND en_value != '' THEN
    RETURN en_value;
  END IF;
  RETURN fr_value;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Array version
CREATE OR REPLACE FUNCTION get_localized_array(
  fr_value TEXT[],
  en_value TEXT[],
  locale TEXT DEFAULT 'fr'
) RETURNS TEXT[] AS $$
BEGIN
  IF locale = 'en' AND en_value IS NOT NULL AND array_length(en_value, 1) > 0 THEN
    RETURN en_value;
  END IF;
  RETURN fr_value;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

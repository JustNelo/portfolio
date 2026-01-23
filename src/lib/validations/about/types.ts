// ─────────────────────────────────────────────────────────────────────────────
// DATABASE TYPES (for Supabase responses)
// ─────────────────────────────────────────────────────────────────────────────
export interface ProfileRow {
  id: string
  first_name: string
  last_name: string
  bio: string[]
  bio_muted: string | null
  cta_text: string | null
  cta_href: string | null
  bio_en: string[] | null
  bio_muted_en: string | null
  cta_text_en: string | null
  created_at: string
  updated_at: string
}

export interface SocialRow {
  id: string
  name: string
  href: string
  order: number
  created_at: string
}

export interface SkillRow {
  id: string
  category: string
  items: string[]
  order: number
  category_en: string | null
  created_at: string
}

export interface TimelineRow {
  id: string
  type: 'experience' | 'education'
  title: string | null
  company: string | null
  degree: string | null
  school: string | null
  period: string
  description: string | null
  order: number
  title_en: string | null
  degree_en: string | null
  description_en: string | null
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEND TYPES (transformed from database)
// ─────────────────────────────────────────────────────────────────────────────
export interface Profile {
  id: string
  firstName: string
  lastName: string
  bio: string[]
  bioMuted: string
  ctaText: string
  ctaHref: string
  bioEn: string[]
  bioMutedEn: string
  ctaTextEn: string
}

export interface Social {
  id: string
  name: string
  href: string
  order: number
}

export interface Skill {
  id: string
  category: string
  items: string[]
  order: number
  categoryEn: string
}

export interface Experience {
  id: string
  type: 'experience'
  title: string
  company: string
  period: string
  description: string
  order: number
  titleEn: string
  descriptionEn: string
}

export interface Education {
  id: string
  type: 'education'
  degree: string
  school: string
  period: string
  description: string
  order: number
  degreeEn: string
  descriptionEn: string
}

export type TimelineItem = Experience | Education

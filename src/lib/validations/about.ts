import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────
export const profileSchema = z.object({
  first_name: z.string().min(1, 'Le prénom est requis').max(50),
  last_name: z.string().min(1, 'Le nom est requis').max(50),
  bio: z.array(z.string()).min(1, 'Au moins un paragraphe de bio est requis'),
  bio_muted: z.string().max(500).optional().default(''),
  cta_text: z.string().max(100).optional().default(''),
  cta_href: z.string().max(255).optional().default(''),
  // English translations
  bio_en: z.array(z.string()).optional().default([]),
  bio_muted_en: z.string().max(500).optional().default(''),
  cta_text_en: z.string().max(100).optional().default(''),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────
export const socialSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(50),
  href: z.string().min(1, 'Le lien est requis').max(255),
  order: z.number().int().min(0).optional().default(0),
})

export const updateSocialSchema = socialSchema.extend({
  id: z.string().uuid(),
})

export type SocialFormData = z.infer<typeof socialSchema>
export type UpdateSocialFormData = z.infer<typeof updateSocialSchema>

// ─────────────────────────────────────────────────────────────────────────────
// SKILL SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────
export const skillSchema = z.object({
  category: z.string().min(1, 'La catégorie est requise').max(50),
  items: z.array(z.string()).min(1, 'Au moins une compétence est requise'),
  order: z.number().int().min(0).optional().default(0),
  // English translations
  category_en: z.string().max(50).optional().default(''),
})

export const updateSkillSchema = skillSchema.extend({
  id: z.string().uuid(),
})

export type SkillFormData = z.infer<typeof skillSchema>
export type UpdateSkillFormData = z.infer<typeof updateSkillSchema>

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────
export const experienceSchema = z.object({
  type: z.literal('experience'),
  title: z.string().min(1, 'Le titre est requis').max(100),
  company: z.string().min(1, "L'entreprise est requise").max(100),
  period: z.string().min(1, 'La période est requise').max(50),
  description: z.string().max(1000).optional().default(''),
  order: z.number().int().min(0).optional().default(0),
  // English translations
  title_en: z.string().max(100).optional().default(''),
  description_en: z.string().max(1000).optional().default(''),
})

export const educationSchema = z.object({
  type: z.literal('education'),
  degree: z.string().min(1, 'Le diplôme est requis').max(100),
  school: z.string().min(1, "L'établissement est requis").max(100),
  period: z.string().min(1, 'La période est requise').max(50),
  description: z.string().max(1000).optional().default(''),
  order: z.number().int().min(0).optional().default(0),
  // English translations
  degree_en: z.string().max(100).optional().default(''),
  description_en: z.string().max(1000).optional().default(''),
})

export const timelineSchema = z.discriminatedUnion('type', [
  experienceSchema,
  educationSchema,
])

export const updateExperienceSchema = experienceSchema.extend({
  id: z.string().uuid(),
})

export const updateEducationSchema = educationSchema.extend({
  id: z.string().uuid(),
})

export const updateTimelineSchema = z.discriminatedUnion('type', [
  updateExperienceSchema,
  updateEducationSchema,
])

export type ExperienceFormData = z.infer<typeof experienceSchema>
export type EducationFormData = z.infer<typeof educationSchema>
export type TimelineFormData = z.infer<typeof timelineSchema>
export type UpdateTimelineFormData = z.infer<typeof updateTimelineSchema>

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
  // English translations
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
  // English translations
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
  // English translations
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
  // English translations
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
  // English translations
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
  // English translations
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
  // English translations
  degreeEn: string
  descriptionEn: string
}

export type TimelineItem = Experience | Education

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFORM FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
export function transformProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    bio: row.bio,
    bioMuted: row.bio_muted || '',
    ctaText: row.cta_text || '',
    ctaHref: row.cta_href || '',
    // English translations
    bioEn: row.bio_en || [],
    bioMutedEn: row.bio_muted_en || '',
    ctaTextEn: row.cta_text_en || '',
  }
}

export function transformSocial(row: SocialRow): Social {
  return {
    id: row.id,
    name: row.name,
    href: row.href,
    order: row.order,
  }
}

export function transformSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    category: row.category,
    items: row.items,
    order: row.order,
    // English translations
    categoryEn: row.category_en || '',
  }
}

export function transformTimeline(row: TimelineRow): TimelineItem {
  if (row.type === 'experience') {
    return {
      id: row.id,
      type: 'experience',
      title: row.title!,
      company: row.company!,
      period: row.period,
      description: row.description || '',
      order: row.order,
      // English translations
      titleEn: row.title_en || '',
      descriptionEn: row.description_en || '',
    }
  }
  return {
    id: row.id,
    type: 'education',
    degree: row.degree!,
    school: row.school!,
    period: row.period,
    description: row.description || '',
    order: row.order,
    // English translations
    degreeEn: row.degree_en || '',
    descriptionEn: row.description_en || '',
  }
}

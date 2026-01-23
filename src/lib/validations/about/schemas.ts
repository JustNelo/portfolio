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

import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100),
  slug: z.string().min(1, 'Le slug est requis').max(100).regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  description: z.string().min(1, 'La description est requise').max(2000),
  year: z.number().int().min(2000).max(2100),
  category: z.string().min(1, 'La catégorie est requise').max(50),
  agency: z.string().max(100).optional().nullable(),
  client: z.string().max(100).optional().nullable(),
  responsibilities: z.array(z.string()).optional().default([]),
  development: z.string().max(100).optional().nullable(),
  external_url: z.string().url().optional().nullable().or(z.literal('')),
  // English translations
  title_en: z.string().max(100).optional().default(''),
  description_en: z.string().max(2000).optional().default(''),
  category_en: z.string().max(50).optional().default(''),
  responsibilities_en: z.array(z.string()).optional().default([]),
  development_en: z.string().max(100).optional().default(''),
})

export const updateProjectSchema = projectSchema

export type ProjectFormData = z.infer<typeof projectSchema>

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Project types for Supabase integration
 */

export type MediaType = 'image' | 'video'

export interface ProjectMedia {
  id: string
  project_id: string
  url: string
  type: MediaType
  alt?: string
  duration?: number // seconds, for video
  order: number
  created_at?: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  year: number
  category: string
  // Metadata
  agency?: string
  client?: string
  responsibilities?: string[] // ['Creative Direction', 'UX Design', ...]
  development?: string
  external_url?: string
  // English translations
  title_en?: string
  description_en?: string
  category_en?: string
  responsibilities_en?: string[]
  development_en?: string
  // Timestamps
  created_at?: string
  // Relations (populated via join)
  medias?: ProjectMedia[]
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'medias'>
export type ProjectUpdate = Partial<ProjectInsert>

export type ProjectMediaInsert = Omit<ProjectMedia, 'id' | 'created_at'>
export type ProjectMediaUpdate = Partial<ProjectMediaInsert>

/**
 * Project with embedded medias - used for list/detail views
 * Matches Supabase response format with joined project_medias
 */
export interface ProjectWithMedias {
  id: string
  title: string
  slug: string
  description: string
  year: number
  category: string
  agency: string | null
  client: string | null
  responsibilities: string[]
  development: string | null
  external_url: string | null
  created_at: string
  // English translations
  title_en: string | null
  description_en: string | null
  category_en: string | null
  responsibilities_en: string[]
  development_en: string | null
  // Embedded medias from join
  project_medias: {
    id: string
    url: string
    type: MediaType
    order: number
  }[]
}

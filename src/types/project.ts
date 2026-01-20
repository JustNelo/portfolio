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
  // Timestamps
  created_at?: string
  // Relations (populated via join)
  medias?: ProjectMedia[]
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'medias'>
export type ProjectUpdate = Partial<ProjectInsert>

export type ProjectMediaInsert = Omit<ProjectMedia, 'id' | 'created_at'>
export type ProjectMediaUpdate = Partial<ProjectMediaInsert>

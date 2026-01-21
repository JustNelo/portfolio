import { createClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { Project, ProjectMedia, ProjectInsert, ProjectMediaInsert } from '@/types'

/**
 * Project with populated medias relation
 */
export interface ProjectWithMedias extends Project {
  medias: ProjectMedia[]
}

/**
 * Service response type for consistent error handling
 */
export interface ServiceResponse<T> {
  data: T | null
  error: string | null
}

// =============================================================================
// SERVER-SIDE FUNCTIONS (for Server Components)
// =============================================================================

/**
 * Get all projects ordered by year (descending)
 * Use in Server Components only
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data || []
}

/**
 * Get a single project by slug with its medias
 * Use in Server Components only
 */
export async function getProjectBySlug(slug: string): Promise<ProjectWithMedias | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      medias:project_medias(*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching project:', error)
    return null
  }

  return data as ProjectWithMedias
}

/**
 * Get a single project by ID
 * Use in Server Components only
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching project by id:', error)
    return null
  }

  return data
}

// =============================================================================
// CLIENT-SIDE FUNCTIONS (for Client Components / API Routes)
// =============================================================================

/**
 * Get all projects (client-side)
 */
export async function getProjectsClient(): Promise<Project[]> {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data || []
}

// =============================================================================
// MUTATION FUNCTIONS (for API Routes)
// =============================================================================

/**
 * Create a new project
 * Returns the created project with its ID
 */
export async function createProject(
  projectData: ProjectInsert
): Promise<ServiceResponse<Project>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create media entries for a project
 */
export async function createProjectMedias(
  medias: ProjectMediaInsert[]
): Promise<ServiceResponse<ProjectMedia[]>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('project_medias')
    .insert(medias)
    .select()

  if (error) {
    console.error('Error creating project medias:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Upload a file to the projects storage bucket
 * Returns the public URL of the uploaded file
 */
export async function uploadProjectMedia(
  slug: string,
  file: { name: string; type: string; arrayBuffer: ArrayBuffer },
  index: number
): Promise<ServiceResponse<{ url: string; type: 'image' | 'video' }>> {
  const supabase = await createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${index}.${fileExt}`
  const filePath = `${slug}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('projects')
    .upload(filePath, file.arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { data: null, error: uploadError.message }
  }

  const { data: urlData } = supabase.storage
    .from('projects')
    .getPublicUrl(filePath)

  const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'

  return {
    data: { url: urlData.publicUrl, type: mediaType },
    error: null,
  }
}

/**
 * Delete a project and its associated medias
 */
export async function deleteProject(id: string): Promise<ServiceResponse<null>> {
  const supabase = await createClient()
  
  // Delete medias first (foreign key constraint)
  const { error: mediasError } = await supabase
    .from('project_medias')
    .delete()
    .eq('project_id', id)

  if (mediasError) {
    console.error('Error deleting project medias:', mediasError)
    return { data: null, error: mediasError.message }
  }

  // Delete project
  const { error: projectError } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (projectError) {
    console.error('Error deleting project:', projectError)
    return { data: null, error: projectError.message }
  }

  return { data: null, error: null }
}

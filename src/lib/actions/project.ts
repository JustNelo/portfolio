'use server'

import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { projectSchema, updateProjectSchema, isValidMediaType, MAX_FILE_SIZE } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'
import { withAuth, type ActionResponse } from './withAuth'
import { validateFormData } from '@/lib/validations/utils'
import type { ProjectWithMedias } from '@/types'

export interface ProjectActionResponse extends ActionResponse {
  slug?: string
}

export async function createProject(formData: FormData): Promise<ProjectActionResponse> {
  return withAuth(async (supabase) => {
    // Extract form fields
    const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    year: parseInt(formData.get('year') as string, 10),
    category: formData.get('category') as string,
    agency: (formData.get('agency') as string) || null,
    client: (formData.get('client') as string) || null,
    responsibilities: JSON.parse((formData.get('responsibilities') as string) || '[]'),
    development: (formData.get('development') as string) || null,
    external_url: (formData.get('external_url') as string) || null,
    title_en: (formData.get('title_en') as string) || '',
    description_en: (formData.get('description_en') as string) || '',
    category_en: (formData.get('category_en') as string) || '',
    responsibilities_en: JSON.parse((formData.get('responsibilities_en') as string) || '[]'),
    development_en: (formData.get('development_en') as string) || '',
  }

    const validation = await validateFormData(projectSchema, rawData)
  if (!validation.success) return validation

  const validatedData = validation.data

    const mediaFiles = formData.getAll('medias') as File[]

    const uploadedMedias: { url: string; type: 'image' | 'video'; order: number }[] = []

  for (let i = 0; i < mediaFiles.length; i++) {
    const file = mediaFiles[i]
    if (!file || file.size === 0) continue

        if (!isValidMediaType(file.type)) {
      return { success: false, message: `Invalid file type: ${file.type}` }
    }
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, message: `File too large: ${file.name} (max 10MB)` }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${i}.${fileExt}`
    const filePath = `${validatedData.slug}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, message: `Upload error ${file.name}: ${uploadError.message}` }
    }

    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'

    uploadedMedias.push({
      url: urlData.publicUrl,
      type: mediaType,
      order: i,
    })
  }

    const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      title: validatedData.title,
      slug: validatedData.slug,
      description: validatedData.description,
      year: validatedData.year,
      category: validatedData.category,
      agency: validatedData.agency || null,
      client: validatedData.client || null,
      responsibilities: validatedData.responsibilities || [],
      development: validatedData.development || null,
      external_url: validatedData.external_url || null,
      // English translations
      title_en: validatedData.title_en || null,
      description_en: validatedData.description_en || null,
      category_en: validatedData.category_en || null,
      responsibilities_en: validatedData.responsibilities_en || [],
      development_en: validatedData.development_en || null,
    })
    .select('id')
    .single()

  if (projectError) {
    console.error('Project insert error:', projectError)
    return { success: false, message: `Project creation error: ${projectError.message}` }
  }

    if (uploadedMedias.length > 0) {
    const { error: mediaError } = await supabase
      .from('project_medias')
      .insert(uploadedMedias.map((media) => ({
        project_id: project.id,
        url: media.url,
        type: media.type,
        order: media.order,
      })))

    if (mediaError) {
      console.error('Media insert error:', mediaError)
      return { success: false, message: `Media insertion error: ${mediaError.message}` }
    }
  }

    revalidatePath('/projects')
    revalidatePath(`/projects/${validatedData.slug}`)

    return { success: true, message: 'Project created successfully!', slug: validatedData.slug }
  })
}

export async function deleteProject(id: string): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
      const { data: project, error: projectFetchError } = await supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .single()

  if (projectFetchError || !project) {
    return { success: false, message: 'Project not found.' }
  }

    const { data: files, error: listError } = await supabase.storage
    .from('projects')
    .list(project.slug)

  if (listError) {
    console.error('Error listing files:', listError)
  }

    if (files && files.length > 0) {
    const filePaths = files.map((file) => `${project.slug}/${file.name}`)
    const { error: deleteFilesError } = await supabase.storage
      .from('projects')
      .remove(filePaths)

    if (deleteFilesError) {
      console.error('Error deleting files:', deleteFilesError)
    }
  }

    const { error: mediasError } = await supabase
    .from('project_medias')
    .delete()
    .eq('project_id', id)

  if (mediasError) {
    return { success: false, message: mediasError.message }
  }

    const { error: projectError } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (projectError) {
    return { success: false, message: projectError.message }
  }

    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return { success: true, message: 'Project and files deleted.' }
  })
}

export async function updateProject(id: string, formData: FormData): Promise<ProjectActionResponse> {
  return withAuth(async (supabase) => {
      const { data: existingProject, error: fetchError } = await supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .single()

  if (fetchError || !existingProject) {
    return { success: false, message: 'Project not found.' }
  }

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    year: parseInt(formData.get('year') as string, 10),
    category: formData.get('category') as string,
    agency: (formData.get('agency') as string) || null,
    client: (formData.get('client') as string) || null,
    responsibilities: JSON.parse((formData.get('responsibilities') as string) || '[]'),
    development: (formData.get('development') as string) || null,
    external_url: (formData.get('external_url') as string) || null,
    title_en: (formData.get('title_en') as string) || '',
    description_en: (formData.get('description_en') as string) || '',
    category_en: (formData.get('category_en') as string) || '',
    responsibilities_en: JSON.parse((formData.get('responsibilities_en') as string) || '[]'),
    development_en: (formData.get('development_en') as string) || '',
  }

    const validation = await validateFormData(updateProjectSchema, rawData)
  if (!validation.success) return validation

  const validatedData = validation.data

    const existingMediasOrder = JSON.parse(
    (formData.get('existing_medias_order') as string) || '[]'
  ) as { id: string; order: number }[]
  
    const newMediasOrder = JSON.parse(
    (formData.get('new_medias_order') as string) || '[]'
  ) as number[]

    const newMediaFiles = formData.getAll('new_medias') as File[]
  
    const keepMediaIds = existingMediasOrder.map((m) => m.id)

    const { data: currentMedias } = await supabase
    .from('project_medias')
    .select('id, url')
    .eq('project_id', id)

    if (currentMedias) {
    const mediasToDelete = currentMedias.filter((m) => !keepMediaIds.includes(m.id))

    for (const media of mediasToDelete) {
            const urlParts = media.url.split('/projects/')
      if (urlParts[1]) {
        const filePath = urlParts[1]
        await supabase.storage.from('projects').remove([filePath])
      }

            await supabase.from('project_medias').delete().eq('id', media.id)
    }
  }

    for (const mediaOrder of existingMediasOrder) {
    await supabase
      .from('project_medias')
      .update({ order: mediaOrder.order })
      .eq('id', mediaOrder.id)
  }

    const uploadedMedias: { url: string; type: 'image' | 'video'; order: number }[] = []

  for (let i = 0; i < newMediaFiles.length; i++) {
    const file = newMediaFiles[i]
    if (!file || file.size === 0) continue

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${i}.${fileExt}`
    const filePath = `${validatedData.slug}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, message: `Upload error ${file.name}: ${uploadError.message}` }
    }

    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'
    
        const order = newMediasOrder[i] ?? (existingMediasOrder.length + i)

    uploadedMedias.push({
      url: urlData.publicUrl,
      type: mediaType,
      order,
    })
  }

    const { error: projectError } = await supabase
    .from('projects')
    .update({
      title: validatedData.title,
      slug: validatedData.slug,
      description: validatedData.description,
      year: validatedData.year,
      category: validatedData.category,
      agency: validatedData.agency || null,
      client: validatedData.client || null,
      responsibilities: validatedData.responsibilities || [],
      development: validatedData.development || null,
      external_url: validatedData.external_url || null,
      // English translations
      title_en: validatedData.title_en || null,
      description_en: validatedData.description_en || null,
      category_en: validatedData.category_en || null,
      responsibilities_en: validatedData.responsibilities_en || [],
      development_en: validatedData.development_en || null,
    })
    .eq('id', id)

  if (projectError) {
    console.error('Project update error:', projectError)
    return { success: false, message: `Project update error: ${projectError.message}` }
  }

    if (uploadedMedias.length > 0) {
    const { error: mediaError } = await supabase
      .from('project_medias')
      .insert(uploadedMedias.map((media) => ({
        project_id: id,
        url: media.url,
        type: media.type,
        order: media.order,
      })))

    if (mediaError) {
      console.error('Media insert error:', mediaError)
      return { success: false, message: `Media insertion error: ${mediaError.message}` }
    }
  }

    revalidatePath('/projects')
    revalidatePath(`/projects/${validatedData.slug}`)
    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${id}`)

    return { success: true, message: 'Project updated successfully!', slug: validatedData.slug }
  })
}

export interface ProjectListItem {
  id: string
  slug: string
  title: string
  title_en: string | null
  category: string
  category_en: string | null
  year: number
}

const getCachedProjects = unstable_cache(
  async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('projects')
      .select('id, slug, title, title_en, category, category_en, year')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }
    return data as ProjectListItem[]
  },
  ['projects-list'],
  { revalidate: 3600, tags: ['projects'] }
)

export async function getProjects(): Promise<ProjectListItem[]> {
  return getCachedProjects()
}

export async function getProjectsFull(): Promise<ProjectWithMedias[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_medias (
        id,
        url,
        type,
        order
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data as ProjectWithMedias[]
}

export async function getProjectById(id: string): Promise<ProjectWithMedias | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_medias (
        id,
        url,
        type,
        order
      )
    `)
    .eq('id', id)
    .order('order', { referencedTable: 'project_medias', ascending: true })
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data as ProjectWithMedias
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithMedias | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_medias (
        id,
        url,
        type,
        order
      )
    `)
    .eq('slug', slug)
    .order('order', { referencedTable: 'project_medias', ascending: true })
    .single()

  if (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }

  return data as ProjectWithMedias
}

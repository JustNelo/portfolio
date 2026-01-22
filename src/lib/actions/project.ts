'use server'

import { createClient } from '@/lib/supabase/server'
import { projectSchema, updateProjectSchema } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'

export interface ActionResponse {
  success: boolean
  message: string
  slug?: string
}

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
  project_medias: {
    id: string
    url: string
    type: 'image' | 'video'
    order: number
  }[]
}

export async function createProject(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Non autorisé. Veuillez vous connecter.' }
  }

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
    // English translations
    title_en: (formData.get('title_en') as string) || '',
    description_en: (formData.get('description_en') as string) || '',
    category_en: (formData.get('category_en') as string) || '',
    responsibilities_en: JSON.parse((formData.get('responsibilities_en') as string) || '[]'),
    development_en: (formData.get('development_en') as string) || '',
  }

  // Validate form data with Zod
  const validationResult = projectSchema.safeParse(rawData)
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((e) => e.message).join(', ')
    return { success: false, message: `Validation échouée: ${errors}` }
  }

  const validatedData = validationResult.data

  // Get media files
  const mediaFiles = formData.getAll('medias') as File[]

  // Step A: Upload media files to storage
  const uploadedMedias: { url: string; type: 'image' | 'video'; order: number }[] = []

  for (let i = 0; i < mediaFiles.length; i++) {
    const file = mediaFiles[i]
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
      return { success: false, message: `Erreur upload fichier ${file.name}: ${uploadError.message}` }
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

  // Step B: Insert project into database
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
    return { success: false, message: `Erreur création projet: ${projectError.message}` }
  }

  // Step C: Insert media entries
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
      return { success: false, message: `Erreur insertion médias: ${mediaError.message}` }
    }
  }

  revalidatePath('/projects')
  revalidatePath(`/projects/${validatedData.slug}`)

  return { success: true, message: 'Projet créé avec succès!', slug: validatedData.slug }
}

export async function deleteProject(id: string): Promise<ActionResponse> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Non autorisé.' }
  }

  // Step 1: Get project info to find the slug (folder name in storage)
  const { data: project, error: projectFetchError } = await supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .single()

  if (projectFetchError || !project) {
    return { success: false, message: 'Projet introuvable.' }
  }

  // Step 2: List all files in the project folder in storage
  const { data: files, error: listError } = await supabase.storage
    .from('projects')
    .list(project.slug)

  if (listError) {
    console.error('Error listing files:', listError)
  }

  // Step 3: Delete all files from storage (cleanup)
  if (files && files.length > 0) {
    const filePaths = files.map((file) => `${project.slug}/${file.name}`)
    const { error: deleteFilesError } = await supabase.storage
      .from('projects')
      .remove(filePaths)

    if (deleteFilesError) {
      console.error('Error deleting files:', deleteFilesError)
    }
  }

  // Step 4: Delete medias from database (foreign key constraint)
  const { error: mediasError } = await supabase
    .from('project_medias')
    .delete()
    .eq('project_id', id)

  if (mediasError) {
    return { success: false, message: mediasError.message }
  }

  // Step 5: Delete project from database
  const { error: projectError } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (projectError) {
    return { success: false, message: projectError.message }
  }

  revalidatePath('/projects')
  revalidatePath('/admin/projects')

  return { success: true, message: 'Projet et fichiers supprimés.' }
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Non autorisé. Veuillez vous connecter.' }
  }

  // Get existing project
  const { data: existingProject, error: fetchError } = await supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .single()

  if (fetchError || !existingProject) {
    return { success: false, message: 'Projet introuvable.' }
  }

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
    // English translations
    title_en: (formData.get('title_en') as string) || '',
    description_en: (formData.get('description_en') as string) || '',
    category_en: (formData.get('category_en') as string) || '',
    responsibilities_en: JSON.parse((formData.get('responsibilities_en') as string) || '[]'),
    development_en: (formData.get('development_en') as string) || '',
  }

  // Validate form data with Zod
  const validationResult = updateProjectSchema.safeParse(rawData)
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((e) => e.message).join(', ')
    return { success: false, message: `Validation échouée: ${errors}` }
  }

  const validatedData = validationResult.data

  // Get existing medias with their new order
  const existingMediasOrder = JSON.parse(
    (formData.get('existing_medias_order') as string) || '[]'
  ) as { id: string; order: number }[]
  
  // Get new media order positions
  const newMediasOrder = JSON.parse(
    (formData.get('new_medias_order') as string) || '[]'
  ) as number[]

  // Get new media files
  const newMediaFiles = formData.getAll('new_medias') as File[]
  
  // Extract IDs of medias to keep
  const keepMediaIds = existingMediasOrder.map((m) => m.id)

  // Step 1: Get current medias
  const { data: currentMedias } = await supabase
    .from('project_medias')
    .select('id, url')
    .eq('project_id', id)

  // Step 2: Delete removed medias from storage and database
  if (currentMedias) {
    const mediasToDelete = currentMedias.filter((m) => !keepMediaIds.includes(m.id))

    for (const media of mediasToDelete) {
      // Extract file path from URL
      const urlParts = media.url.split('/projects/')
      if (urlParts[1]) {
        const filePath = urlParts[1]
        await supabase.storage.from('projects').remove([filePath])
      }

      // Delete from database
      await supabase.from('project_medias').delete().eq('id', media.id)
    }
  }

  // Step 3: Update order of existing medias
  for (const mediaOrder of existingMediasOrder) {
    await supabase
      .from('project_medias')
      .update({ order: mediaOrder.order })
      .eq('id', mediaOrder.id)
  }

  // Step 4: Upload new media files with correct order
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
      return { success: false, message: `Erreur upload fichier ${file.name}: ${uploadError.message}` }
    }

    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'
    
    // Use the order from newMediasOrder array
    const order = newMediasOrder[i] ?? (existingMediasOrder.length + i)

    uploadedMedias.push({
      url: urlData.publicUrl,
      type: mediaType,
      order,
    })
  }

  // Step 5: Update project in database
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
    return { success: false, message: `Erreur mise à jour projet: ${projectError.message}` }
  }

  // Step 6: Insert new media entries
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
      return { success: false, message: `Erreur insertion médias: ${mediaError.message}` }
    }
  }

  revalidatePath('/projects')
  revalidatePath(`/projects/${validatedData.slug}`)
  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)

  return { success: true, message: 'Projet mis à jour avec succès!', slug: validatedData.slug }
}

export async function getProjects(): Promise<ProjectWithMedias[]> {
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
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data as ProjectWithMedias
}

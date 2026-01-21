'use server'

import { createClient } from '@/lib/supabase/server'
import { projectSchema } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'

export interface ActionResponse {
  success: boolean
  message: string
  slug?: string
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

  // Delete medias first (foreign key constraint)
  const { error: mediasError } = await supabase
    .from('project_medias')
    .delete()
    .eq('project_id', id)

  if (mediasError) {
    return { success: false, message: mediasError.message }
  }

  // Delete project
  const { error: projectError } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (projectError) {
    return { success: false, message: projectError.message }
  }

  revalidatePath('/projects')

  return { success: true, message: 'Projet supprimé.' }
}

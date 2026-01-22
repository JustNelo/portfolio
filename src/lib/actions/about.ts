'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateGroup } from './helpers'
import { withAuth, type ActionResponse } from './withAuth'

import {
  profileSchema,
  socialSchema,
  updateSocialSchema,
  skillSchema,
  updateSkillSchema,
  timelineSchema,
  updateTimelineSchema,
  transformProfile,
  transformSocial,
  transformSkill,
  transformTimeline,
  type Profile,
  type Social,
  type Skill,
  type TimelineItem,
  type ProfileRow,
  type SocialRow,
  type SkillRow,
  type TimelineRow,
} from '@/lib/validations/about'

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  if (!data) {
    return null
  }

  return transformProfile(data as ProfileRow)
}

export async function updateProfile(formData: FormData): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const rawData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      bio: JSON.parse((formData.get('bio') as string) || '[]'),
      bio_muted: (formData.get('bio_muted') as string) || '',
      cta_text: (formData.get('cta_text') as string) || '',
      cta_href: (formData.get('cta_href') as string) || '',
      bio_en: JSON.parse((formData.get('bio_en') as string) || '[]'),
      bio_muted_en: (formData.get('bio_muted_en') as string) || '',
      cta_text_en: (formData.get('cta_text_en') as string) || '',
    }

    const validationResult = profileSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(', ')
      return { success: false, message: `Validation échouée: ${errors}` }
    }

    const validatedData = validationResult.data

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profile')
      .select('id')
      .limit(1)
      .single()

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('profile')
        .update({
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          bio: validatedData.bio,
          bio_muted: validatedData.bio_muted,
          cta_text: validatedData.cta_text,
          cta_href: validatedData.cta_href,
          bio_en: validatedData.bio_en,
          bio_muted_en: validatedData.bio_muted_en,
          cta_text_en: validatedData.cta_text_en,
        })
        .eq('id', existingProfile.id)

      if (error) {
        console.error('Profile update error:', error)
        return { success: false, message: `Erreur: ${error.message}` }
      }
    } else {
      // Create new profile
      const { error } = await supabase.from('profile').insert({
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        bio: validatedData.bio,
        bio_muted: validatedData.bio_muted,
        cta_text: validatedData.cta_text,
        cta_href: validatedData.cta_href,
        bio_en: validatedData.bio_en,
        bio_muted_en: validatedData.bio_muted_en,
        cta_text_en: validatedData.cta_text_en,
      })

      if (error) {
        console.error('Profile insert error:', error)
        return { success: false, message: `Erreur: ${error.message}` }
      }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Profil mis à jour avec succès!' }
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOCIAL ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getSocials(): Promise<Social[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('socials')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching socials:', error)
    return []
  }

  return (data as SocialRow[]).map(transformSocial)
}

export async function addSocial(formData: FormData): Promise<ActionResponse<Social>> {
  return withAuth(async (supabase) => {
    const rawData = {
      name: formData.get('name') as string,
      href: formData.get('href') as string,
      order: parseInt(formData.get('order') as string, 10) || 0,
    }

    const validationResult = socialSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(', ')
      return { success: false, message: `Validation échouée: ${errors}` }
    }

    const { data, error } = await supabase.from('socials').insert(validationResult.data).select().single()

    if (error) {
      console.error('Social insert error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Lien social ajouté!', data: transformSocial(data as SocialRow) }
  })
}

export async function updateSocial(formData: FormData): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const rawData = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      href: formData.get('href') as string,
      order: parseInt(formData.get('order') as string, 10) || 0,
    }

    const validationResult = updateSocialSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(', ')
      return { success: false, message: `Validation échouée: ${errors}` }
    }

    const { id, ...updateData } = validationResult.data

    const { error } = await supabase
      .from('socials')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Social update error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Lien social mis à jour!' }
  })
}

export async function deleteSocial(id: string): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const { error } = await supabase.from('socials').delete().eq('id', id)

    if (error) {
      console.error('Social delete error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Lien social supprimé!' }
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKILL ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching skills:', error)
    return []
  }

  return (data as SkillRow[]).map(transformSkill)
}

export async function addSkill(formData: FormData): Promise<ActionResponse<Skill>> {
  return withAuth(async (supabase) => {
    const rawData = {
      category: formData.get('category') as string,
      items: JSON.parse((formData.get('items') as string) || '[]'),
      order: parseInt(formData.get('order') as string, 10) || 0,
      category_en: (formData.get('category_en') as string) || '',
    }

    const validationResult = skillSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(', ')
      return { success: false, message: `Validation échouée: ${errors}` }
    }

    const { data, error } = await supabase.from('skills').insert(validationResult.data).select().single()

    if (error) {
      console.error('Skill insert error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Compétence ajoutée!', data: transformSkill(data as SkillRow) }
  })
}

export async function updateSkill(formData: FormData): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const rawData = {
      id: formData.get('id') as string,
      category: formData.get('category') as string,
      items: JSON.parse((formData.get('items') as string) || '[]'),
      order: parseInt(formData.get('order') as string, 10) || 0,
      category_en: (formData.get('category_en') as string) || '',
    }

    const validationResult = updateSkillSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(', ')
      return { success: false, message: `Validation échouée: ${errors}` }
    }

    const { id, ...updateData } = validationResult.data

    const { error } = await supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Skill update error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Compétence mise à jour!' }
  })
}

export async function deleteSkill(id: string): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)

    if (error) {
      console.error('Skill delete error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Compétence supprimée!' }
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getTimeline(): Promise<TimelineItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching timeline:', error)
    return []
  }

  return (data as TimelineRow[]).map(transformTimeline)
}

export async function getExperiences(): Promise<TimelineItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .eq('type', 'experience')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching experiences:', error)
    return []
  }

  return (data as TimelineRow[]).map(transformTimeline)
}

export async function getEducation(): Promise<TimelineItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .eq('type', 'education')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching education:', error)
    return []
  }

  return (data as TimelineRow[]).map(transformTimeline)
}

export async function addTimelineItem(formData: FormData): Promise<ActionResponse<TimelineItem>> {
  return withAuth(async (supabase) => {
    const type = formData.get('type') as 'experience' | 'education'

    const rawData = type === 'experience'
      ? {
          type: 'experience' as const,
          title: formData.get('title') as string,
          company: formData.get('company') as string,
          period: formData.get('period') as string,
          description: (formData.get('description') as string) || '',
          order: parseInt(formData.get('order') as string, 10) || 0,
          title_en: (formData.get('title_en') as string) || '',
          description_en: (formData.get('description_en') as string) || '',
        }
      : {
          type: 'education' as const,
          degree: formData.get('degree') as string,
          school: formData.get('school') as string,
          period: formData.get('period') as string,
          description: (formData.get('description') as string) || '',
          order: parseInt(formData.get('order') as string, 10) || 0,
          degree_en: (formData.get('degree_en') as string) || '',
          description_en: (formData.get('description_en') as string) || '',
        }

    const validationResult = timelineSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(', ')
      return { success: false, message: `Validation échouée: ${errors}` }
    }

    const { data, error } = await supabase.from('timeline').insert(validationResult.data).select().single()

    if (error) {
      console.error('Timeline insert error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Élément ajouté au parcours!', data: transformTimeline(data as TimelineRow) }
  })
}

export async function updateTimelineItem(formData: FormData): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const type = formData.get('type') as 'experience' | 'education'
    const id = formData.get('id') as string

    const rawData = type === 'experience'
      ? {
          id,
          type: 'experience' as const,
          title: formData.get('title') as string,
          company: formData.get('company') as string,
          period: formData.get('period') as string,
          description: (formData.get('description') as string) || '',
          order: parseInt(formData.get('order') as string, 10) || 0,
          title_en: (formData.get('title_en') as string) || '',
          description_en: (formData.get('description_en') as string) || '',
        }
      : {
          id,
          type: 'education' as const,
          degree: formData.get('degree') as string,
          school: formData.get('school') as string,
          period: formData.get('period') as string,
          description: (formData.get('description') as string) || '',
          order: parseInt(formData.get('order') as string, 10) || 0,
          degree_en: (formData.get('degree_en') as string) || '',
          description_en: (formData.get('description_en') as string) || '',
        }

    const validationResult = updateTimelineSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(', ')
      return { success: false, message: `Validation échouée: ${errors}` }
    }

    const { id: itemId, ...updateData } = validationResult.data

    const { error } = await supabase
      .from('timeline')
      .update(updateData)
      .eq('id', itemId)

    if (error) {
      console.error('Timeline update error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Élément mis à jour!' }
  })
}

export async function deleteTimelineItem(id: string): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const { error } = await supabase.from('timeline').delete().eq('id', id)

    if (error) {
      console.error('Timeline delete error:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Élément supprimé du parcours!' }
  })
}
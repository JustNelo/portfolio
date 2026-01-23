'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateGroup } from './helpers'
import { validateFormData } from '@/lib/validations/utils'
import { withAuth, type ActionResponse } from './withAuth'
import {
  skillSchema,
  updateSkillSchema,
  transformSkill,
  type Skill,
  type SkillRow,
} from '@/lib/validations/about'

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

    const validation = validateFormData(skillSchema, rawData)
    if (!validation.success) return validation

    const { data, error } = await supabase.from('skills').insert(validation.data).select().single()

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

    const validation = validateFormData(updateSkillSchema, rawData)
    if (!validation.success) return validation

    const { id, ...updateData } = validation.data

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

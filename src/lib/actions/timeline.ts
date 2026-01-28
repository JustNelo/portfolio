'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateGroup } from './helpers'
import { validateFormData } from '@/lib/validations/utils'
import { withAuth, type ActionResponse } from './withAuth'
import {
  timelineSchema,
  updateTimelineSchema,
  transformTimeline,
  type TimelineItem,
  type TimelineRow,
} from '@/lib/validations/about'

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

    const validation = validateFormData(timelineSchema, rawData)
    if (!validation.success) return validation

    const { data, error } = await supabase.from('timeline').insert(validation.data).select().single()

    if (error) {
      console.error('Timeline insert error:', error)
      return { success: false, message: `Error: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Timeline item added!', data: transformTimeline(data as TimelineRow) }
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

    const validation = validateFormData(updateTimelineSchema, rawData)
    if (!validation.success) return validation

    const { id: itemId, ...updateData } = validation.data

    const { error } = await supabase
      .from('timeline')
      .update(updateData)
      .eq('id', itemId)

    if (error) {
      console.error('Timeline update error:', error)
      return { success: false, message: `Error: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Timeline item updated!' }
  })
}

export async function deleteTimelineItem(id: string): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const { error } = await supabase.from('timeline').delete().eq('id', id)

    if (error) {
      console.error('Timeline delete error:', error)
      return { success: false, message: `Error: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Timeline item deleted!' }
  })
}

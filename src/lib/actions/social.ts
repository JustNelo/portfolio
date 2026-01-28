'use server'

import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { revalidateGroup } from './helpers'
import { validateFormData } from '@/lib/validations/utils'
import { withAuth, type ActionResponse } from './withAuth'
import {
  socialSchema,
  updateSocialSchema,
  transformSocial,
  type Social,
  type SocialRow,
} from '@/lib/validations/about'

const getCachedSocials = unstable_cache(
  async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('socials')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching socials:', error)
      return []
    }
    return (data as SocialRow[]).map(transformSocial)
  },
  ['socials'],
  { revalidate: 3600, tags: ['about'] }
)

export async function getSocials(): Promise<Social[]> {
  return getCachedSocials()
}

export async function addSocial(formData: FormData): Promise<ActionResponse<Social>> {
  return withAuth(async (supabase) => {
    const rawData = {
      name: formData.get('name') as string,
      href: formData.get('href') as string,
      order: parseInt(formData.get('order') as string, 10) || 0,
    }

    const validation = validateFormData(socialSchema, rawData)
    if (!validation.success) return validation

    const { data, error } = await supabase.from('socials').insert(validation.data).select().single()

    if (error) {
      console.error('Social insert error:', error)
      return { success: false, message: `Error: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Social link added!', data: transformSocial(data as SocialRow) }
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

    const validation = validateFormData(updateSocialSchema, rawData)
    if (!validation.success) return validation

    const { id, ...updateData } = validation.data

    const { error } = await supabase
      .from('socials')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Social update error:', error)
      return { success: false, message: `Error: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Social link updated!' }
  })
}

export async function deleteSocial(id: string): Promise<ActionResponse> {
  return withAuth(async (supabase) => {
    const { error } = await supabase.from('socials').delete().eq('id', id)

    if (error) {
      console.error('Social delete error:', error)
      return { success: false, message: `Error: ${error.message}` }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Social link deleted!' }
  })
}

'use server'

import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { revalidateGroup } from './helpers'
import { validateFormData } from '@/lib/validations/utils'
import { withAuth, type ActionResponse } from './withAuth'
import {
  profileSchema,
  transformProfile,
  type Profile,
  type ProfileRow,
} from '@/lib/validations/about'

const getCachedProfile = unstable_cache(
  async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data ? transformProfile(data as ProfileRow) : null
  },
  ['profile'],
  { revalidate: 3600, tags: ['about'] }
)

export async function getProfile(): Promise<Profile | null> {
  return getCachedProfile()
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

    const validation = validateFormData(profileSchema, rawData)
    if (!validation.success) return validation

    const validatedData = validation.data

    const { data: existingProfile } = await supabase
      .from('profile')
      .select('id')
      .limit(1)
      .single()

    if (existingProfile) {
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
        return { success: false, message: `Error: ${error.message}` }
      }
    } else {
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
        return { success: false, message: `Error: ${error.message}` }
      }
    }

    await revalidateGroup('about')

    return { success: true, message: 'Profile updated successfully!' }
  })
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { ZodSchema } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// ACTION RESPONSE TYPE
// ─────────────────────────────────────────────────────────────────────────────
export interface ActionResponse<T = undefined> {
  success: boolean
  message: string
  data?: T
}

// ─────────────────────────────────────────────────────────────────────────────
// REVALIDATION PATHS
// ─────────────────────────────────────────────────────────────────────────────
const REVALIDATION_PATHS = {
  about: ['/', '/about', '/admin/settings'],
  projects: ['/', '/projects', '/admin/projects'],
} as const

export type RevalidationGroup = keyof typeof REVALIDATION_PATHS

export async function revalidateGroup(group: RevalidationGroup): Promise<void> {
  REVALIDATION_PATHS[group].forEach((path) => revalidatePath(path))
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION HELPER
// ─────────────────────────────────────────────────────────────────────────────
type AuthenticatedAction<T> = (
  supabase: SupabaseClient,
  user: User
) => Promise<T>

export async function withAuth<T>(
  action: AuthenticatedAction<T>
): Promise<T | ActionResponse> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { success: false, message: 'Non autorisé. Veuillez vous connecter.' }
  }

  return action(supabase, user)
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION HELPER (must be async for 'use server' files)
// ─────────────────────────────────────────────────────────────────────────────
export async function validateFormData<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join(', ')
    return { success: false, error: `Validation échouée: ${errors}` }
  }
  
  return { success: true, data: result.data }
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLER (must be async for 'use server' files)
// ─────────────────────────────────────────────────────────────────────────────
export async function handleError(error: unknown, context: string): Promise<ActionResponse> {
  const message = error instanceof Error ? error.message : 'Erreur inconnue'
  console.error(`${context}:`, error)
  return { success: false, message: `Erreur: ${message}` }
}

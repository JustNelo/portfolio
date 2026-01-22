'use server'

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'

/**
 * Response type for authenticated actions
 */
export interface ActionResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

/**
 * Type for authenticated action handler
 */
type AuthenticatedAction<T> = (
  supabase: SupabaseClient,
  user: User
) => Promise<ActionResponse<T>>

/**
 * Higher-order function that wraps Server Actions with authentication check.
 * Eliminates repetitive auth boilerplate across all protected actions.
 * 
 * @example
 * ```ts
 * export async function deleteProject(id: string): Promise<ActionResponse> {
 *   return withAuth(async (supabase, user) => {
 *     const { error } = await supabase.from('projects').delete().eq('id', id)
 *     if (error) return { success: false, message: error.message }
 *     return { success: true, message: 'Projet supprimé.' }
 *   })
 * }
 * ```
 */
export async function withAuth<T>(
  action: AuthenticatedAction<T>
): Promise<ActionResponse<T>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { 
        success: false, 
        message: 'Non autorisé. Veuillez vous connecter.' 
      }
    }

    return await action(supabase, user)
  } catch (error) {
    console.error('withAuth error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur interne du serveur.'
    }
  }
}

/**
 * Variant without authentication for public actions that still need Supabase client
 */
export async function withSupabase<T>(
  action: (supabase: SupabaseClient) => Promise<ActionResponse<T>>
): Promise<ActionResponse<T>> {
  try {
    const supabase = await createClient()
    return await action(supabase)
  } catch (error) {
    console.error('withSupabase error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur interne du serveur.'
    }
  }
}

'use server'

import { revalidatePath } from 'next/cache'

// ─────────────────────────────────────────────────────────────────────────────
// REVALIDATION PATHS
// ─────────────────────────────────────────────────────────────────────────────
const REVALIDATION_PATHS = {
  about: ['/', '/about', '/admin/settings'],
  projects: ['/', '/projects', '/admin/projects'],
} as const

type RevalidationGroup = keyof typeof REVALIDATION_PATHS

export async function revalidateGroup(group: RevalidationGroup): Promise<void> {
  REVALIDATION_PATHS[group].forEach((path) => revalidatePath(path))
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function handleError(error: unknown, context: string): Promise<{ success: false; message: string }> {
  const message = error instanceof Error ? error.message : 'Erreur inconnue'
  console.error(`${context}:`, error)
  return { success: false, message: `Erreur: ${message}` }
}

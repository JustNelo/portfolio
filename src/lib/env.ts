import { z } from 'zod'

/**
 * Schema for environment variables validation.
 * Ensures all required env vars are present and correctly formatted at runtime.
 */
const envSchema = z.object({
  // Supabase - Required
  NEXT_PUBLIC_SUPABASE_URL: z
    .string({ message: 'NEXT_PUBLIC_SUPABASE_URL is required' })
    .url({ message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string({ message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required' })
    .min(1, { message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty' }),
})

/**
 * Validated environment variables.
 * Throws at build/runtime if validation fails.
 */
function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables. Check server logs for details.')
  }

  return parsed.data
}

export const env = validateEnv()

/**
 * Type-safe access to environment variables
 */
export type Env = z.infer<typeof envSchema>

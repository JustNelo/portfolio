import { createClient } from '@supabase/supabase-js'

/**
 * Static Supabase client for read-only public data.
 * Does not use cookies - safe for use inside unstable_cache().
 */
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

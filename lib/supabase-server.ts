import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Server-side Supabase client for use in Server Actions and API routes
 * Uses the anon key to maintain proper auth functionality
 */
export function createServerClient() {
  // Create client without Database typing to access full auth API
  // The typed Database restricts auth methods
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

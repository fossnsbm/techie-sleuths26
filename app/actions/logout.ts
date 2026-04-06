'use server'

import { createAuthClient } from '@/lib/supabase-auth'
import { redirect } from 'next/navigation'

export async function logout() {
  try {
    // Create auth client with cookie support
    const supabase = await createAuthClient()

    // Sign out and clear session
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      // Even if there's an error, we'll redirect to home
      // The cookies will be cleared by the auth client
    }
  } catch (error) {
    console.error('Unexpected error during logout:', error)
  }

  // Redirect to landing page (outside try-catch to avoid catching redirect)
  redirect('/')
}

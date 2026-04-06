'use server'

import { createAuthClient } from '@/lib/supabase-auth'
import { getUser } from '@/lib/auth'

interface UnlockVaultResponse {
  success: boolean
  error?: string
}

export async function unlockVault(password: string): Promise<UnlockVaultResponse> {
  try {
    // Get authenticated user
    const user = await getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate password against env var
    const correctPassword = process.env.VAULT_PASSWORD
    if (!correctPassword) {
      console.error('VAULT_PASSWORD environment variable is not set')
      return { success: false, error: 'Server configuration error' }
    }

    if (password !== correctPassword) {
      return { success: false, error: 'Incorrect password' }
    }

    // Update team's vault_unlocked status
    const supabase = await createAuthClient()
    const { error } = await supabase
      .from('teams')
      .update({ vault_unlocked: true })
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to update vault status:', error)
      return { success: false, error: 'Failed to unlock vault' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error unlocking vault:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

'use server'

import { createAuthClient } from '@/lib/supabase-auth'
import { z } from 'zod'
import { redirect } from 'next/navigation'

// Validation schema for login form
const loginSchema = z.object({
  email: z.email('Invalid email').regex(/@students\.nsbm\.ac\.lk$/, 'Must be an NSBM student email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
})

type LoginData = z.infer<typeof loginSchema>

interface LoginResponse {
  success: boolean
  error?: string
}

export async function login(data: LoginData, redirectTo?: string): Promise<LoginResponse> {
  try {
    // Validate input data
    const validated = loginSchema.safeParse(data)

    if (!validated.success) {
      const firstError = validated.error.issues[0]
      return {
        success: false,
        error: firstError.message
      }
    }

    const { email, password } = validated.data

    // Create auth client with cookie support
    const supabase = await createAuthClient()

    // Attempt to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Login error:', authError)
      
      // Return generic error message for security
      return {
        success: false,
        error: 'Invalid credentials. Please check your email and password.'
      }
    }

    if (!authData || !authData.user) {
      return {
        success: false,
        error: 'Invalid credentials. Please check your email and password.'
      }
    }

    // Verify the user has a team record
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id, team_name, status')
      .eq('user_id', authData.user.id)
      .single()

    if (teamError || !teamData) {
      console.error('Team lookup error:', teamError)
      
      // User exists in auth but no team record (shouldn't happen)
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'No team found for this account. Please contact support.'
      }
    }

    // Success! Session is automatically stored in cookies by createAuthClient
    // Now redirect to dashboard or the intended page
    
  } catch (error) {
    console.error('Unexpected error during login:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    }
  }

  // Redirect after successful login (outside try-catch to avoid catching redirect)
  redirect(redirectTo || '/dashboard')
}

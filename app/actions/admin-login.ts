'use server'

import { createAuthClient } from '@/lib/supabase-auth'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const adminLoginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type AdminLoginData = z.infer<typeof adminLoginSchema>

interface AdminLoginResponse {
  success: boolean
  error?: string
}

export async function adminLogin(data: AdminLoginData): Promise<AdminLoginResponse> {
  try {
    const validated = adminLoginSchema.safeParse(data)

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0].message
      }
    }

    const supabase = await createAuthClient()
    const { email, password } = validated.data

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return {
        success: false,
        error: 'Invalid credentials.'
      }
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (adminError || !adminUser) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'This account does not have admin access.'
      }
    }
  } catch (error) {
    console.error('Unexpected error during admin login:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    }
  }

  redirect('/admin')
}

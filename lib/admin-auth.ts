import { createAuthClient } from './supabase-auth'

export interface AuthenticatedAdmin {
  id: string
  user_id: string
  is_active: boolean
}

export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  try {
    const supabase = await createAuthClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return null
    }

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('id, user_id, is_active')
      .eq('user_id', userData.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (adminError || !admin) {
      return null
    }

    return admin
  } catch (error) {
    console.error('Unexpected error getting authenticated admin:', error)
    return null
  }
}

export async function requireAdmin(): Promise<AuthenticatedAdmin> {
  const admin = await getAuthenticatedAdmin()

  if (!admin) {
    throw new Error('Unauthorized')
  }

  return admin
}

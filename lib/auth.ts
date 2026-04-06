import { createAuthClient } from './supabase-auth'
import type { Database } from '@/types/database.types'

type Team = Database['public']['Tables']['teams']['Row']

export interface AuthenticatedTeam {
  id: string
  team_name: string
  team_leader_name: string
  team_leader_email: string
  team_leader_phone: string | null
  team_members: Array<{ name: string; studentId: string }>
  status: string | null
  created_at: string | null
  updated_at: string | null
}

/**
 * Gets the currently authenticated user
 * Uses getUser() instead of getSession() for secure server-side validation
 * Returns null if not authenticated
 */
export async function getUser() {
  try {
    const supabase = await createAuthClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected error getting user:', error)
    return null
  }
}

/**
 * Gets the team data for the currently authenticated user
 * Returns null if not authenticated or team not found
 */
export async function getAuthenticatedTeam(): Promise<AuthenticatedTeam | null> {
  try {
    const user = await getUser()
    
    if (!user) {
      return null
    }

    const supabase = await createAuthClient()
    
    // Query team by user_id
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching team:', error)
      return null
    }

    if (!team) {
      return null
    }

    // Return typed team data
    return {
      id: team.id,
      team_name: team.team_name,
      team_leader_name: team.team_leader_name,
      team_leader_email: team.team_leader_email,
      team_leader_phone: team.team_leader_phone,
      team_members: team.team_members as Array<{ name: string; studentId: string }>,
      status: team.status,
      created_at: team.created_at,
      updated_at: team.updated_at
    }
  } catch (error) {
    console.error('Unexpected error getting authenticated team:', error)
    return null
  }
}

/**
 * Checks if the current user is authenticated
 * Returns true if user exists, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null
}

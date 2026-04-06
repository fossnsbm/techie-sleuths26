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
 * Gets the currently authenticated user's session
 * Returns null if not authenticated
 */
export async function getSession() {
  try {
    const supabase = await createAuthClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Unexpected error getting session:', error)
    return null
  }
}

/**
 * Gets the team data for the currently authenticated user
 * Returns null if not authenticated or team not found
 */
export async function getAuthenticatedTeam(): Promise<AuthenticatedTeam | null> {
  try {
    const session = await getSession()
    
    if (!session || !session.user) {
      return null
    }

    const supabase = await createAuthClient()
    
    // Query team by user_id
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', session.user.id)
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
 * Returns true if session exists, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

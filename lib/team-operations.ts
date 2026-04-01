import { supabase } from '@/lib/supabase'
import type { TeamInsert } from '@/lib/supabase'

/**
 * Example functions for interacting with the teams table
 */

// Create a new team registration
export async function registerTeam(teamData: TeamInsert) {
  const { data, error } = await supabase
    .from('teams')
    .insert(teamData)
    .select()
    .single()

  if (error) {
    console.error('Error registering team:', error)
    throw error
  }

  return data
}

// Get a team by ID
export async function getTeamById(id: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching team:', error)
    throw error
  }

  return data
}

// Get all teams
export async function getAllTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching teams:', error)
    throw error
  }

  return data
}

// Get teams by status
export async function getTeamsByStatus(status: 'pending' | 'approved' | 'rejected') {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching teams by status:', error)
    throw error
  }

  return data
}

// Update team information
export async function updateTeam(id: string, updates: Partial<TeamInsert>) {
  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating team:', error)
    throw error
  }

  return data
}

// Delete a team
export async function deleteTeam(id: string) {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting team:', error)
    throw error
  }

  return true
}

// Example usage in a Server Action or API route:
/*
'use server'

import { registerTeam } from '@/lib/team-operations'

export async function submitTeamRegistration(formData: FormData) {
  try {
    const team = await registerTeam({
      team_name: formData.get('team_name') as string,
      team_leader_name: formData.get('team_leader_name') as string,
      team_leader_email: formData.get('team_leader_email') as string,
      team_leader_phone: formData.get('team_leader_phone') as string,
      institution: formData.get('institution') as string,
      team_members: JSON.parse(formData.get('team_members') as string || '[]'),
    })

    return { success: true, team }
  } catch (error) {
    return { success: false, error: 'Failed to register team' }
  }
}
*/

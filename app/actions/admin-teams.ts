'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase-admin'

const teamUpdateSchema = z.object({
  teamName: z.string().min(1, 'Team name is required'),
  teamLeaderName: z.string().min(1, 'Team leader name is required'),
  teamLeaderPhone: z.string().regex(/^07\d{8}$/, 'Contact must be in format 07XXXXXXXX'),
  status: z.enum(['pending', 'approved', 'rejected'])
})

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export interface AdminTeamRecord {
  id: string
  user_id: string | null
  team_name: string
  team_leader_name: string
  team_leader_email: string
  team_leader_phone: string | null
  status: string | null
  created_at: string | null
  total_points: number
  trail_points: number
  no_exit_points: number
  ai_points: number
}

interface ActionResult {
  success: boolean
  message: string
}

export async function getAdminTeams(): Promise<AdminTeamRecord[]> {
  try {
    await requireAdmin()
    const adminClient = createAdminClient()

    const [{ data: teams, error: teamsError }, { data: leaderboard, error: leaderboardError }] = await Promise.all([
      adminClient
        .from('teams')
        .select('id, user_id, team_name, team_leader_name, team_leader_email, team_leader_phone, status, created_at')
        .order('created_at', { ascending: true }),
      adminClient.rpc('get_public_leaderboard')
    ])

    if (teamsError) {
      console.error('Error fetching teams for admin:', teamsError)
      return []
    }

    if (leaderboardError) {
      console.error('Error fetching leaderboard for admin:', leaderboardError)
    }

    const scoreMap = new Map<string, { total_points: number; trail_points: number; no_exit_points: number; ai_points: number }>()

    ;(leaderboard || []).forEach((entry: any) => {
      scoreMap.set(entry.team_id, {
        total_points: entry.total_points || 0,
        trail_points: entry.trail_points || 0,
        no_exit_points: entry.no_exit_points || 0,
        ai_points: entry.ai_points || 0
      })
    })

    return (teams || []).map((team) => {
      const points = scoreMap.get(team.id)
      return {
        ...team,
        total_points: points?.total_points || 0,
        trail_points: points?.trail_points || 0,
        no_exit_points: points?.no_exit_points || 0,
        ai_points: points?.ai_points || 0
      }
    })
  } catch (error) {
    console.error('Unexpected error getting admin teams:', error)
    return []
  }
}

export async function updateAdminTeamDetails(teamId: string, payload: z.infer<typeof teamUpdateSchema>): Promise<ActionResult> {
  try {
    await requireAdmin()
    const validated = teamUpdateSchema.safeParse(payload)

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0].message
      }
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('teams')
      .update({
        team_name: validated.data.teamName,
        team_leader_name: validated.data.teamLeaderName,
        team_leader_phone: validated.data.teamLeaderPhone,
        status: validated.data.status
      })
      .eq('id', teamId)

    if (error) {
      console.error('Error updating team details:', error)
      return { success: false, message: 'Failed to update team details' }
    }

    return { success: true, message: 'Team details updated successfully' }
  } catch (error) {
    console.error('Unexpected error updating team details:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function setAdminTeamPassword(teamId: string, password: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const validated = passwordSchema.safeParse({ password })

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0].message
      }
    }

    const adminClient = createAdminClient()
    const { data: team, error: teamError } = await adminClient
      .from('teams')
      .select('user_id')
      .eq('id', teamId)
      .single()

    if (teamError || !team?.user_id) {
      return { success: false, message: 'Team user not found' }
    }

    const { error: authError } = await adminClient.auth.admin.updateUserById(team.user_id, {
      password: validated.data.password
    })

    if (authError) {
      console.error('Error setting team password:', authError)
      return { success: false, message: 'Failed to update password' }
    }

    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    console.error('Unexpected error setting team password:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function deleteAdminTeam(teamId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const adminClient = createAdminClient()

    const { data: team, error: teamError } = await adminClient
      .from('teams')
      .select('id, user_id')
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return { success: false, message: 'Team not found' }
    }

    await adminClient.from('trail_of_shadows_submissions').delete().eq('team_id', teamId)
    await adminClient.from('no_exit_submissions').delete().eq('team_id', teamId)
    await adminClient.from('ai_interrogation_submissions').delete().eq('team_id', teamId)

    const { error: deleteTeamError } = await adminClient
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (deleteTeamError) {
      console.error('Error deleting team row:', deleteTeamError)
      return { success: false, message: 'Failed to delete team' }
    }

    if (team.user_id) {
      const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(team.user_id)
      if (authDeleteError) {
        console.error('Error deleting auth user:', authDeleteError)
        return { success: false, message: 'Team deleted, but failed to remove auth user' }
      }
    }

    return { success: true, message: 'Team deleted successfully' }
  } catch (error) {
    console.error('Unexpected error deleting team:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

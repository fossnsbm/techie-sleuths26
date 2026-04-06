'use server'

import { createServerClient } from '@/lib/supabase-server'

export interface LeaderboardEntry {
  rank: number
  team_id: string
  team_name: string
  total_points: number
  trail_points: number
  no_exit_points: number
  ai_points: number
}

export async function getPublicLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.rpc('get_public_leaderboard')

    if (error) {
      console.error('Error fetching public leaderboard:', error)
      return []
    }

    return (data || []) as LeaderboardEntry[]
  } catch (error) {
    console.error('Unexpected error fetching public leaderboard:', error)
    return []
  }
}

export async function getTeamRank(teamId: string): Promise<number | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.rpc('get_team_rank', { p_team_id: teamId })

    if (error) {
      console.error('Error fetching team rank:', error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    return Number(data[0].rank)
  } catch (error) {
    console.error('Unexpected error fetching team rank:', error)
    return null
  }
}

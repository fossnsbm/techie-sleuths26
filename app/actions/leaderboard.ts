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

import { NextResponse } from 'next/server'
import { getPublicLeaderboard } from '@/app/actions/leaderboard'

export async function GET() {
  const entries = await getPublicLeaderboard()
  return NextResponse.json({ entries })
}

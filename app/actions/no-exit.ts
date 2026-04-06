'use server'

import { createAuthClient } from '@/lib/supabase-auth'
import { getUser } from '@/lib/auth'

interface NoExitChallengeProgress {
  id: number
  title: string
  description: string
  points: number
  attachmentUrl: string | null
  isAnswered: boolean
  pointsEarned: number
}

interface NoExitProgress {
  challenges: NoExitChallengeProgress[]
  totalScore: number
  challengesCompleted: number
}

interface NoExitSubmissionResult {
  success: boolean
  isCorrect?: boolean
  pointsAwarded?: number
  message: string
  alreadyCorrect?: boolean
}

async function getTeamId() {
  const user = await getUser()
  if (!user) {
    return null
  }

  const supabase = await createAuthClient()
  const { data: team } = await supabase
    .from('teams')
    .select('id')
    .eq('user_id', user.id)
    .single()

  return team?.id ?? null
}

export async function getNoExitProgress(): Promise<NoExitProgress> {
  try {
    const teamId = await getTeamId()
    if (!teamId) {
      return { challenges: [], totalScore: 0, challengesCompleted: 0 }
    }

    const supabase = await createAuthClient()

    const { data: challenges, error: challengesError } = await supabase
      .from('no_exit_challenges')
      .select('id, title, description, points, attachment_path')
      .order('id', { ascending: true })

    if (challengesError || !challenges) {
      console.error('Error fetching no exit challenges:', challengesError)
      return { challenges: [], totalScore: 0, challengesCompleted: 0 }
    }

    const { data: submissions, error: submissionsError } = await supabase
      .from('no_exit_submissions')
      .select('challenge_id, points_awarded')
      .eq('team_id', teamId)
      .eq('is_correct', true)

    if (submissionsError) {
      console.error('Error fetching no exit submissions:', submissionsError)
    }

    const solvedMap = new Map<number, number>()
    submissions?.forEach((submission) => {
      solvedMap.set(submission.challenge_id, submission.points_awarded)
    })

    const progressChallenges: NoExitChallengeProgress[] = challenges.map((challenge) => {
      let attachmentUrl: string | null = null

      if (challenge.attachment_path) {
        const { data } = supabase.storage
          .from('no-exit-attachments')
          .getPublicUrl(challenge.attachment_path)
        attachmentUrl = data.publicUrl
      }

      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        points: challenge.points,
        attachmentUrl,
        isAnswered: solvedMap.has(challenge.id),
        pointsEarned: solvedMap.get(challenge.id) || 0
      }
    })

    const totalScore = Array.from(solvedMap.values()).reduce((sum, points) => sum + points, 0)
    const challengesCompleted = solvedMap.size

    return {
      challenges: progressChallenges,
      totalScore,
      challengesCompleted
    }
  } catch (error) {
    console.error('Unexpected error getting no exit progress:', error)
    return { challenges: [], totalScore: 0, challengesCompleted: 0 }
  }
}

export async function submitNoExitAnswer(
  challengeId: number,
  answer: string
): Promise<NoExitSubmissionResult> {
  try {
    if (!answer || answer.trim().length === 0) {
      return { success: false, message: 'Please enter an answer' }
    }

    const teamId = await getTeamId()
    if (!teamId) {
      return { success: false, message: 'Team not found' }
    }

    const supabase = await createAuthClient()

    const { data: existingCorrect } = await supabase
      .from('no_exit_submissions')
      .select('id')
      .eq('team_id', teamId)
      .eq('challenge_id', challengeId)
      .eq('is_correct', true)
      .maybeSingle()

    if (existingCorrect) {
      return {
        success: false,
        message: 'You have already solved this challenge',
        alreadyCorrect: true
      }
    }

    const { data: challenge, error: challengeError } = await supabase
      .from('no_exit_challenges')
      .select('id, answer, points')
      .eq('id', challengeId)
      .single()

    if (challengeError || !challenge) {
      console.error('Error fetching no exit challenge:', challengeError)
      return { success: false, message: 'Challenge not found' }
    }

    const isCorrect = answer.trim().toLowerCase() === challenge.answer.toLowerCase()
    const pointsAwarded = isCorrect ? challenge.points : 0

    const { error: submissionError } = await supabase
      .from('no_exit_submissions')
      .insert({
        team_id: teamId,
        challenge_id: challengeId,
        submitted_answer: answer.trim(),
        is_correct: isCorrect,
        points_awarded: pointsAwarded
      })

    if (submissionError) {
      console.error('Error recording no exit submission:', submissionError)
      return { success: false, message: 'Failed to record submission' }
    }

    return {
      success: true,
      isCorrect,
      pointsAwarded,
      message: isCorrect ? `Correct! +${pointsAwarded} points` : 'Incorrect, try again'
    }
  } catch (error) {
    console.error('Unexpected error submitting no exit answer:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function getNoExitScore(): Promise<{ totalScore: number; challengesCompleted: number }> {
  try {
    const teamId = await getTeamId()
    if (!teamId) {
      return { totalScore: 0, challengesCompleted: 0 }
    }

    const supabase = await createAuthClient()
    const { data: submissions, error } = await supabase
      .from('no_exit_submissions')
      .select('points_awarded')
      .eq('team_id', teamId)
      .eq('is_correct', true)

    if (error) {
      console.error('Error fetching no exit score:', error)
      return { totalScore: 0, challengesCompleted: 0 }
    }

    const totalScore = submissions?.reduce((sum, sub) => sum + sub.points_awarded, 0) || 0
    const challengesCompleted = submissions?.length || 0

    return { totalScore, challengesCompleted }
  } catch (error) {
    console.error('Unexpected error getting no exit score:', error)
    return { totalScore: 0, challengesCompleted: 0 }
  }
}

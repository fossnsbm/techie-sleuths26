'use server'

import { createAuthClient } from '@/lib/supabase-auth'
import { getUser } from '@/lib/auth'
import type { Database } from '@/types/database.types'

type Question = Database['public']['Tables']['trail_of_shadows_questions']['Row']
type QuestionWithoutAnswer = Omit<Question, 'answer' | 'created_at'>

interface QuestionProgress {
  id: number
  title: string
  description: string
  difficulty: string
  points: number
  isAnswered: boolean
  pointsEarned: number
}

interface TeamProgress {
  questions: QuestionProgress[]
  totalScore: number
  questionsCompleted: number
}

interface SubmissionResult {
  success: boolean
  isCorrect?: boolean
  pointsAwarded?: number
  message?: string
  alreadyCorrect?: boolean
}

/**
 * Get all Trail of Shadows questions (without answers)
 */
export async function getTrailOfShadowsQuestions(): Promise<QuestionWithoutAnswer[]> {
  try {
    const supabase = await createAuthClient()
    
    const { data: questions, error } = await supabase
      .from('trail_of_shadows_questions')
      .select('id, title, description, difficulty, points')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching questions:', error)
      return []
    }

    return questions || []
  } catch (error) {
    console.error('Unexpected error fetching questions:', error)
    return []
  }
}

/**
 * Get team's progress for Trail of Shadows
 */
export async function getTrailOfShadowsProgress(): Promise<TeamProgress> {
  try {
    const user = await getUser()
    if (!user) {
      return { questions: [], totalScore: 0, questionsCompleted: 0 }
    }

    const supabase = await createAuthClient()
    
    // Get team ID
    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!team) {
      return { questions: [], totalScore: 0, questionsCompleted: 0 }
    }

    // Get all questions
    const { data: questions, error: questionsError } = await supabase
      .from('trail_of_shadows_questions')
      .select('id, title, description, difficulty, points')
      .order('id', { ascending: true })

    if (questionsError || !questions) {
      console.error('Error fetching questions:', questionsError)
      return { questions: [], totalScore: 0, questionsCompleted: 0 }
    }

    // Get team's correct submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('trail_of_shadows_submissions')
      .select('question_id, points_awarded')
      .eq('team_id', team.id)
      .eq('is_correct', true)

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError)
    }

    // Map submissions to question IDs for quick lookup
    const submissionMap = new Map<number, number>()
    submissions?.forEach(sub => {
      submissionMap.set(sub.question_id, sub.points_awarded)
    })

    // Build progress data
    const questionsProgress: QuestionProgress[] = questions.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      points: q.points,
      isAnswered: submissionMap.has(q.id),
      pointsEarned: submissionMap.get(q.id) || 0
    }))

    const totalScore = Array.from(submissionMap.values()).reduce((sum, points) => sum + points, 0)
    const questionsCompleted = submissionMap.size

    return {
      questions: questionsProgress,
      totalScore,
      questionsCompleted
    }
  } catch (error) {
    console.error('Unexpected error getting progress:', error)
    return { questions: [], totalScore: 0, questionsCompleted: 0 }
  }
}

/**
 * Submit an answer for a Trail of Shadows question
 */
export async function submitTrailOfShadowsAnswer(
  questionId: number,
  answer: string
): Promise<SubmissionResult> {
  try {
    // Validate input
    if (!answer || answer.trim().length === 0) {
      return { success: false, message: 'Please enter an answer' }
    }

    // Get authenticated user
    const user = await getUser()
    if (!user) {
      return { success: false, message: 'Not authenticated' }
    }

    const supabase = await createAuthClient()
    
    // Get team ID
    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!team) {
      return { success: false, message: 'Team not found' }
    }

    // Check if team already has a correct answer for this question
    const { data: existingCorrect } = await supabase
      .from('trail_of_shadows_submissions')
      .select('id')
      .eq('team_id', team.id)
      .eq('question_id', questionId)
      .eq('is_correct', true)
      .maybeSingle()

    if (existingCorrect) {
      return { 
        success: false, 
        message: 'You have already answered this question correctly',
        alreadyCorrect: true
      }
    }

    // Get the question and correct answer
    const { data: question, error: questionError } = await supabase
      .from('trail_of_shadows_questions')
      .select('id, answer, points')
      .eq('id', questionId)
      .single()

    if (questionError || !question) {
      console.error('Error fetching question:', questionError)
      return { success: false, message: 'Question not found' }
    }

    // Compare answers (case-insensitive)
    const isCorrect = answer.trim().toLowerCase() === question.answer.toLowerCase()
    const pointsAwarded = isCorrect ? question.points : 0

    // Record the submission
    const { error: submissionError } = await supabase
      .from('trail_of_shadows_submissions')
      .insert({
        team_id: team.id,
        question_id: questionId,
        submitted_answer: answer.trim(),
        is_correct: isCorrect,
        points_awarded: pointsAwarded
      })

    if (submissionError) {
      console.error('Error recording submission:', submissionError)
      return { success: false, message: 'Failed to record submission' }
    }

    return {
      success: true,
      isCorrect,
      pointsAwarded,
      message: isCorrect 
        ? `Correct! +${pointsAwarded} points` 
        : 'Incorrect, try again'
    }
  } catch (error) {
    console.error('Unexpected error submitting answer:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

/**
 * Get team's total score for Trail of Shadows (for dashboard stats)
 */
export async function getTrailOfShadowsScore(): Promise<{ totalScore: number; questionsCompleted: number }> {
  try {
    const user = await getUser()
    if (!user) {
      return { totalScore: 0, questionsCompleted: 0 }
    }

    const supabase = await createAuthClient()
    
    // Get team ID
    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!team) {
      return { totalScore: 0, questionsCompleted: 0 }
    }

    // Get all correct submissions
    const { data: submissions, error } = await supabase
      .from('trail_of_shadows_submissions')
      .select('points_awarded')
      .eq('team_id', team.id)
      .eq('is_correct', true)

    if (error) {
      console.error('Error fetching score:', error)
      return { totalScore: 0, questionsCompleted: 0 }
    }

    const totalScore = submissions?.reduce((sum, sub) => sum + sub.points_awarded, 0) || 0
    const questionsCompleted = submissions?.length || 0

    return { totalScore, questionsCompleted }
  } catch (error) {
    console.error('Unexpected error getting score:', error)
    return { totalScore: 0, questionsCompleted: 0 }
  }
}

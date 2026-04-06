'use server'

import { createAuthClient } from '@/lib/supabase-auth'
import { getUser } from '@/lib/auth'

interface AIInterrogationSubmission {
  id: string
  promptText: string
  imagePath: string
  imageUrl: string
  awardedPoints: number
  createdAt: string | null
}

interface AIInterrogationSubmissionResponse {
  hasSubmitted: boolean
  submission: AIInterrogationSubmission | null
}

interface SubmissionResult {
  success: boolean
  message: string
  alreadySubmitted?: boolean
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

export async function getAIInterrogationSubmission(): Promise<AIInterrogationSubmissionResponse> {
  try {
    const teamId = await getTeamId()
    if (!teamId) {
      return { hasSubmitted: false, submission: null }
    }

    const supabase = await createAuthClient()
    const { data: submission, error } = await supabase
      .from('ai_interrogation_submissions')
      .select('id, prompt_text, image_path, awarded_points, created_at')
      .eq('team_id', teamId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching AI interrogation submission:', error)
      return { hasSubmitted: false, submission: null }
    }

    if (!submission) {
      return { hasSubmitted: false, submission: null }
    }

    const { data } = supabase.storage
      .from('ai-interrogation-uploads')
      .getPublicUrl(submission.image_path)

    return {
      hasSubmitted: true,
      submission: {
        id: submission.id,
        promptText: submission.prompt_text,
        imagePath: submission.image_path,
        imageUrl: data.publicUrl,
        awardedPoints: submission.awarded_points,
        createdAt: submission.created_at
      }
    }
  } catch (error) {
    console.error('Unexpected error getting AI interrogation submission:', error)
    return { hasSubmitted: false, submission: null }
  }
}

export async function submitAIInterrogationSubmission(formData: FormData): Promise<SubmissionResult> {
  try {
    const teamId = await getTeamId()
    if (!teamId) {
      return { success: false, message: 'Team not found' }
    }

    const supabase = await createAuthClient()

    const { data: existing } = await supabase
      .from('ai_interrogation_submissions')
      .select('id')
      .eq('team_id', teamId)
      .maybeSingle()

    if (existing) {
      return {
        success: false,
        message: 'You have already submitted this challenge',
        alreadySubmitted: true
      }
    }

    const prompt = String(formData.get('prompt') || '').trim()
    const image = formData.get('image')

    if (!prompt) {
      return { success: false, message: 'Please enter the prompt you used' }
    }

    if (!(image instanceof File)) {
      return { success: false, message: 'Please upload an image' }
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      return { success: false, message: 'Only PNG, JPG, and WEBP images are allowed' }
    }

    const maxBytes = 10 * 1024 * 1024
    if (image.size > maxBytes) {
      return { success: false, message: 'Image size must be 10MB or less' }
    }

    const extensionMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp'
    }

    const extension = extensionMap[image.type] || 'jpg'
    const filePath = `team-${teamId}/submission-${Date.now()}.${extension}`

    const bytes = await image.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('ai-interrogation-uploads')
      .upload(filePath, new Uint8Array(bytes), {
        contentType: image.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading AI interrogation image:', uploadError)
      return { success: false, message: 'Failed to upload image' }
    }

    const { error: insertError } = await supabase
      .from('ai_interrogation_submissions')
      .insert({
        team_id: teamId,
        prompt_text: prompt,
        image_path: filePath
      })

    if (insertError) {
      console.error('Error creating AI interrogation submission:', insertError)
      await supabase.storage.from('ai-interrogation-uploads').remove([filePath])
      return { success: false, message: 'Failed to save submission' }
    }

    return { success: true, message: 'Submission received successfully' }
  } catch (error) {
    console.error('Unexpected error submitting AI interrogation:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function getAIInterrogationScore(): Promise<{ totalScore: number; hasSubmitted: boolean }> {
  try {
    const teamId = await getTeamId()
    if (!teamId) {
      return { totalScore: 0, hasSubmitted: false }
    }

    const supabase = await createAuthClient()
    const { data: submission, error } = await supabase
      .from('ai_interrogation_submissions')
      .select('awarded_points')
      .eq('team_id', teamId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching AI interrogation score:', error)
      return { totalScore: 0, hasSubmitted: false }
    }

    return {
      totalScore: submission?.awarded_points || 0,
      hasSubmitted: Boolean(submission)
    }
  } catch (error) {
    console.error('Unexpected error getting AI interrogation score:', error)
    return { totalScore: 0, hasSubmitted: false }
  }
}

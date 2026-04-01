'use server'

import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

// Validation schemas matching the registration form
const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  studentId: z.string().regex(/[0-9]{5}/, "Invalid Student Id")
})

const registrationSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  teamEmail: z.email("Invalid email").regex(/@students\.nsbm\.ac\.lk$/, "Must be an NSBM student email"),
  teamContact: z.string().regex(/^07\d{8}$/, "Contact must be in format 07XXXXXXXX"),
  teamPassword: z.string().min(8, "Password must be at least 8 characters"),
  teamMembers: z.array(teamMemberSchema).min(2, "At least 2 members required").max(4, "Maximum 4 members allowed")
})

type RegistrationData = z.infer<typeof registrationSchema>

interface RegistrationResponse {
  success: boolean
  error?: string
  teamId?: string
}

// Type for auth response
interface AuthSignUpResponse {
  data: {
    user: { id: string } | null
    session: unknown
  } | null
  error: { message: string } | null
}

export async function registerTeam(data: RegistrationData): Promise<RegistrationResponse> {
  try {
    // Validate input data
    const validated = registrationSchema.safeParse(data)

    if (!validated.success) {
      const firstError = validated.error.issues[0]
      return {
        success: false,
        error: `${firstError.path.join('.')}: ${firstError.message}`
      }
    }

    const { teamName, teamEmail, teamContact, teamPassword, teamMembers } = validated.data

    // Extract team leader info (first member)
    const teamLeaderName = teamMembers[0].name

    // Create server-side Supabase client
    const supabase = createServerClient()

    // Step 1: Create Supabase Auth user with auto-confirmation
    // Using type assertion to bypass TypeScript issue with auth types
    const authClient = supabase.auth as any
    const { data: authData, error: authError }: AuthSignUpResponse = await authClient.signUp({
      email: teamEmail,
      password: teamPassword,
      options: {
        emailRedirectTo: undefined,
        data: {
          team_name: teamName,
          team_leader_name: teamLeaderName
        }
      }
    })

    if (authError) {
      console.error('Auth signup error:', authError)

      // Handle specific error cases
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        return {
          success: false,
          error: 'This email is already registered. Please use a different email or contact support.'
        }
      }

      return {
        success: false,
        error: authError.message || 'Failed to create account. Please try again.'
      }
    }

    if (!authData || !authData.user) {
      return {
        success: false,
        error: 'Failed to create user account. Please try again.'
      }
    }

    const userId = authData.user.id

    // Step 2: Insert team data into teams table
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert({
        user_id: userId,
        team_name: teamName,
        team_leader_name: teamLeaderName,
        team_leader_email: teamEmail,
        team_leader_phone: teamContact,
        team_members: teamMembers as any, // JSONB field
        status: 'pending'
      })
      .select()
      .single()

    if (teamError) {
      console.error('Team insert error:', teamError)

      // If team insert fails, we should ideally delete the auth user
      // But for now, just return an error
      if (teamError.message.includes('duplicate') || teamError.code === '23505') {
        return {
          success: false,
          error: 'A team with this name already exists. Please choose a different team name.'
        }
      }

      return {
        success: false,
        error: 'Failed to register team. Please try again or contact support.'
      }
    }

    // Success!
    return {
      success: true,
      teamId: teamData.id
    }

  } catch (error) {
    console.error('Unexpected error during registration:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    }
  }
}

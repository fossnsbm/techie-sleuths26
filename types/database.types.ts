export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: []
      }
      ai_interrogation_submissions: {
        Row: {
          awarded_points: number
          created_at: string | null
          evaluated_at: string | null
          id: string
          image_path: string
          prompt_text: string
          team_id: string
        }
        Insert: {
          awarded_points?: number
          created_at?: string | null
          evaluated_at?: string | null
          id?: string
          image_path: string
          prompt_text: string
          team_id: string
        }
        Update: {
          awarded_points?: number
          created_at?: string | null
          evaluated_at?: string | null
          id?: string
          image_path?: string
          prompt_text?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_interrogation_submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      no_exit_challenges: {
        Row: {
          answer: string
          attachment_path: string | null
          created_at: string | null
          description: string
          id: number
          points: number
          title: string
        }
        Insert: {
          answer: string
          attachment_path?: string | null
          created_at?: string | null
          description: string
          id: number
          points: number
          title: string
        }
        Update: {
          answer?: string
          attachment_path?: string | null
          created_at?: string | null
          description?: string
          id?: number
          points?: number
          title?: string
        }
        Relationships: []
      }
      no_exit_submissions: {
        Row: {
          challenge_id: number
          id: string
          is_correct: boolean
          points_awarded: number
          submitted_answer: string
          submitted_at: string | null
          team_id: string
        }
        Insert: {
          challenge_id: number
          id?: string
          is_correct: boolean
          points_awarded?: number
          submitted_answer: string
          submitted_at?: string | null
          team_id: string
        }
        Update: {
          challenge_id?: number
          id?: string
          is_correct?: boolean
          points_awarded?: number
          submitted_answer?: string
          submitted_at?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "no_exit_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "no_exit_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "no_exit_submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          team_leader_email: string
          team_leader_name: string
          team_leader_phone: string | null
          team_members: Json | null
          team_name: string
          updated_at: string | null
          user_id: string | null
          vault_unlocked: boolean
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          team_leader_email: string
          team_leader_name: string
          team_leader_phone?: string | null
          team_members?: Json | null
          team_name: string
          updated_at?: string | null
          user_id?: string | null
          vault_unlocked?: boolean
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          team_leader_email?: string
          team_leader_name?: string
          team_leader_phone?: string | null
          team_members?: Json | null
          team_name?: string
          updated_at?: string | null
          user_id?: string | null
          vault_unlocked?: boolean
        }
        Relationships: []
      }
      trail_of_shadows_questions: {
        Row: {
          answer: string
          created_at: string | null
          description: string
          id: number
          points: number
          title: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          description: string
          id: number
          points?: number
          title: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          description?: string
          id?: number
          points?: number
          title?: string
        }
        Relationships: []
      }
      trail_of_shadows_submissions: {
        Row: {
          id: string
          is_correct: boolean
          points_awarded: number
          question_id: number
          submitted_answer: string
          submitted_at: string | null
          team_id: string
        }
        Insert: {
          id?: string
          is_correct: boolean
          points_awarded?: number
          question_id: number
          submitted_answer: string
          submitted_at?: string | null
          team_id: string
        }
        Update: {
          id?: string
          is_correct?: boolean
          points_awarded?: number
          question_id?: number
          submitted_answer?: string
          submitted_at?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_of_shadows_submissions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "trail_of_shadows_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_of_shadows_submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

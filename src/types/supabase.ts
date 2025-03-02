export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          location: string
          job_type: string
          salary_range: string
          application_date: string
          status: string
          notes: string | null
          url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          position: string
          location: string
          job_type: string
          salary_range: string
          application_date: string
          status: string
          notes?: string | null
          url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          position?: string
          location?: string
          job_type?: string
          salary_range?: string
          application_date?: string
          status?: string
          notes?: string | null
          url?: string | null
          created_at?: string
        }
      }
      interviews: {
        Row: {
          id: string
          job_id: string
          interview_date: string
          interview_type: string
          interviewer: string | null
          notes: string | null
          result: string
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          interview_date: string
          interview_type: string
          interviewer?: string | null
          notes?: string | null
          result: string
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          interview_date?: string
          interview_type?: string
          interviewer?: string | null
          notes?: string | null
          result?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
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
  }
}
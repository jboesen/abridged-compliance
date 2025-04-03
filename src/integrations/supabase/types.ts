export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          sender_type: string | null
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          sender_type?: string | null
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          id: string
          project_name: string
          updated_at: string
          user_id: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_name: string
          updated_at?: string
          user_id: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_name?: string
          updated_at?: string
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_payments: {
        Row: {
          amount: number
          created_at: string
          creator_id: string
          id: string
          paid_at: string | null
          payment_id: string | null
          status: string | null
          workflow_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          creator_id: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          status?: string | null
          workflow_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          creator_id?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          status?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_payments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_payments_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          company_name: string | null
          created_at: string
          description: string | null
          id: string
          stripe_account_id: string | null
          updated_at: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          id: string
          stripe_account_id?: string | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          stripe_account_id?: string | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount: number
          id: string
          payment_id: string | null
          purchased_at: string
          status: string | null
          user_id: string
          workflow_id: string
        }
        Insert: {
          amount: number
          id?: string
          payment_id?: string | null
          purchased_at?: string
          status?: string | null
          user_id: string
          workflow_id: string
        }
        Update: {
          amount?: number
          id?: string
          payment_id?: string | null
          purchased_at?: string
          status?: string | null
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_purchases_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          agency: string | null
          benefits: string[] | null
          content: Json | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          permit_type: string | null
          price: number
          status: string | null
          title: string
          updated_at: string
          use_cases: string[] | null
          verified: boolean | null
        }
        Insert: {
          agency?: string | null
          benefits?: string[] | null
          content?: Json | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          permit_type?: string | null
          price: number
          status?: string | null
          title: string
          updated_at?: string
          use_cases?: string[] | null
          verified?: boolean | null
        }
        Update: {
          agency?: string | null
          benefits?: string[] | null
          content?: Json | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          permit_type?: string | null
          price?: number
          status?: string | null
          title?: string
          updated_at?: string
          use_cases?: string[] | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "workflows_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

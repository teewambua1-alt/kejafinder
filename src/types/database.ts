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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          notes: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          notes?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          granted_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          category: string | null
          created_at: string
          id: string
          listing_id: string
          position: number
          storage_path: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          listing_id: string
          position?: number
          storage_path: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          position?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_reports: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          message: string | null
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          agent_fee: number
          amenities: string[]
          availability_status: string
          bathroom_type: string | null
          call_clicks_count: number
          contact_name: string
          contact_phone: string
          contact_role: string
          county: string
          created_at: string
          deposit_amount: number
          description: string | null
          distance_from_road: string | null
          electricity_type: string | null
          estate: string
          expires_at: string | null
          floor_level: string | null
          house_type: string
          id: string
          is_available: boolean
          is_featured: boolean
          landmark: string | null
          lat: number | null
          lng: number | null
          moderation_status: string
          monthly_rent: number
          owner_id: string
          report_count: number
          search_vector: unknown
          security: string | null
          title: string
          toilet_type: string | null
          town: string
          updated_at: string
          verification_level: string
          viewing_fee: number
          views_count: number
          water_charge: string | null
          whatsapp_clicks_count: number
          whatsapp_phone: string | null
        }
        Insert: {
          agent_fee?: number
          amenities?: string[]
          availability_status?: string
          bathroom_type?: string | null
          call_clicks_count?: number
          contact_name: string
          contact_phone: string
          contact_role: string
          county: string
          created_at?: string
          deposit_amount?: number
          description?: string | null
          distance_from_road?: string | null
          electricity_type?: string | null
          estate: string
          expires_at?: string | null
          floor_level?: string | null
          house_type: string
          id?: string
          is_available?: boolean
          is_featured?: boolean
          landmark?: string | null
          lat?: number | null
          lng?: number | null
          moderation_status?: string
          monthly_rent: number
          owner_id: string
          report_count?: number
          search_vector?: unknown
          security?: string | null
          title: string
          toilet_type?: string | null
          town: string
          updated_at?: string
          verification_level?: string
          viewing_fee?: number
          views_count?: number
          water_charge?: string | null
          whatsapp_clicks_count?: number
          whatsapp_phone?: string | null
        }
        Update: {
          agent_fee?: number
          amenities?: string[]
          availability_status?: string
          bathroom_type?: string | null
          call_clicks_count?: number
          contact_name?: string
          contact_phone?: string
          contact_role?: string
          county?: string
          created_at?: string
          deposit_amount?: number
          description?: string | null
          distance_from_road?: string | null
          electricity_type?: string | null
          estate?: string
          expires_at?: string | null
          floor_level?: string | null
          house_type?: string
          id?: string
          is_available?: boolean
          is_featured?: boolean
          landmark?: string | null
          lat?: number | null
          lng?: number | null
          moderation_status?: string
          monthly_rent?: number
          owner_id?: string
          report_count?: number
          search_vector?: unknown
          security?: string | null
          title?: string
          toilet_type?: string | null
          town?: string
          updated_at?: string
          verification_level?: string
          viewing_fee?: number
          views_count?: number
          water_charge?: string | null
          whatsapp_clicks_count?: number
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          county: string | null
          created_at: string
          email: string | null
          estate: string | null
          full_name: string
          id: string
          is_id_verified: boolean
          is_phone_verified: boolean
          phone: string
          role: string
          town: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          estate?: string | null
          full_name: string
          id: string
          is_id_verified?: boolean
          is_phone_verified?: boolean
          phone: string
          role?: string
          town?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          estate?: string | null
          full_name?: string
          id?: string
          is_id_verified?: boolean
          is_phone_verified?: boolean
          phone?: string
          role?: string
          town?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_listings: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string
          filters: Json
          id: string
          label: string
          query: string
          sort: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          label: string
          query?: string
          sort?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          label?: string
          query?: string
          sort?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          created_at: string
          id: string
          listing_id: string | null
          notes: string | null
          request_type: string
          requester_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          request_type: string
          requester_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          request_type?: string
          requester_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_moderate_listing: {
        Args: { p_action: string; p_listing_id: string; p_notes?: string }
        Returns: {
          agent_fee: number
          amenities: string[]
          availability_status: string
          bathroom_type: string | null
          call_clicks_count: number
          contact_name: string
          contact_phone: string
          contact_role: string
          county: string
          created_at: string
          deposit_amount: number
          description: string | null
          distance_from_road: string | null
          electricity_type: string | null
          estate: string
          expires_at: string | null
          floor_level: string | null
          house_type: string
          id: string
          is_available: boolean
          is_featured: boolean
          landmark: string | null
          lat: number | null
          lng: number | null
          moderation_status: string
          monthly_rent: number
          owner_id: string
          report_count: number
          search_vector: unknown
          security: string | null
          title: string
          toilet_type: string | null
          town: string
          updated_at: string
          verification_level: string
          viewing_fee: number
          views_count: number
          water_charge: string | null
          whatsapp_clicks_count: number
          whatsapp_phone: string | null
        }
        SetofOptions: {
          from: "*"
          to: "listings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      earth: { Args: never; Returns: number }
      increment_contact_click: {
        Args: { p_click_type: string; p_listing_id: string }
        Returns: undefined
      }
      increment_listing_view: {
        Args: { p_listing_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      nearby_listings: {
        Args: { p_lat: number; p_lng: number; p_radius_km?: number }
        Returns: {
          agent_fee: number
          amenities: string[]
          availability_status: string
          bathroom_type: string | null
          call_clicks_count: number
          contact_name: string
          contact_phone: string
          contact_role: string
          county: string
          created_at: string
          deposit_amount: number
          description: string | null
          distance_from_road: string | null
          electricity_type: string | null
          estate: string
          expires_at: string | null
          floor_level: string | null
          house_type: string
          id: string
          is_available: boolean
          is_featured: boolean
          landmark: string | null
          lat: number | null
          lng: number | null
          moderation_status: string
          monthly_rent: number
          owner_id: string
          report_count: number
          search_vector: unknown
          security: string | null
          title: string
          toilet_type: string | null
          town: string
          updated_at: string
          verification_level: string
          viewing_fee: number
          views_count: number
          water_charge: string | null
          whatsapp_clicks_count: number
          whatsapp_phone: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "listings"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      set_listing_availability: {
        Args: { p_available: boolean; p_listing_id: string }
        Returns: {
          agent_fee: number
          amenities: string[]
          availability_status: string
          bathroom_type: string | null
          call_clicks_count: number
          contact_name: string
          contact_phone: string
          contact_role: string
          county: string
          created_at: string
          deposit_amount: number
          description: string | null
          distance_from_road: string | null
          electricity_type: string | null
          estate: string
          expires_at: string | null
          floor_level: string | null
          house_type: string
          id: string
          is_available: boolean
          is_featured: boolean
          landmark: string | null
          lat: number | null
          lng: number | null
          moderation_status: string
          monthly_rent: number
          owner_id: string
          report_count: number
          search_vector: unknown
          security: string | null
          title: string
          toilet_type: string | null
          town: string
          updated_at: string
          verification_level: string
          viewing_fee: number
          views_count: number
          water_charge: string | null
          whatsapp_clicks_count: number
          whatsapp_phone: string | null
        }
        SetofOptions: {
          from: "*"
          to: "listings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_listing_for_review: {
        Args: { p_listing_id: string }
        Returns: {
          agent_fee: number
          amenities: string[]
          availability_status: string
          bathroom_type: string | null
          call_clicks_count: number
          contact_name: string
          contact_phone: string
          contact_role: string
          county: string
          created_at: string
          deposit_amount: number
          description: string | null
          distance_from_road: string | null
          electricity_type: string | null
          estate: string
          expires_at: string | null
          floor_level: string | null
          house_type: string
          id: string
          is_available: boolean
          is_featured: boolean
          landmark: string | null
          lat: number | null
          lng: number | null
          moderation_status: string
          monthly_rent: number
          owner_id: string
          report_count: number
          search_vector: unknown
          security: string | null
          title: string
          toilet_type: string | null
          town: string
          updated_at: string
          verification_level: string
          viewing_fee: number
          views_count: number
          water_charge: string | null
          whatsapp_clicks_count: number
          whatsapp_phone: string | null
        }
        SetofOptions: {
          from: "*"
          to: "listings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

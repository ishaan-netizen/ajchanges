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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      camp_assignments: {
        Row: {
          assignment_date: string
          assignment_end_date: string
          camp_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          assignment_date?: string
          assignment_end_date?: string
          camp_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          assignment_date?: string
          assignment_end_date?: string
          camp_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "camp_assignments_camp_id_fkey"
            columns: ["camp_id"]
            isOneToOne: false
            referencedRelation: "camps"
            referencedColumns: ["id"]
          },
        ]
      }
      camps: {
        Row: {
          base_hospital: string | null
          block: string | null
          camp_code: string | null
          created_at: string | null
          date: string
          district: string | null
          id: string
          name: string
          state: string | null
          status: string | null
          vertical: string | null
          village: string | null
        }
        Insert: {
          base_hospital?: string | null
          block?: string | null
          camp_code?: string | null
          created_at?: string | null
          date?: string
          district?: string | null
          id?: string
          name: string
          state?: string | null
          status?: string | null
          vertical?: string | null
          village?: string | null
        }
        Update: {
          base_hospital?: string | null
          block?: string | null
          camp_code?: string | null
          created_at?: string | null
          date?: string
          district?: string | null
          id?: string
          name?: string
          state?: string | null
          status?: string | null
          vertical?: string | null
          village?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          aadhar_photo_url: string | null
          address_block: string | null
          address_district: string | null
          address_door: string | null
          address_pincode: string | null
          address_state: string | null
          address_village: string | null
          advance_amount: number | null
          advance_collected: boolean | null
          age: number | null
          amount_collected: number | null
          camp_id: string
          chief_complaint: string[] | null
          chief_complaint_other: string | null
          conjunctiva_le: string | null
          conjunctiva_re: string | null
          consent_given: boolean | null
          cornea_le: string | null
          cornea_re: string | null
          counselled_by: string | null
          created_at: string | null
          diagnosis: string[] | null
          diagnosis_other: string | null
          dob: string | null
          dob_status: string | null
          examined_by: string | null
          eye_image_le_url: string | null
          eye_image_re_url: string | null
          full_name: string
          fundus_le: string | null
          fundus_re: string | null
          gender: string | null
          glass_power: string | null
          glass_power_le: string | null
          glass_power_re: string | null
          guardian_mandatory: boolean | null
          guardian_name: string | null
          id: string
          id_proof_number: string | null
          id_proof_type: string | null
          iris_le: string | null
          iris_re: string | null
          lens_le: string | null
          lens_re: string | null
          lens_type: string | null
          medicine: string | null
          medicine_other: string | null
          patient_photo_url: string | null
          patient_type: string | null
          phone: string | null
          phone_relationship: string | null
          pupil_le: string | null
          pupil_re: string | null
          referral_center: string | null
          referral_id: string | null
          referral_needed: boolean | null
          referral_purpose: string | null
          registered_by: string | null
          signature_url: string | null
          spectacles_given: boolean | null
          spectacles_payment_type: string | null
          spectacles_power: string | null
          status: string | null
          systemic_disease: string[] | null
          systemic_disease_other: string | null
          unique_id: string | null
          updated_at: string | null
          vision_le_dist: string | null
          vision_le_near: string | null
          vision_le_pinhole: string | null
          vision_re_dist: string | null
          vision_re_near: string | null
          vision_re_pinhole: string | null
          wears_glasses: boolean | null
        }
        Insert: {
          aadhar_photo_url?: string | null
          address_block?: string | null
          address_district?: string | null
          address_door?: string | null
          address_pincode?: string | null
          address_state?: string | null
          address_village?: string | null
          advance_amount?: number | null
          advance_collected?: boolean | null
          age?: number | null
          amount_collected?: number | null
          camp_id: string
          chief_complaint?: string[] | null
          chief_complaint_other?: string | null
          conjunctiva_le?: string | null
          conjunctiva_re?: string | null
          consent_given?: boolean | null
          cornea_le?: string | null
          cornea_re?: string | null
          counselled_by?: string | null
          created_at?: string | null
          diagnosis?: string[] | null
          diagnosis_other?: string | null
          dob?: string | null
          dob_status?: string | null
          examined_by?: string | null
          eye_image_le_url?: string | null
          eye_image_re_url?: string | null
          full_name: string
          fundus_le?: string | null
          fundus_re?: string | null
          gender?: string | null
          glass_power?: string | null
          glass_power_le?: string | null
          glass_power_re?: string | null
          guardian_mandatory?: boolean | null
          guardian_name?: string | null
          id?: string
          id_proof_number?: string | null
          id_proof_type?: string | null
          iris_le?: string | null
          iris_re?: string | null
          lens_le?: string | null
          lens_re?: string | null
          lens_type?: string | null
          medicine?: string | null
          medicine_other?: string | null
          patient_photo_url?: string | null
          patient_type?: string | null
          phone?: string | null
          phone_relationship?: string | null
          pupil_le?: string | null
          pupil_re?: string | null
          referral_center?: string | null
          referral_id?: string | null
          referral_needed?: boolean | null
          referral_purpose?: string | null
          registered_by?: string | null
          signature_url?: string | null
          spectacles_given?: boolean | null
          spectacles_payment_type?: string | null
          spectacles_power?: string | null
          status?: string | null
          systemic_disease?: string[] | null
          systemic_disease_other?: string | null
          unique_id?: string | null
          updated_at?: string | null
          vision_le_dist?: string | null
          vision_le_near?: string | null
          vision_le_pinhole?: string | null
          vision_re_dist?: string | null
          vision_re_near?: string | null
          vision_re_pinhole?: string | null
          wears_glasses?: boolean | null
        }
        Update: {
          aadhar_photo_url?: string | null
          address_block?: string | null
          address_district?: string | null
          address_door?: string | null
          address_pincode?: string | null
          address_state?: string | null
          address_village?: string | null
          advance_amount?: number | null
          advance_collected?: boolean | null
          age?: number | null
          amount_collected?: number | null
          camp_id?: string
          chief_complaint?: string[] | null
          chief_complaint_other?: string | null
          conjunctiva_le?: string | null
          conjunctiva_re?: string | null
          consent_given?: boolean | null
          cornea_le?: string | null
          cornea_re?: string | null
          counselled_by?: string | null
          created_at?: string | null
          diagnosis?: string[] | null
          diagnosis_other?: string | null
          dob?: string | null
          dob_status?: string | null
          examined_by?: string | null
          eye_image_le_url?: string | null
          eye_image_re_url?: string | null
          full_name?: string
          fundus_le?: string | null
          fundus_re?: string | null
          gender?: string | null
          glass_power?: string | null
          glass_power_le?: string | null
          glass_power_re?: string | null
          guardian_mandatory?: boolean | null
          guardian_name?: string | null
          id?: string
          id_proof_number?: string | null
          id_proof_type?: string | null
          iris_le?: string | null
          iris_re?: string | null
          lens_le?: string | null
          lens_re?: string | null
          lens_type?: string | null
          medicine?: string | null
          medicine_other?: string | null
          patient_photo_url?: string | null
          patient_type?: string | null
          phone?: string | null
          phone_relationship?: string | null
          pupil_le?: string | null
          pupil_re?: string | null
          referral_center?: string | null
          referral_id?: string | null
          referral_needed?: boolean | null
          referral_purpose?: string | null
          registered_by?: string | null
          signature_url?: string | null
          spectacles_given?: boolean | null
          spectacles_payment_type?: string | null
          spectacles_power?: string | null
          status?: string | null
          systemic_disease?: string[] | null
          systemic_disease_other?: string | null
          unique_id?: string | null
          updated_at?: string | null
          vision_le_dist?: string | null
          vision_le_near?: string | null
          vision_le_pinhole?: string | null
          vision_re_dist?: string | null
          vision_re_near?: string | null
          vision_re_pinhole?: string | null
          wears_glasses?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_camp_id_fkey"
            columns: ["camp_id"]
            isOneToOne: false
            referencedRelation: "camps"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "registrar" | "optometrist" | "counsellor"
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
    Enums: {
      app_role: ["registrar", "optometrist", "counsellor"],
    },
  },
} as const

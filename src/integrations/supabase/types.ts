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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          diff: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cancer_cases: {
        Row: {
          alcool: string | null
          anomalies_moleculaires: string | null
          base_diagnostic: string | null
          biologie_date: string | null
          biologie_fns: string | null
          biologie_globules: string | null
          cause_deces: string | null
          code_icdo: string | null
          comportement: string | null
          created_at: string
          created_by: string | null
          date_anapath: string | null
          date_deces: string | null
          date_derniere_nouvelle: string | null
          date_diagnostic: string
          grade: string | null
          id: string
          lateralite: string | null
          medecin_anapath: string | null
          methode_diagnostic: string | null
          milieu: string | null
          morphologie_icdo: string | null
          notes: string | null
          patient_id: string
          profession: string | null
          ref_anapath: string | null
          resultat_anapath: string | null
          source_info: string | null
          sous_type_cancer: string | null
          sportif: string | null
          stade_tnm: string | null
          statut: string
          statut_vital: string | null
          symptomes: string | null
          tabagisme: string | null
          topographie_icdo: string | null
          type_cancer: string
          updated_at: string
          valide_le: string | null
          valide_par_medecin_id: string | null
          valide_par_registreur_id: string | null
        }
        Insert: {
          alcool?: string | null
          anomalies_moleculaires?: string | null
          base_diagnostic?: string | null
          biologie_date?: string | null
          biologie_fns?: string | null
          biologie_globules?: string | null
          cause_deces?: string | null
          code_icdo?: string | null
          comportement?: string | null
          created_at?: string
          created_by?: string | null
          date_anapath?: string | null
          date_deces?: string | null
          date_derniere_nouvelle?: string | null
          date_diagnostic: string
          grade?: string | null
          id?: string
          lateralite?: string | null
          medecin_anapath?: string | null
          methode_diagnostic?: string | null
          milieu?: string | null
          morphologie_icdo?: string | null
          notes?: string | null
          patient_id: string
          profession?: string | null
          ref_anapath?: string | null
          resultat_anapath?: string | null
          source_info?: string | null
          sous_type_cancer?: string | null
          sportif?: string | null
          stade_tnm?: string | null
          statut?: string
          statut_vital?: string | null
          symptomes?: string | null
          tabagisme?: string | null
          topographie_icdo?: string | null
          type_cancer: string
          updated_at?: string
          valide_le?: string | null
          valide_par_medecin_id?: string | null
          valide_par_registreur_id?: string | null
        }
        Update: {
          alcool?: string | null
          anomalies_moleculaires?: string | null
          base_diagnostic?: string | null
          biologie_date?: string | null
          biologie_fns?: string | null
          biologie_globules?: string | null
          cause_deces?: string | null
          code_icdo?: string | null
          comportement?: string | null
          created_at?: string
          created_by?: string | null
          date_anapath?: string | null
          date_deces?: string | null
          date_derniere_nouvelle?: string | null
          date_diagnostic?: string
          grade?: string | null
          id?: string
          lateralite?: string | null
          medecin_anapath?: string | null
          methode_diagnostic?: string | null
          milieu?: string | null
          morphologie_icdo?: string | null
          notes?: string | null
          patient_id?: string
          profession?: string | null
          ref_anapath?: string | null
          resultat_anapath?: string | null
          source_info?: string | null
          sous_type_cancer?: string | null
          sportif?: string | null
          stade_tnm?: string | null
          statut?: string
          statut_vital?: string | null
          symptomes?: string | null
          tabagisme?: string | null
          topographie_icdo?: string | null
          type_cancer?: string
          updated_at?: string
          valide_le?: string | null
          valide_par_medecin_id?: string | null
          valide_par_registreur_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cancer_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      cancer_rechutes: {
        Row: {
          case_id: string
          created_at: string
          created_by: string | null
          date_evenement: string
          description: string | null
          id: string
          localisation: string | null
          stade_tnm: string | null
          traitement_propose: string | null
          type_evenement: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by?: string | null
          date_evenement: string
          description?: string | null
          id?: string
          localisation?: string | null
          stade_tnm?: string | null
          traitement_propose?: string | null
          type_evenement?: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string | null
          date_evenement?: string
          description?: string | null
          id?: string
          localisation?: string | null
          stade_tnm?: string | null
          traitement_propose?: string | null
          type_evenement?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cancer_rechutes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cancer_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_comments: {
        Row: {
          case_id: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          case_id: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          case_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_comments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cancer_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          created_at: string
          field_label: string
          field_name: string
          field_type: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          options: Json | null
          sort_order: number | null
          tab_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_label: string
          field_name: string
          field_type?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          options?: Json | null
          sort_order?: number | null
          tab_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_label?: string
          field_name?: string
          field_type?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          options?: Json | null
          sort_order?: number | null
          tab_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_access_requests: {
        Row: {
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          export_path: string | null
          fields_requested: Json
          filters: Json | null
          id: string
          institution: string
          justification: string
          project_title: string
          requester_id: string | null
          researcher_email: string
          researcher_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          export_path?: string | null
          fields_requested?: Json
          filters?: Json | null
          id?: string
          institution: string
          justification: string
          project_title: string
          requester_id?: string | null
          researcher_email: string
          researcher_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          export_path?: string | null
          fields_requested?: Json
          filters?: Json | null
          id?: string
          institution?: string
          justification?: string
          project_title?: string
          requester_id?: string | null
          researcher_email?: string
          researcher_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dismissed_duplicates: {
        Row: {
          created_at: string
          dismissed_by: string | null
          id: string
          patient_a_id: string
          patient_b_id: string
          raison: string | null
        }
        Insert: {
          created_at?: string
          dismissed_by?: string | null
          id?: string
          patient_a_id: string
          patient_b_id: string
          raison?: string | null
        }
        Update: {
          created_at?: string
          dismissed_by?: string | null
          id?: string
          patient_a_id?: string
          patient_b_id?: string
          raison?: string | null
        }
        Relationships: []
      }
      form_config: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean | null
          label: string
          parent_value: string | null
          sort_order: number | null
          updated_at: string
          value: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          label: string
          parent_value?: string | null
          sort_order?: number | null
          updated_at?: string
          value: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          label?: string
          parent_value?: string | null
          sort_order?: number | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      geo_saved_maps: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      geo_zone_group_items: {
        Row: {
          created_at: string
          custom_geometry: Json | null
          group_id: string
          id: string
          zone_code: string
          zone_name: string
          zone_type: string
        }
        Insert: {
          created_at?: string
          custom_geometry?: Json | null
          group_id: string
          id?: string
          zone_code: string
          zone_name: string
          zone_type?: string
        }
        Update: {
          created_at?: string
          custom_geometry?: Json | null
          group_id?: string
          id?: string
          zone_code?: string
          zone_name?: string
          zone_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "geo_zone_group_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "geo_zone_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_zone_groups: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_files: {
        Row: {
          case_id: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          mime_type: string | null
          notes: string | null
          patient_id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number
          file_type?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          patient_id: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          patient_id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_files_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cancer_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_files_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          adresse: string | null
          code_patient: string
          commune: string | null
          created_at: string
          created_by: string | null
          date_naissance: string | null
          id: string
          nom: string
          num_dossier: string | null
          prenom: string
          sexe: string
          telephone: string | null
          updated_at: string
          wilaya: string
        }
        Insert: {
          adresse?: string | null
          code_patient: string
          commune?: string | null
          created_at?: string
          created_by?: string | null
          date_naissance?: string | null
          id?: string
          nom: string
          num_dossier?: string | null
          prenom: string
          sexe: string
          telephone?: string | null
          updated_at?: string
          wilaya?: string
        }
        Update: {
          adresse?: string | null
          code_patient?: string
          commune?: string | null
          created_at?: string
          created_by?: string | null
          date_naissance?: string | null
          id?: string
          nom?: string
          num_dossier?: string | null
          prenom?: string
          sexe?: string
          telephone?: string | null
          updated_at?: string
          wilaya?: string
        }
        Relationships: []
      }
      population_reference: {
        Row: {
          annee: number
          created_at: string
          id: string
          population: number
          sexe: string
          tranche_age: string
          wilaya: string
        }
        Insert: {
          annee: number
          created_at?: string
          id?: string
          population?: number
          sexe: string
          tranche_age: string
          wilaya?: string
        }
        Update: {
          annee?: number
          created_at?: string
          id?: string
          population?: number
          sexe?: string
          tranche_age?: string
          wilaya?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quality_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          message: string
          metrics: Json | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          message: string
          metrics?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          metrics?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
        }
        Relationships: []
      }
      traitements: {
        Row: {
          case_id: string
          created_at: string
          created_by: string | null
          date_debut: string
          date_fin: string | null
          effets_secondaires: string | null
          efficacite: string | null
          id: string
          medecin_traitant: string | null
          notes: string | null
          protocole: string | null
          type_traitement: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by?: string | null
          date_debut: string
          date_fin?: string | null
          effets_secondaires?: string | null
          efficacite?: string | null
          id?: string
          medecin_traitant?: string | null
          notes?: string | null
          protocole?: string | null
          type_traitement: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string | null
          date_debut?: string
          date_fin?: string | null
          effets_secondaires?: string | null
          efficacite?: string | null
          id?: string
          medecin_traitant?: string | null
          notes?: string | null
          protocole?: string | null
          type_traitement?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "traitements_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cancer_cases"
            referencedColumns: ["id"]
          },
        ]
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
      app_role:
        | "admin"
        | "medecin"
        | "epidemiologiste"
        | "anapath"
        | "assistante"
        | "medecin_valideur"
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
      app_role: [
        "admin",
        "medecin",
        "epidemiologiste",
        "anapath",
        "assistante",
        "medecin_valideur",
      ],
    },
  },
} as const

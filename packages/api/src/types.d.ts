
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
      activity: {
        Row: {
          created_at: string | null
          icon: string
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          icon: string
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_activity: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_activity?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_activity?: string | null
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      record: {
        Row: {
          activity_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "record_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      record_30_day_view: {
        Row: {
          activity_id: string | null
          count: number | null
          month: string | null
          year: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activity"
            referencedColumns: ["id"]
          }
        ]
      }
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


export type ActivityProps = Database["public"]["Tables"]["activity"]["Row"];
export type RecordProps = Database["public"]["Tables"]["record"]["Row"];
export type RecordWithRelationsProps = RecordProps & {
  activity: ActivityProps;
};
type CounterTimeProps = {
  hours: number;
  minutes: number;
  days: number;
  seconds: number;
};
export type RecordWithCounterProps = RecordWithRelationsProps & {
  counter: number;
  counterTime?: CounterTimeProps;
};

export type TimeSpendProps = {
  dayStart: Date;
  dayEnd: Date;
  counter: number;
  counterTime: CounterTimeProps;
  formatedDate: string;
};

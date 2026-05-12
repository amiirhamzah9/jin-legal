export type Database = {
  public: {
    Tables: {
      practice_areas: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          full_content: string | null;
          services: string[] | null;
          icon_name: string;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["practice_areas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["practice_areas"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          credentials: string | null;
          role: string;
          bio: string | null;
          photo_url: string | null;
          practice_areas: string[] | null;
          slug: string | null;
          practice_group: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["team_members"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          category: string | null;
          author_id: string | null;
          published_at: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      careers: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          location: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["careers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["careers"]["Insert"]>;
        Relationships: [];
      };
      contact_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_leads"]["Row"], "id" | "created_at" | "is_read"> & {
          is_read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["contact_leads"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

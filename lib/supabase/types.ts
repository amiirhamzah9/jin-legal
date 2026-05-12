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
          icon_name: string;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["practice_areas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["practice_areas"]["Insert"]>;
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
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["team_members"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
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
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_leads"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contact_leads"]["Insert"]>;
      };
    };
  };
};

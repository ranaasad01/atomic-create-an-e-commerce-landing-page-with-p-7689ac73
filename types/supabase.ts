// Auto-generated from the connected Supabase schema. Do not edit by hand.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: string;
          original_price: string | null;
          category: string;
          image_url: string | null;
          rating: string | null;
          review_count: number | null;
          is_on_sale: boolean;
          stock: number;
          created_at: string;
        };
      };
    };
  };
}

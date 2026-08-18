import type { CatalogMode } from "@/types/product";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getCatalogMode(): CatalogMode {
  return hasSupabaseConfig() ? "supabase" : "demo";
}

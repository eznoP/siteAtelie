export interface ProductProperty {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  category: string;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  properties: ProductProperty[];
  position: number;
  active: boolean;
  showWhenOutOfStock: boolean;
}

export type ProductDraft = Omit<Product, "id"> & { id?: string };

export type CatalogMode = "demo" | "supabase";

import "server-only";

import { demoProducts } from "@/data/demo-products";
import { getVisibleProducts, orderProducts } from "@/lib/products/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import type { Product, ProductDraft, ProductProperty } from "@/types/product";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[] | null;
  category: string;
  price: number | string;
  stock: number;
  sizes: string[] | null;
  colors: string[] | null;
  properties: ProductProperty[] | null;
  position: number;
  active: boolean;
  show_when_out_of_stock: boolean;
};

export class AuthorizationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    images: row.images ?? [],
    category: row.category,
    price: Number(row.price),
    stock: row.stock,
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    properties: row.properties ?? [],
    position: row.position,
    active: row.active,
    showWhenOutOfStock: row.show_when_out_of_stock,
  };
}

function productToRow(product: ProductDraft) {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    images: product.images,
    category: product.category,
    price: product.price,
    stock: product.stock,
    sizes: product.sizes,
    colors: product.colors,
    properties: product.properties,
    position: product.position,
    active: product.active,
    show_when_out_of_stock: product.showWhenOutOfStock,
  };
}

export async function getPublicProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig()) return getVisibleProducts(demoProducts);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("position", { ascending: true });

  if (error) throw new Error(`Falha ao carregar produtos: ${error.message}`);

  return getVisibleProducts((data as ProductRow[]).map(rowToProduct));
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthorizationError("Faça login para continuar.", 401);
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    throw new AuthorizationError("Usuário sem acesso administrativo.", 403);
  }

  return { supabase, user };
}

export async function getAdminProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig()) return orderProducts(demoProducts);

  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw new Error(`Falha ao carregar produtos: ${error.message}`);
  return orderProducts((data as ProductRow[]).map(rowToProduct));
}

export async function createProduct(product: ProductDraft): Promise<Product> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .insert(productToRow(product))
    .select("*")
    .single();

  if (error) throw new Error(`Falha ao criar produto: ${error.message}`);
  return rowToProduct(data as ProductRow);
}

export async function updateProduct(
  id: string,
  patch: Partial<ProductDraft>,
): Promise<Product> {
  const { supabase } = await requireAdmin();
  const row = productToRow({
    name: "",
    slug: "",
    description: "",
    images: [],
    category: "",
    price: 0,
    stock: 0,
    sizes: [],
    colors: [],
    properties: [],
    position: 0,
    active: true,
    showWhenOutOfStock: true,
    ...patch,
  });
  const allowedKeys = new Set(
    Object.keys(patch).map((key) =>
      key === "showWhenOutOfStock" ? "show_when_out_of_stock" : key,
    ),
  );
  const partialRow = Object.fromEntries(
    Object.entries(row).filter(([key]) => allowedKeys.has(key)),
  );

  const { data, error } = await supabase
    .from("products")
    .update(partialRow)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`Falha ao atualizar produto: ${error.message}`);
  return rowToProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir produto: ${error.message}`);
}

export async function reorderProducts(
  positions: Array<{ id: string; position: number }>,
): Promise<void> {
  const { supabase } = await requireAdmin();
  const updates = await Promise.all(
    positions.map(({ id, position }) =>
      supabase.from("products").update({ position }).eq("id", id),
    ),
  );
  const failed = updates.find(({ error }) => error);

  if (failed?.error) {
    throw new Error(`Falha ao reordenar produtos: ${failed.error.message}`);
  }
}

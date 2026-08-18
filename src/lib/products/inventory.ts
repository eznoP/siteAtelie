import type { Product } from "@/types/product";

export type StockStatus = "available" | "low" | "unavailable";

export function getStockStatus(product: Pick<Product, "stock">): StockStatus {
  if (product.stock <= 0) return "unavailable";
  if (product.stock <= 2) return "low";
  return "available";
}

export function getStockLabel(product: Pick<Product, "stock">): string {
  const status = getStockStatus(product);

  if (status === "unavailable") return "Indisponível";
  if (status === "low") return `Última${product.stock > 1 ? "s" : ""} ${product.stock}`;
  return "Disponível";
}

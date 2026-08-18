import type { Product } from "@/types/product";

export function orderProducts(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => a.position - b.position || a.name.localeCompare(b.name, "pt-BR"),
  );
}

export function getVisibleProducts(products: Product[]): Product[] {
  return orderProducts(products).filter(
    (product) =>
      product.active && (product.stock > 0 || product.showWhenOutOfStock),
  );
}

export function normalizePositions(products: Product[]): Product[] {
  // A ordem do array é a intenção do usuário (setas/arraste).
  // Reordenar novamente pelos positions antigos aqui desfazia a alteração.
  return products.map((product, position) => ({
    ...product,
    position,
  }));
}

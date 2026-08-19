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

export function moveProductToTarget(
  products: Product[],
  sourceId: string,
  targetId: string,
): Product[] {
  if (sourceId === targetId) return normalizePositions(products);

  const ordered = orderProducts(products);
  const sourceIndex = ordered.findIndex(({ id }) => id === sourceId);
  const targetIndex = ordered.findIndex(({ id }) => id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return normalizePositions(ordered);

  const next = [...ordered];
  const [moved] = next.splice(sourceIndex, 1);
  const adjustedTarget = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  next.splice(adjustedTarget, 0, moved);
  return normalizePositions(next);
}

export function moveProductByOffset(
  products: Product[],
  productId: string,
  direction: -1 | 1,
): Product[] {
  const ordered = orderProducts(products);
  const index = ordered.findIndex(({ id }) => id === productId);
  const targetIndex = index + direction;

  if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) {
    return normalizePositions(ordered);
  }

  const next = [...ordered];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return normalizePositions(next);
}

import { describe, expect, it } from "vitest";
import { demoProducts } from "@/data/demo-products";
import {
  getVisibleProducts,
  normalizePositions,
  orderProducts,
} from "@/lib/products/catalog";

describe("catálogo", () => {
  it("respeita a ordem definida pelo ateliê", () => {
    const unordered = [demoProducts[3], demoProducts[0], demoProducts[2]];
    expect(orderProducts(unordered).map(({ position }) => position)).toEqual([
      0, 2, 3,
    ]);
  });

  it("preserva a nova ordem enviada pelo painel ao recalcular posições", () => {
    const reordered = [demoProducts[2], demoProducts[0], demoProducts[1]];
    const normalized = normalizePositions(reordered);

    expect(normalized.map(({ id }) => id)).toEqual(reordered.map(({ id }) => id));
    expect(normalized.map(({ position }) => position)).toEqual([0, 1, 2]);
  });

  it("recalcula as posições depois de uma exclusão", () => {
    const remaining = normalizePositions(
      demoProducts.filter((product) => product.position !== 2),
    );
    expect(remaining.map((product) => product.position)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(remaining[2].name).toBe("Manta Horizonte");
  });

  it("mantém sem estoque apenas quando configurado", () => {
    const hidden = { ...demoProducts[0], stock: 0, showWhenOutOfStock: false };
    const visible = { ...demoProducts[1], stock: 0, showWhenOutOfStock: true };
    expect(getVisibleProducts([hidden, visible])).toEqual([visible]);
  });
  it("remove produtos inativos da vitrine", () => {
    const inactive = { ...demoProducts[0], active: false };
    expect(getVisibleProducts([inactive])).toEqual([]);
  });
});

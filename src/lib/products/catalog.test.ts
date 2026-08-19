import { describe, expect, it } from "vitest";
import {
  getVisibleProducts,
  moveProductByOffset,
  moveProductToTarget,
  normalizePositions,
  orderProducts,
} from "@/lib/products/catalog";
import type { Product } from "@/types/product";

function product(id: string, position: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    name: `Produto ${id}`,
    slug: `produto-${id}`,
    description: "Produto usado apenas como fixture automatizada de teste.",
    images: ["/fixture.webp"],
    category: "Teste",
    price: 10,
    stock: 1,
    sizes: [],
    colors: [],
    properties: [],
    position,
    active: true,
    showWhenOutOfStock: true,
    ...overrides,
  };
}

const fixtures = [
  product("a", 0),
  product("b", 1),
  product("c", 2),
  product("d", 3),
];

describe("catálogo", () => {
  it("respeita a ordem definida pelo ateliê", () => {
    const unordered = [fixtures[3], fixtures[0], fixtures[2]];
    expect(orderProducts(unordered).map(({ position }) => position)).toEqual([0, 2, 3]);
  });

  it("preserva a nova ordem enviada pelo painel ao recalcular posições", () => {
    const reordered = [fixtures[2], fixtures[0], fixtures[1]];
    const normalized = normalizePositions(reordered);
    expect(normalized.map(({ id }) => id)).toEqual(reordered.map(({ id }) => id));
    expect(normalized.map(({ position }) => position)).toEqual([0, 1, 2]);
  });

  it("move uma peça pelas setas e recalcula todas as posições", () => {
    const ordered = orderProducts(fixtures);
    const moved = moveProductByOffset(ordered, ordered[1].id, 1);
    expect(moved[2].id).toBe(ordered[1].id);
    expect(moved.map(({ position }) => position)).toEqual(moved.map((_, index) => index));
  });

  it("move uma peça arrastada para antes do alvo", () => {
    const ordered = orderProducts(fixtures);
    const source = ordered[0];
    const target = ordered[3];
    const moved = moveProductToTarget(ordered, source.id, target.id);
    const targetIndex = moved.findIndex(({ id }) => id === target.id);
    expect(moved[targetIndex - 1].id).toBe(source.id);
    expect(moved.map(({ position }) => position)).toEqual(moved.map((_, index) => index));
  });

  it("recalcula as posições depois de uma exclusão", () => {
    const remaining = normalizePositions(fixtures.filter((item) => item.id !== "b"));
    expect(remaining.map(({ position }) => position)).toEqual([0, 1, 2]);
    expect(remaining.map(({ id }) => id)).toEqual(["a", "c", "d"]);
  });

  it("mantém sem estoque apenas quando configurado", () => {
    const hidden = product("hidden", 0, { stock: 0, showWhenOutOfStock: false });
    const visible = product("visible", 1, { stock: 0, showWhenOutOfStock: true });
    expect(getVisibleProducts([hidden, visible])).toEqual([visible]);
  });

  it("remove produtos inativos da vitrine", () => {
    const inactive = product("inactive", 0, { active: false });
    expect(getVisibleProducts([inactive])).toEqual([]);
  });
});

"use client";

import { useProducts } from "@/components/providers/ProductProvider";
import { getStockStatus } from "@/lib/products/inventory";
import type { Product } from "@/types/product";
import styles from "./admin.module.css";

export function StockManager({ product }: { product: Product }) {
  const { saveProduct, busy } = useProducts();

  async function changeStock(amount: number) {
    await saveProduct({
      ...product,
      stock: Math.max(0, product.stock + amount),
    });
  }

  return (
    <div className={styles.stockControl} data-status={getStockStatus(product)} aria-label={`Estoque de ${product.name}`}>
      <button type="button" disabled={busy || product.stock === 0} onClick={() => void changeStock(-1)} aria-label="Diminuir estoque">−</button>
      <output>{product.stock}</output>
      <button type="button" disabled={busy} onClick={() => void changeStock(1)} aria-label="Aumentar estoque">+</button>
    </div>
  );
}

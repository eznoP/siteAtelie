"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ProductImage } from "@/components/catalog/ProductImage";
import { useProducts } from "@/components/providers/ProductProvider";
import {
  moveProductByOffset,
  moveProductToTarget,
  orderProducts,
} from "@/lib/products/catalog";
import { formatCurrency } from "@/lib/products/format";
import { getStockLabel, getStockStatus } from "@/lib/products/inventory";
import type { Product } from "@/types/product";
import { StockManager } from "./StockManager";
import styles from "./admin.module.css";
import fixStyles from "./admin-v06.module.css";

export function ProductManager({ onEdit }: { onEdit: (product: Product) => void }) {
  const { products, removeProduct, reorder, busy, error } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [reorderMessage, setReorderMessage] = useState("");
  const deferredSearch = useDeferredValue(search);
  const orderedProducts = useMemo(() => orderProducts(products), [products]);
  const categories = [...new Set(orderedProducts.map((product) => product.category))].sort();
  const filteredProducts = orderedProducts.filter((product) => {
    const query = deferredSearch.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch =
      !query ||
      product.name.toLocaleLowerCase("pt-BR").includes(query) ||
      product.category.toLocaleLowerCase("pt-BR").includes(query);
    return matchesSearch && (category === "all" || product.category === category);
  });

  async function applyReorder(next: Product[], successMessage: string) {
    setReorderMessage("");
    try {
      await reorder(next);
      setReorderMessage(successMessage);
    } catch {
      // O provider já restaura a ordem anterior e expõe o erro.
    }
  }

  async function handleDrop(targetId: string, transferId?: string) {
    const sourceId = transferId || draggedId;
    if (!sourceId || sourceId === targetId) {
      setDraggedId(null);
      return;
    }

    const next = moveProductToTarget(orderedProducts, sourceId, targetId);
    setDraggedId(null);
    await applyReorder(next, "Ordem do catálogo atualizada.");
  }

  async function moveProduct(product: Product, direction: -1 | 1) {
    const next = moveProductByOffset(orderedProducts, product.id, direction);
    const currentIndex = orderedProducts.findIndex(({ id }) => id === product.id);
    const nextIndex = next.findIndex(({ id }) => id === product.id);
    if (currentIndex === nextIndex) return;
    await applyReorder(next, `${product.name} movida na ordem do catálogo.`);
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Excluir “${product.name}”? A coreografia será recalculada.`)) {
      return;
    }
    await removeProduct(product.id);
  }

  return (
    <section className={styles.manager} aria-labelledby="products-heading">
      <div className={styles.managerHeading}>
        <div>
          <p>Arraste pelo ícone ⠿ ou use as setas para alterar a ordem do catálogo.</p>
          <h2 id="products-heading">Produtos</h2>
        </div>
        <div className={styles.managerFilters}>
          <label>
            <span className="sr-only">Buscar produto</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar peça..."
            />
          </label>
          <label>
            <span className="sr-only">Filtrar por categoria</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Todas as categorias</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? <p className={styles.inlineError}>{error}</p> : null}
      <p className={fixStyles.reorderFeedback} role="status" aria-live="polite">{reorderMessage}</p>

      <div className={styles.productTable} role="table" aria-label="Produtos do catálogo">
        <div className={styles.tableHeader} role="row">
          <span role="columnheader">Ordem / peça</span>
          <span role="columnheader">Preço</span>
          <span role="columnheader">Estoque</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Ações</span>
        </div>

        {filteredProducts.map((product) => {
          const absoluteIndex = orderedProducts.findIndex(({ id }) => id === product.id);
          return (
            <div
              key={product.id}
              className={styles.productRow}
              role="row"
              data-dragging={draggedId === product.id}
              data-drop-target={Boolean(draggedId && draggedId !== product.id)}
              onDragOver={(event) => {
                if (!busy) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const sourceId = event.dataTransfer.getData("text/plain");
                if (!busy) void handleDrop(product.id, sourceId);
              }}
            >
              <div className={styles.productIdentity} role="cell">
                <button
                  type="button"
                  className={`${styles.dragHandle} ${fixStyles.dragHandle}`}
                  draggable={!busy}
                  disabled={busy}
                  aria-label={`Arrastar ${product.name} para mudar a ordem`}
                  title="Arraste para reordenar"
                  onDragStart={(event) => {
                    if (busy) {
                      event.preventDefault();
                      return;
                    }
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", product.id);
                    setDraggedId(product.id);
                    setReorderMessage("");
                  }}
                  onDragEnd={() => setDraggedId(null)}
                >
                  ⠿
                </button>
                <span className={styles.position}>{String(absoluteIndex + 1).padStart(2, "0")}</span>
                <figure>
                  <ProductImage product={product} sizes="58px" />
                </figure>
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>
              </div>
              <div className={styles.mobileLabel} aria-hidden="true">Preço</div>
              <span className={styles.rowPrice} role="cell">{formatCurrency(product.price)}</span>
              <div className={styles.mobileLabel} aria-hidden="true">Estoque</div>
              <div role="cell">
                <StockManager product={product} />
              </div>
              <div className={styles.mobileLabel} aria-hidden="true">Status</div>
              <div role="cell">
                <span className={styles.status} data-status={getStockStatus(product)}>
                  {product.active ? getStockLabel(product) : "Oculto"}
                </span>
              </div>
              <div className={styles.rowActions} role="cell">
                <button
                  type="button"
                  disabled={busy || absoluteIndex <= 0}
                  onClick={() => void moveProduct(product, -1)}
                  aria-label={`Mover ${product.name} para cima`}
                  title="Mover para cima"
                >↑</button>
                <button
                  type="button"
                  disabled={busy || absoluteIndex >= orderedProducts.length - 1}
                  onClick={() => void moveProduct(product, 1)}
                  aria-label={`Mover ${product.name} para baixo`}
                  title="Mover para baixo"
                >↓</button>
                <button type="button" disabled={busy} onClick={() => onEdit(product)}>Editar</button>
                <button className={styles.deleteButton} type="button" disabled={busy} onClick={() => void handleDelete(product)}>Excluir</button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 ? (
          <div className={styles.noResults}>Nenhuma peça corresponde aos filtros.</div>
        ) : null}
      </div>
    </section>
  );
}

"use client";

import { useDeferredValue, useState } from "react";
import { ProductImage } from "@/components/catalog/ProductImage";
import { useProducts } from "@/components/providers/ProductProvider";
import { formatCurrency } from "@/lib/products/format";
import { getStockLabel, getStockStatus } from "@/lib/products/inventory";
import type { Product } from "@/types/product";
import { StockManager } from "./StockManager";
import styles from "./admin.module.css";

export function ProductManager({ onEdit }: { onEdit: (product: Product) => void }) {
  const { products, removeProduct, reorder, busy, error } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const filteredProducts = products.filter((product) => {
    const query = deferredSearch.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch =
      !query ||
      product.name.toLocaleLowerCase("pt-BR").includes(query) ||
      product.category.toLocaleLowerCase("pt-BR").includes(query);
    return matchesSearch && (category === "all" || product.category === category);
  });

  async function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const sourceIndex = products.findIndex(({ id }) => id === draggedId);
    const targetIndex = products.findIndex(({ id }) => id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const next = [...products];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDraggedId(null);
    await reorder(next);
  }

  async function moveProduct(product: Product, direction: -1 | 1) {
    const index = products.findIndex(({ id }) => id === product.id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    const next = [...products];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    await reorder(next);
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
          <p>Arraste as peças para definir a ordem da coreografia.</p>
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

      <div className={styles.productTable} role="table" aria-label="Produtos do catálogo">
        <div className={styles.tableHeader} role="row">
          <span role="columnheader">Ordem / peça</span>
          <span role="columnheader">Preço</span>
          <span role="columnheader">Estoque</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Ações</span>
        </div>

        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={styles.productRow}
            role="row"
            draggable={!busy}
            data-dragging={draggedId === product.id}
            data-drop-target={Boolean(draggedId && draggedId !== product.id)}
            onDragStart={(event) => {
              if (busy) {
                event.preventDefault();
                return;
              }
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", product.id);
              setDraggedId(product.id);
            }}
            onDragEnd={() => setDraggedId(null)}
            onDragOver={(event) => {
              if (!busy) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!busy) void handleDrop(product.id);
            }}
          >
            <div className={styles.productIdentity} role="cell">
              <span className={styles.dragHandle} aria-hidden="true">⠿</span>
              <span className={styles.position}>{String(product.position + 1).padStart(2, "0")}</span>
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
                disabled={busy || product.position === 0}
                onClick={() => void moveProduct(product, -1)}
                aria-label={`Mover ${product.name} para cima`}
                title="Mover para cima"
              >↑</button>
              <button
                type="button"
                disabled={busy || product.position === products.length - 1}
                onClick={() => void moveProduct(product, 1)}
                aria-label={`Mover ${product.name} para baixo`}
                title="Mover para baixo"
              >↓</button>
              <button type="button" onClick={() => onEdit(product)}>Editar</button>
              <button className={styles.deleteButton} type="button" onClick={() => void handleDelete(product)}>Excluir</button>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 ? (
          <div className={styles.noResults}>Nenhuma peça corresponde aos filtros.</div>
        ) : null}
      </div>
    </section>
  );
}

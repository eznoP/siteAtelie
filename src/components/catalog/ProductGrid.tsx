"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/products/format";
import { getStockLabel, getStockStatus } from "@/lib/products/inventory";
import type { Product } from "@/types/product";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { ProductImage } from "./ProductImage";
import styles from "./catalog.module.css";

export function ProductGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function openProductDetails(product: Product) {
    setSelectedProduct(product);
  }

  function closeProductDetails() {
    setSelectedProduct(null);
  }

  return (
    <div className={styles.gridWrap}>
      <p className="sr-only" id="grid-description">
        Catálogo com {products.length} peças. Selecione uma para ver os detalhes.
      </p>
      <ul className={styles.productGrid} aria-describedby="grid-description">
        {products.map((product, index) => (
          <li key={product.id}>
            <article className={styles.gridCard}>
              <button
                className={styles.gridCardButton}
                type="button"
                aria-haspopup="dialog"
                onClick={() => openProductDetails(product)}
              >
                <figure className={styles.cardFigure}>
                  <ProductImage
                    product={product}
                    sizes="(max-width: 600px) 88vw, (max-width: 1000px) 44vw, 29vw"
                    priority={index < 2}
                  />
                </figure>
                <div className={styles.gridCardInfo}>
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <div>
                    <strong>{formatCurrency(product.price)}</strong>
                    <span data-status={getStockStatus(product)}>{getStockLabel(product)}</span>
                  </div>
                  <span className={styles.detailsLabel}>
                    Ver detalhes <i aria-hidden="true">↗</i>
                  </span>
                </div>
              </button>
            </article>
          </li>
        ))}
      </ul>
      {selectedProduct ? (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={closeProductDetails}
        />
      ) : null}
    </div>
  );
}

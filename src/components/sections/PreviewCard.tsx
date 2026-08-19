"use client";

import { ProductImage } from "@/components/catalog/ProductImage";
import { useProducts } from "@/components/providers/ProductProvider";
import { getVisibleProducts } from "@/lib/products/catalog";
import { formatCurrency } from "@/lib/products/format";
import styles from "./sections.module.css";

type PreviewCardProps = {
  index?: number;
  label?: string;
  emptyLabel?: string;
  emptyDescription?: string;
};

export function PreviewCard({
  index = 0,
  label = "Prévia da coleção",
  emptyLabel = "Prévia em breve...",
  emptyDescription = "As próximas peças da Belloca aparecerão aqui assim que o catálogo começar a ser publicado.",
}: PreviewCardProps) {
  const { products } = useProducts();
  const visibleProducts = getVisibleProducts(products);
  const product = visibleProducts[index] || null;

  if (!product) {
    return (
      <div className={styles.previewCard} data-empty="true">
        <div className={styles.previewPlaceholderMedia} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.previewContent}>
          <p>{label}</p>
          <strong>{emptyLabel}</strong>
          <small>{emptyDescription}</small>
        </div>
      </div>
    );
  }

  return (
    <article className={styles.previewCard}>
      <div className={styles.previewMedia}>
        <ProductImage
          product={product}
          priority={index === 0}
          sizes="(max-width: 760px) 80vw, 28vw"
        />
      </div>
      <div className={styles.previewContent}>
        <p>{product.category}</p>
        <strong>{product.name}</strong>
        <small>{formatCurrency(product.price)}</small>
      </div>
    </article>
  );
}

import { getVisibleProducts } from "@/lib/products/catalog";
import type { Product } from "@/types/product";
import { ProductGrid } from "./ProductGrid";
import styles from "./catalog.module.css";

export function Catalog({ products }: { products: Product[] }) {
  const visibleProducts = getVisibleProducts(products);

  return (
    <section id="catalogo" className={styles.catalog} aria-labelledby="catalog-title">
      <header className={styles.catalogHeader}>
        <p className={styles.eyebrow}>Catálogo</p>
        <h2 id="catalog-title">
          Nossas <em>peças.</em>
        </h2>
      </header>

      {visibleProducts.length ? (
        <ProductGrid products={visibleProducts} />
      ) : (
        <div className={styles.emptyCatalog}>
          <h3>Catálogo em atualização</h3>
        </div>
      )}
    </section>
  );
}

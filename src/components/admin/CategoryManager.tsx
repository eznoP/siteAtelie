import type { Product } from "@/types/product";
import styles from "./admin.module.css";

export function CategoryManager({ products }: { products: Product[] }) {
  const categories = [...new Set(products.map((product) => product.category))]
    .sort()
    .map((name) => ({
      name,
      count: products.filter((product) => product.category === name).length,
    }));

  return (
    <section className={styles.categories} aria-labelledby="categories-heading">
      <h2 id="categories-heading">Categorias</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.name}>
            <span>{category.name}</span>
            <strong>{category.count}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useProducts } from "@/components/providers/ProductProvider";
import { Catalog } from "./Catalog";

export function HomeCatalog() {
  const { products } = useProducts();

  return <Catalog products={products} />;
}

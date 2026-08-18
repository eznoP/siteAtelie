import Image from "next/image";
import { getProductImage } from "@/lib/products/format";
import type { Product } from "@/types/product";

export function ProductImage({
  product,
  sizes,
  priority = false,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
}) {
  const src = getProductImage(product);
  const unoptimized = src.endsWith(".svg") || src.startsWith("data:");

  return (
    <Image
      src={src}
      alt={`${product.name}, peça artesanal em crochê`}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      data-product-image="true"
    />
  );
}

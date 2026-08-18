import Image from "next/image";
import { getProductImage } from "@/lib/products/format";
import type { Product } from "@/types/product";

export function ProductImage({
  product,
  sizes,
  priority = false,
  src,
  alt,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  src?: string;
  alt?: string;
}) {
  const imageSrc = src || getProductImage(product);
  const unoptimized = imageSrc.endsWith(".svg") || imageSrc.startsWith("data:");

  return (
    <Image
      src={imageSrc}
      alt={alt || `${product.name}, peça artesanal em crochê`}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      data-product-image="true"
    />
  );
}

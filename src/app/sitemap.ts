import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/products/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let products: Awaited<ReturnType<typeof getPublicProducts>> = [];

  try {
    products = await getPublicProducts();
  } catch {
    // The home page remains indexable if the catalog service is temporarily offline.
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${baseUrl}/produto/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

import type { Metadata } from "next";
import { ProductPageContent } from "@/components/product/ProductPageContent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getPublicProducts } from "@/lib/products/repository";
import styles from "./product-page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = (await getPublicProducts()).find((item) => item.slug === slug);
    if (!product) return { title: "Peça" };

    return {
      title: product.name,
      description: product.description,
    };
  } catch {
    return { title: "Peça artesanal" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className={styles.page}>
      <Header />
      <main id="conteudo">
        <ProductPageContent slug={slug} />
      </main>
      <Footer />
    </div>
  );
}

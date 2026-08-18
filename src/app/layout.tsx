import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import { ProductProvider } from "@/components/providers/ProductProvider";
import { demoProducts } from "@/data/demo-products";
import { getVisibleProducts } from "@/lib/products/catalog";
import { getPublicProducts } from "@/lib/products/repository";
import { getCatalogMode } from "@/lib/supabase/config";
import "./globals.css";

const bodyFont = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const displayFont = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Ateliê Avesso | Crochê feito sem pressa",
    template: "%s | Ateliê Avesso",
  },
  description:
    "Peças de crochê feitas à mão, ponto a ponto, para vestir, presentear e morar.",
  keywords: ["crochê", "artesanato", "feito à mão", "amigurumi", "bolsas"],
  openGraph: {
    title: "Ateliê Avesso",
    description: "Toda peça começa com um fio. E um pouco de tempo.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "light",
};

async function loadInitialProducts() {
  try {
    return await getPublicProducts();
  } catch (error) {
    console.error("Catálogo remoto indisponível; usando acervo demonstrativo.", error);
    return getVisibleProducts(demoProducts);
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const products = await loadInitialProducts();

  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <ProductProvider initialProducts={products} mode={getCatalogMode()}>
          {children}
        </ProductProvider>
      </body>
    </html>
  );
}

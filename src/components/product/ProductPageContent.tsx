"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductImage } from "@/components/catalog/ProductImage";
import { useProducts } from "@/components/providers/ProductProvider";
import { formatCurrency } from "@/lib/products/format";
import { getStockLabel, getStockStatus } from "@/lib/products/inventory";
import { getProductProperties } from "@/lib/products/properties";
import styles from "./product.module.css";

export function ProductPageContent({ slug }: { slug: string }) {
  const { products } = useProducts();
  const product = products.find((item) => item.slug === slug && item.active);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const properties = useMemo(() => product ? getProductProperties(product) : [], [product]);

  if (!product) {
    return (
      <section className={styles.notFound}>
        <span aria-hidden="true">∿</span>
        <p>Este fio não está mais por aqui.</p>
        <h1>Peça não encontrada</h1>
        <Link href="/#catalogo">Voltar ao catálogo</Link>
      </section>
    );
  }

  const selectedSummary = properties
    .map((property) => selectedOptions[property.name]
      ? `${property.name}: ${selectedOptions[property.name]}`
      : "")
    .filter(Boolean);

  const message = encodeURIComponent(
    `Olá! Gostaria de saber mais sobre ${product.name}${selectedSummary.length ? `. Opções: ${selectedSummary.join("; ")}` : ""}.`,
  );
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";

  return (
    <article className={styles.productPage}>
      <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <Link href="/#catalogo">Catálogo</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className={styles.productLayout}>
        <figure className={styles.productVisual}>
          <ProductImage
            product={product}
            sizes="(max-width: 760px) 92vw, 54vw"
            priority
          />
          <figcaption>Feita à mão · pequenas variações fazem parte</figcaption>
        </figure>

        <div className={styles.productInfo}>
          <div className={styles.productTopline}>
            <p>{product.category}</p>
            <span data-status={getStockStatus(product)}>{getStockLabel(product)}</span>
          </div>
          <h1>{product.name}</h1>
          <p className={styles.price}>A partir de {formatCurrency(product.price)}</p>
          <p className={styles.description}>{product.description}</p>

          {properties.map((property) => (
            <fieldset key={property.name}>
              <legend>{property.name}</legend>
              <div className={styles.options}>
                {property.values.map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={`property-${property.name}`}
                      value={value}
                      checked={selectedOptions[property.name] === value}
                      onChange={() => setSelectedOptions((current) => ({
                        ...current,
                        [property.name]: value,
                      }))}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <a
            className={styles.orderButton}
            href={`https://wa.me/${number}?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            Conversar sobre esta peça
            <span aria-hidden="true">↗</span>
          </a>

          <dl className={styles.productFacts}>
            <div>
              <dt>Produção</dt>
              <dd>Artesanal, em pequena escala</dd>
            </div>
            <div>
              <dt>Envio</dt>
              <dd>Calculado para todo o Brasil</dd>
            </div>
            <div>
              <dt>Cuidado</dt>
              <dd>Lavar à mão e secar à sombra</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

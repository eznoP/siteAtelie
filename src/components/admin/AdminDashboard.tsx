"use client";

import Link from "next/link";
import { useState } from "react";
import { useProducts } from "@/components/providers/ProductProvider";
import { getStockStatus } from "@/lib/products/inventory";
import type { CatalogMode, Product } from "@/types/product";
import { CategoryManager } from "./CategoryManager";
import { PricingCalculator } from "./PricingCalculator";
import { ProductEditor } from "./ProductEditor";
import { ProductManager } from "./ProductManager";
import styles from "./admin.module.css";

export function AdminDashboard({
  mode,
  email,
  accessError,
  onSignOut,
}: {
  mode: CatalogMode;
  email?: string;
  accessError?: string;
  onSignOut?: () => void;
}) {
  const { products, busy } = useProducts();
  const [activeView, setActiveView] = useState<"products" | "pricing">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>();
  const activeCount = products.filter((product) => product.active).length;
  const lowStockCount = products.filter(
    (product) => getStockStatus(product) !== "available",
  ).length;
  const categoryCount = new Set(products.map((product) => product.category)).size;

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <Link className={styles.adminBrand} href="/">
          <span>A</span>
          <div>
            <strong>AVESSO</strong>
            <small>painel do ateliê</small>
          </div>
        </Link>
        <nav aria-label="Seções do painel">
          <button
            type="button"
            data-active={activeView === "products"}
            onClick={() => setActiveView("products")}
          >
            <i aria-hidden="true">◫</i> Produtos
          </button>
          <button
            type="button"
            data-active={activeView === "pricing"}
            onClick={() => setActiveView("pricing")}
          >
            <i aria-hidden="true">∑</i> Precificação
          </button>
          <Link href="/#catalogo">
            <i aria-hidden="true">↗</i> Ver catálogo
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <span data-mode={mode}>{mode === "demo" ? "Modo demonstração" : "Supabase ativo"}</span>
          {email ? <small>{email}</small> : null}
          {onSignOut ? (
            <button type="button" onClick={onSignOut}>
              Sair
            </button>
          ) : null}
        </div>
      </aside>

      <div className={styles.adminContent}>
        {mode === "demo" ? (
          <div className={styles.demoBanner} role="status">
            <strong>Modo demonstração.</strong> As alterações ficam neste navegador.
            Configure o Supabase para sincronizar o catálogo em produção.
          </div>
        ) : null}
        {accessError ? (
          <div className={styles.errorBanner} role="alert">
            {accessError}
          </div>
        ) : null}

        <header className={styles.adminHeader}>
          <div>
            <p>Visão geral</p>
            <h1>{activeView === "products" ? "Acervo" : "Preço justo"}</h1>
          </div>
          {activeView === "products" ? (
            <button type="button" onClick={() => setEditingProduct(null)}>
              + Adicionar peça
            </button>
          ) : null}
        </header>

        <section className={styles.metrics} aria-label="Resumo do catálogo">
          <article data-tone="neutral">
            <span>Peças cadastradas</span>
            <strong>{String(products.length).padStart(2, "0")}</strong>
          </article>
          <article data-tone="success">
            <span>Visíveis no site</span>
            <strong>{String(activeCount).padStart(2, "0")}</strong>
          </article>
          <article data-tone="warning">
            <span>Estoque em atenção</span>
            <strong>{String(lowStockCount).padStart(2, "0")}</strong>
          </article>
          <article data-tone="info">
            <span>Categorias</span>
            <strong>{String(categoryCount).padStart(2, "0")}</strong>
          </article>
        </section>

        {activeView === "products" ? (
          <>
            <CategoryManager products={products} />
            <ProductManager onEdit={setEditingProduct} />
          </>
        ) : (
          <PricingCalculator />
        )}
      </div>

      {editingProduct !== undefined ? (
        <ProductEditor
          product={editingProduct}
          nextPosition={products.length}
          onClose={() => setEditingProduct(undefined)}
        />
      ) : null}
      {busy ? <div className={styles.busyBar} aria-label="Salvando alterações" /> : null}
    </div>
  );
}

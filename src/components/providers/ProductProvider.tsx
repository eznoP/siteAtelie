"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { normalizePositions, orderProducts } from "@/lib/products/catalog";
import type { CatalogMode, Product, ProductDraft } from "@/types/product";

const STORAGE_KEY = "atelie-avesso.products.v1";

interface ProductContextValue {
  products: Product[];
  mode: CatalogMode;
  busy: boolean;
  error: string | null;
  saveProduct: (draft: ProductDraft) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;
  reorder: (orderedProducts: Product[]) => Promise<void>;
  refresh: (includeInactive?: boolean) => Promise<void>;
}

const ProductContext = createContext<ProductContextValue | null>(null);

function readDemoProducts(initialProducts: Product[]): Product[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialProducts;
    const parsed = JSON.parse(stored) as Product[];
    return Array.isArray(parsed) ? orderProducts(parsed) : initialProducts;
  } catch {
    return initialProducts;
  }
}

export function ProductProvider({
  children,
  initialProducts,
  mode,
}: {
  children: React.ReactNode;
  initialProducts: Product[];
  mode: CatalogMode;
}) {
  const [products, setProducts] = useState(() => orderProducts(initialProducts));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "demo") return;

    startTransition(() => {
      setProducts(readDemoProducts(initialProducts));
    });

    function syncProducts(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      const newValue = event.newValue;
      try {
        startTransition(() => {
          setProducts(orderProducts(JSON.parse(newValue) as Product[]));
        });
      } catch {
        // Ignore malformed values written by another tab.
      }
    }

    window.addEventListener("storage", syncProducts);
    return () => window.removeEventListener("storage", syncProducts);
  }, [initialProducts, mode]);

  function persistDemo(nextProducts: Product[]) {
    const normalized = normalizePositions(nextProducts);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setProducts(normalized);
    return normalized;
  }

  async function refresh(includeInactive = false) {
    if (mode === "demo") {
      setProducts(readDemoProducts(initialProducts));
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/products${includeInactive ? "?admin=1" : ""}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as {
        products?: Product[];
        error?: string;
      };
      if (!response.ok || !payload.products) {
        throw new Error(payload.error || "Não foi possível atualizar o catálogo.");
      }
      setProducts(orderProducts(payload.products));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado.",
      );
      throw caughtError;
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(draft: ProductDraft): Promise<Product> {
    setBusy(true);
    setError(null);

    try {
      if (mode === "demo") {
        const product: Product = {
          ...draft,
          id: draft.id || crypto.randomUUID(),
        };
        const existingIndex = products.findIndex(({ id }) => id === product.id);
        const nextProducts = [...products];

        if (existingIndex >= 0) nextProducts[existingIndex] = product;
        else nextProducts.push(product);

        persistDemo(nextProducts);
        return product;
      }

      const response = await fetch(
        draft.id ? `/api/products/${draft.id}` : "/api/products",
        {
          method: draft.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const payload = (await response.json()) as {
        product?: Product;
        error?: string;
      };
      if (!response.ok || !payload.product) {
        throw new Error(payload.error || "Não foi possível salvar o produto.");
      }

      const savedProduct = payload.product;
      setProducts((currentProducts) => {
        const withoutSaved = currentProducts.filter(
          ({ id }) => id !== savedProduct.id,
        );
        return orderProducts([...withoutSaved, savedProduct]);
      });
      return savedProduct;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado.",
      );
      throw caughtError;
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct(id: string) {
    setBusy(true);
    setError(null);

    try {
      if (mode === "demo") {
        persistDemo(products.filter((product) => product.id !== id));
        return;
      }

      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Não foi possível excluir o produto.");
      }
      setProducts((currentProducts) =>
        normalizePositions(
          currentProducts.filter((product) => product.id !== id),
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado.",
      );
      throw caughtError;
    } finally {
      setBusy(false);
    }
  }

  async function reorder(orderedProducts: Product[]) {
    const normalized = normalizePositions(orderedProducts);
    const previousProducts = products;
    setError(null);
    setBusy(true);
    setProducts(normalized);

    try {
      if (mode === "demo") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return;
      }

      const response = await fetch("/api/products/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positions: normalized.map(({ id, position }) => ({ id, position })),
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Não foi possível salvar a ordem.");
      }
    } catch (caughtError) {
      setProducts(previousProducts);
      setError(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado.",
      );
      throw caughtError;
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        mode,
        busy,
        error,
        saveProduct,
        removeProduct,
        reorder,
        refresh,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de ProductProvider");
  }
  return context;
}

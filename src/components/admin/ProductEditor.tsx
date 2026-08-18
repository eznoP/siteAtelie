"use client";

import { useState } from "react";
import { useProducts } from "@/components/providers/ProductProvider";
import { slugify } from "@/lib/products/format";
import { getLegacyOptions, getProductProperties, normalizeProperties } from "@/lib/products/properties";
import type { Product, ProductDraft, ProductProperty } from "@/types/product";
import { ImageUploader } from "./ImageUploader";
import { PropertyEditor } from "./PropertyEditor";
import styles from "./admin.module.css";

function initialProperties(product: Product | null): ProductProperty[] {
  if (product) return getProductProperties(product);
  return [
    { name: "Tamanho", values: [] },
    { name: "Cor", values: [] },
  ];
}

export function ProductEditor({
  product,
  nextPosition,
  onClose,
}: {
  product: Product | null;
  nextPosition: number;
  onClose: () => void;
}) {
  const { saveProduct, busy } = useProducts();
  const [images, setImages] = useState(product?.images ?? []);
  const [properties, setProperties] = useState<ProductProperty[]>(() => initialProperties(product));
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!images.length) {
      setMessage("Adicione uma imagem antes de salvar.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const normalizedProperties = normalizeProperties(properties);
    const { sizes, colors } = getLegacyOptions(normalizedProperties);

    const draft: ProductDraft = {
      id: product?.id,
      name,
      slug: slugify(name),
      description: String(form.get("description") || ""),
      images,
      category: String(form.get("category") || ""),
      price: Number(form.get("price") || 0),
      stock: Number(form.get("stock") || 0),
      sizes,
      colors,
      properties: normalizedProperties,
      position: product?.position ?? nextPosition,
      active: form.get("active") === "on",
      showWhenOutOfStock: form.get("showWhenOutOfStock") === "on",
    };

    setMessage("");
    try {
      await saveProduct(draft);
      onClose();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar.");
    }
  }

  return (
    <div className={styles.editorBackdrop} role="presentation" onMouseDown={onClose}>
      <dialog
        className={styles.editor}
        open
        aria-labelledby="editor-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>{product ? "Editar cadastro" : "Nova peça"}</p>
            <h2 id="editor-title">{product?.name || "Adicionar ao acervo"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar editor">×</button>
        </header>

        <form onSubmit={handleSubmit}>
          <ImageUploader images={images} onChange={setImages} />

          <div className={styles.editorFields}>
            <label className={styles.fullField}>
              Nome da peça
              <input name="name" defaultValue={product?.name} minLength={2} maxLength={100} required />
            </label>
            <label>
              Categoria
              <input name="category" defaultValue={product?.category} list="category-options" required />
              <datalist id="category-options">
                <option value="Bolsas" />
                <option value="Amigurumis" />
                <option value="Casa" />
                <option value="Vestir" />
                <option value="Acessórios" />
              </datalist>
            </label>
            <label>
              Preço (R$)
              <input name="price" type="number" min="0" step="0.01" defaultValue={product?.price} required />
            </label>
            <label>
              Estoque
              <input name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 1} required />
            </label>
            <label className={styles.fullField}>
              Descrição exibida no pop-up
              <textarea name="description" rows={4} minLength={10} maxLength={1200} defaultValue={product?.description} required />
            </label>
          </div>

          <PropertyEditor properties={properties} onChange={setProperties} />

          <div className={styles.editorChecks}>
            <label>
              <input name="active" type="checkbox" defaultChecked={product?.active ?? true} />
              <span>Visível no catálogo</span>
            </label>
            <label>
              <input name="showWhenOutOfStock" type="checkbox" defaultChecked={product?.showWhenOutOfStock ?? true} />
              <span>Mostrar quando esgotado</span>
            </label>
          </div>

          <p className={styles.editorMessage} role="alert">{message}</p>
          <footer>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar peça"}</button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}

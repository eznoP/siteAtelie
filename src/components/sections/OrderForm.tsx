"use client";

import { useState } from "react";
import { useProducts } from "@/components/providers/ProductProvider";
import { getVisibleProducts } from "@/lib/products/catalog";
import styles from "./sections.module.css";

export function OrderForm() {
  const { products } = useProducts();
  const [status, setStatus] = useState("");
  const visibleProducts = getVisibleProducts(products);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const product = String(form.get("product") || "uma peça personalizada");
    const color = String(form.get("color") || "a definir");
    const notes = String(form.get("notes") || "");
    const message = [
      `Olá! Sou ${name} e gostaria de conversar sobre ${product}.`,
      `Cor/ideia: ${color}.`,
      notes ? `Detalhes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("Conversa preparada no WhatsApp.");
  }

  return (
    <form className={styles.orderForm} onSubmit={handleSubmit}>
      <div className={styles.formHeading}>
        <span>Conte sua ideia</span>
        <small>Respondemos em até 2 dias úteis</small>
      </div>

      <label>
        Seu nome
        <input name="name" type="text" autoComplete="name" required placeholder="Como podemos chamar você?" />
      </label>

      <label>
        Peça de interesse
        <select name="product" defaultValue="">
          <option value="">Uma criação nova</option>
          {visibleProducts.map((product) => (
            <option key={product.id} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Cor ou atmosfera
        <input name="color" type="text" placeholder="Ex.: vinho, neutros, mar..." />
      </label>

      <label>
        Detalhes
        <textarea name="notes" rows={3} placeholder="Tamanho, ocasião, prazo ou qualquer referência" />
      </label>

      <button type="submit">
        Conversar sobre a peça
        <span aria-hidden="true">↗</span>
      </button>
      <p className={styles.formStatus} role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

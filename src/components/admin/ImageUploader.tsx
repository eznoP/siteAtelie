"use client";

import { useState } from "react";
import { useProducts } from "@/components/providers/ProductProvider";
import { prepareProductImage } from "@/lib/images/client";
import styles from "./admin.module.css";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const { mode } = useProducts();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage("");

    try {
      const prepared = await prepareProductImage(file);

      if (mode === "demo") {
        onChange([prepared.preview]);
        setMessage("Imagem convertida para WebP e salva neste navegador.");
        return;
      }

      const body = new FormData();
      body.append("file", new File([prepared.blob], "produto.webp", { type: "image/webp" }));
      const response = await fetch("/api/upload", { method: "POST", body });
      const payload = (await response.json()) as { image?: string; error?: string };
      if (!response.ok || !payload.image) {
        throw new Error(payload.error || "Não foi possível enviar a imagem.");
      }
      onChange([payload.image]);
      setMessage("Imagem otimizada e enviada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className={styles.imageUploader} aria-labelledby="image-heading">
      <div>
        <p id="image-heading">Imagem principal</p>
        <small>Corte automático 4:5 · 1200 × 1500 · WebP</small>
      </div>
      {images[0] ? (
        <div className={styles.imagePreview} style={{ backgroundImage: `url("${images[0]}")` }}>
          <button type="button" onClick={() => onChange([])}>Remover</button>
        </div>
      ) : (
        <label className={styles.uploadDropzone}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={uploading}
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <span aria-hidden="true">↥</span>
          <strong>{uploading ? "Preparando imagem..." : "Escolher fotografia"}</strong>
          <small>JPG, PNG, WebP ou AVIF · até 10 MB</small>
        </label>
      )}
      {images[0] ? (
        <label className={styles.replaceImage}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={uploading}
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          {uploading ? "Substituindo..." : "Substituir fotografia"}
        </label>
      ) : null}
      <p className={styles.uploadMessage} role="status">{message}</p>
    </section>
  );
}

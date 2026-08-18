"use client";

import { useState } from "react";
import { useProducts } from "@/components/providers/ProductProvider";
import { prepareProductImage } from "@/lib/images/client";
import styles from "./admin.module.css";
import fixStyles from "./admin-v06.module.css";

const MAX_IMAGES = 8;
const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/avif";

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

  async function uploadFile(file: File): Promise<string> {
    const prepared = await prepareProductImage(file);
    if (mode === "demo") return prepared.preview;

    const body = new FormData();
    body.append("file", new File([prepared.blob], "produto.webp", { type: "image/webp" }));
    const response = await fetch("/api/upload", { method: "POST", body });
    const payload = (await response.json()) as { image?: string; error?: string };
    if (!response.ok || !payload.image) {
      throw new Error(payload.error || "Não foi possível enviar a imagem.");
    }
    return payload.image;
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setMessage(`O limite é de ${MAX_IMAGES} fotos por peça.`);
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    setUploading(true);
    setMessage("");

    try {
      const uploaded: string[] = [];
      for (const file of files) uploaded.push(await uploadFile(file));
      onChange([...images, ...uploaded]);
      setMessage(
        `${uploaded.length} ${uploaded.length === 1 ? "foto adicionada" : "fotos adicionadas"}. A primeira foto é a principal.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  }

  function makePrimary(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    onChange(next);
    setMessage("Imagem principal atualizada.");
  }

  return (
    <section className={styles.imageUploader} aria-labelledby="image-heading">
      <div className={fixStyles.imageUploaderHeading}>
        <div>
          <p id="image-heading">Fotos da peça</p>
          <small>Corte automático 4:5 · 1200 × 1500 · WebP · até {MAX_IMAGES} fotos</small>
        </div>
        <span>{images.length}/{MAX_IMAGES}</span>
      </div>

      {images.length ? (
        <div className={fixStyles.imageGalleryEditor}>
          {images.map((image, index) => (
            <article className={fixStyles.imageThumbEditor} key={`${image}-${index}`}>
              <div style={{ backgroundImage: `url("${image}")` }} aria-label={`Foto ${index + 1} da peça`} />
              {index === 0 ? <strong>Principal</strong> : null}
              <div className={fixStyles.imageThumbActions}>
                {index > 0 ? (
                  <button type="button" disabled={uploading} onClick={() => makePrimary(index)}>
                    Tornar principal
                  </button>
                ) : null}
                <button type="button" disabled={uploading} onClick={() => removeImage(index)}>
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {images.length < MAX_IMAGES ? (
        <label className={styles.uploadDropzone}>
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            disabled={uploading}
            onChange={(event) => {
              void handleFiles(event.target.files);
              event.currentTarget.value = "";
            }}
          />
          <span aria-hidden="true">↥</span>
          <strong>{uploading ? "Preparando fotos..." : images.length ? "Adicionar mais fotos" : "Adicionar fotos"}</strong>
          <small>Você pode selecionar várias imagens de uma vez · até 10 MB cada</small>
        </label>
      ) : null}

      <p className={styles.uploadMessage} role="status" aria-live="polite">{message}</p>
    </section>
  );
}

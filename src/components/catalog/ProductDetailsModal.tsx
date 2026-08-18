"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatCurrency, getProductImage } from "@/lib/products/format";
import { getStockLabel, getStockStatus } from "@/lib/products/inventory";
import { getProductProperties } from "@/lib/products/properties";
import type { Product } from "@/types/product";
import { ProductImage } from "./ProductImage";
import styles from "./catalog.module.css";
import galleryStyles from "./catalog-v06.module.css";

export function ProductDetailsModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const titleId = `product-modal-title-${product.id}`;
  const descriptionId = `product-modal-description-${product.id}`;
  const properties = useMemo(() => getProductProperties(product), [product]);
  const galleryImages = product.images.length ? product.images : [getProductImage(product)];
  const activeImage = galleryImages[Math.min(activeImageIndex, galleryImages.length - 1)];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(properties.map((property) => [property.name, property.values[0] || ""])),
  );
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";

  const selectedSummary = properties
    .map((property) => {
      const selected = selectedOptions[property.name];
      return selected ? `${property.name}: ${selected}` : "";
    })
    .filter(Boolean);

  const message = encodeURIComponent(
    `Olá! Gostaria de saber mais sobre ${product.name}.${selectedSummary.length ? ` Opções escolhidas — ${selectedSummary.join("; ")}.` : ""}`,
  );

  useEffect(() => {
    setMounted(true);
    setActiveImageIndex(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previousActive = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (galleryImages.length > 1 && event.key === "ArrowRight") {
        setActiveImageIndex((current) => (current + 1) % galleryImages.length);
      }
      if (galleryImages.length > 1 && event.key === "ArrowLeft") {
        setActiveImageIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActive?.focus?.();
    };
  }, [galleryImages.length, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`${styles.detailsDialog} ${galleryStyles.detailsDialog}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeButtonRef}
          className={styles.modalClose}
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          ×
        </button>

        <div className={styles.modalLayout}>
          <div className={galleryStyles.modalGallery}>
            <figure className={`${styles.modalVisual} ${galleryStyles.modalVisual}`}>
              <ProductImage
                product={product}
                src={activeImage}
                alt={`${product.name}, foto ${activeImageIndex + 1} de ${galleryImages.length}`}
                sizes="(max-width: 760px) 100vw, 52vw"
              />
              {galleryImages.length > 1 ? (
                <>
                  <button
                    className={`${galleryStyles.galleryArrow} ${galleryStyles.galleryArrowPrev}`}
                    type="button"
                    aria-label="Foto anterior"
                    onClick={() => setActiveImageIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length)}
                  >←</button>
                  <button
                    className={`${galleryStyles.galleryArrow} ${galleryStyles.galleryArrowNext}`}
                    type="button"
                    aria-label="Próxima foto"
                    onClick={() => setActiveImageIndex((current) => (current + 1) % galleryImages.length)}
                  >→</button>
                  <span className={galleryStyles.galleryCounter}>{activeImageIndex + 1} / {galleryImages.length}</span>
                </>
              ) : null}
            </figure>

            {galleryImages.length > 1 ? (
              <div className={galleryStyles.modalThumbnails} aria-label="Outras fotos da peça">
                {galleryImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    data-active={index === activeImageIndex}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Ver foto ${index + 1}`}
                  >
                    <ProductImage product={product} src={image} alt="" sizes="90px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`${styles.modalInfo} ${galleryStyles.modalInfo}`}>
            <div className={styles.modalTopline}>
              <p>{product.category}</p>
              <span data-status={getStockStatus(product)}>{getStockLabel(product)}</span>
            </div>

            <h2 id={titleId}>{product.name}</h2>
            <p className={styles.modalPrice}>{formatCurrency(product.price)}</p>
            <p id={descriptionId} className={styles.modalDescription}>{product.description}</p>

            {properties.length ? (
              <div className={styles.modalOptions}>
                {properties.map((property) => (
                  <fieldset className={styles.optionGroup} key={property.name}>
                    <legend>{property.name}</legend>
                    <div className={styles.optionChoices}>
                      {property.values.map((value) => {
                        const checked = selectedOptions[property.name] === value;
                        return (
                          <label key={value} data-selected={checked}>
                            <input
                              type="radio"
                              name={`modal-${product.id}-${property.name}`}
                              value={value}
                              checked={checked}
                              onChange={() => setSelectedOptions((current) => ({ ...current, [property.name]: value }))}
                            />
                            <span>{value}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            ) : null}

            <div className={galleryStyles.modalMetaGrid}>
              <div><span>Disponibilidade</span><strong>{getStockLabel(product)}</strong></div>
              <div><span>Fotos</span><strong>{galleryImages.length}</strong></div>
            </div>

            <a
              className={styles.modalAction}
              href={`https://wa.me/${number}?text=${message}`}
              target="_blank"
              rel="noreferrer"
            >
              Consultar esta peça <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

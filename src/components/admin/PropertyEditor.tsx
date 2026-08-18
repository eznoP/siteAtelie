"use client";

import type { ProductProperty } from "@/types/product";
import styles from "./admin.module.css";

function valuesToText(values: string[]) {
  return values.join(", ");
}

function textToValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PropertyEditor({
  properties,
  onChange,
}: {
  properties: ProductProperty[];
  onChange: (properties: ProductProperty[]) => void;
}) {
  function update(index: number, patch: Partial<ProductProperty>) {
    onChange(properties.map((property, propertyIndex) => (
      propertyIndex === index ? { ...property, ...patch } : property
    )));
  }

  function remove(index: number) {
    onChange(properties.filter((_, propertyIndex) => propertyIndex !== index));
  }

  function addProperty() {
    onChange([...properties, { name: "", values: [] }]);
  }

  return (
    <section className={styles.propertyEditor} aria-labelledby="property-editor-title">
      <div className={styles.propertyEditorHeading}>
        <div>
          <p>Variações da peça</p>
          <h3 id="property-editor-title">Propriedades e opções</h3>
          <span>
            Adicione tamanho, cor, medida, tipo de fio, acabamento ou qualquer característica necessária.
          </span>
        </div>
        <button type="button" onClick={addProperty}>
          <span aria-hidden="true">＋</span> Adicionar propriedade
        </button>
      </div>

      <div className={styles.propertyList}>
        {properties.map((property, index) => (
          <div className={styles.propertyRow} key={`property-${index}`}>
            <label>
              <span>Propriedade</span>
              <input
                value={property.name}
                onChange={(event) => update(index, { name: event.target.value })}
                placeholder="Ex.: Tamanho"
                maxLength={60}
                aria-label={`Nome da propriedade ${index + 1}`}
              />
            </label>
            <label className={styles.propertyValues}>
              <span>Opções</span>
              <input
                value={valuesToText(property.values)}
                onChange={(event) => update(index, { values: textToValues(event.target.value) })}
                placeholder="Ex.: P, M, G"
                aria-label={`Opções da propriedade ${index + 1}, separadas por vírgula`}
              />
            </label>
            <button
              className={styles.removeProperty}
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remover propriedade ${property.name || index + 1}`}
              title="Remover propriedade"
            >
              ×
            </button>
          </div>
        ))}

        {!properties.length ? (
          <button className={styles.emptyPropertyAction} type="button" onClick={addProperty}>
            <span aria-hidden="true">＋</span>
            <strong>Adicionar primeira propriedade</strong>
            <small>Use propriedades para informar tamanhos, cores e outras opções no pop-up do produto.</small>
          </button>
        ) : null}
      </div>
    </section>
  );
}

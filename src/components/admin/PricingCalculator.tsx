"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/products/format";
import { calculateSuggestedPrice } from "@/lib/products/pricing";
import styles from "./admin.module.css";

export function PricingCalculator() {
  const [materialCost, setMaterialCost] = useState(45);
  const [hours, setHours] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(22);
  const [marginPercent, setMarginPercent] = useState(25);
  const result = calculateSuggestedPrice({ materialCost, hours, hourlyRate, marginPercent });

  return (
    <section className={styles.pricing} aria-labelledby="pricing-heading">
      <div className={styles.pricingIntro}>
        <p>Ferramenta de apoio</p>
        <h2 id="pricing-heading">O tempo das mãos também entra na conta.</h2>
        <span>
          O valor sugerido considera matéria-prima, horas de trabalho e margem.
          Ajuste conforme a complexidade e o posicionamento da peça.
        </span>
      </div>

      <form className={styles.pricingForm} onSubmit={(event) => event.preventDefault()}>
        <label>
          Custo dos materiais
          <span>R$</span>
          <input type="number" min="0" step="0.01" value={materialCost} onChange={(event) => setMaterialCost(Number(event.target.value))} />
        </label>
        <label>
          Horas de trabalho
          <span>h</span>
          <input type="number" min="0" step="0.5" value={hours} onChange={(event) => setHours(Number(event.target.value))} />
        </label>
        <label>
          Valor da hora
          <span>R$</span>
          <input type="number" min="0" step="0.01" value={hourlyRate} onChange={(event) => setHourlyRate(Number(event.target.value))} />
        </label>
        <label>
          Margem desejada
          <span>%</span>
          <input type="number" min="0" max="95" step="1" value={marginPercent} onChange={(event) => setMarginPercent(Number(event.target.value))} />
        </label>
      </form>

      <div className={styles.pricingResult}>
        <div>
          <span>Mão de obra</span>
          <strong>{formatCurrency(result.laborCost)}</strong>
        </div>
        <div>
          <span>Custo base</span>
          <strong>{formatCurrency(result.baseCost)}</strong>
        </div>
        <div>
          <span>Preço sugerido</span>
          <strong>{formatCurrency(result.suggestedPrice)}</strong>
        </div>
      </div>
    </section>
  );
}

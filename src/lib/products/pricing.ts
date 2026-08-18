export interface PricingInput {
  materialCost: number;
  hours: number;
  hourlyRate: number;
  marginPercent: number;
}

export interface PricingResult {
  laborCost: number;
  baseCost: number;
  suggestedPrice: number;
}

export function calculateSuggestedPrice({
  materialCost,
  hours,
  hourlyRate,
  marginPercent,
}: PricingInput): PricingResult {
  const safeMaterialCost = Math.max(0, materialCost);
  const safeHours = Math.max(0, hours);
  const safeHourlyRate = Math.max(0, hourlyRate);
  const safeMargin = Math.min(95, Math.max(0, marginPercent)) / 100;
  const laborCost = safeHours * safeHourlyRate;
  const baseCost = safeMaterialCost + laborCost;
  const suggestedPrice = safeMargin === 1 ? baseCost : baseCost / (1 - safeMargin);

  return {
    laborCost,
    baseCost,
    suggestedPrice,
  };
}

import { describe, expect, it } from "vitest";
import { calculateSuggestedPrice } from "@/lib/products/pricing";

describe("precificação", () => {
  it("inclui material, mão de obra e margem", () => {
    const result = calculateSuggestedPrice({
      materialCost: 50,
      hours: 4,
      hourlyRate: 25,
      marginPercent: 25,
    });

    expect(result.laborCost).toBe(100);
    expect(result.baseCost).toBe(150);
    expect(result.suggestedPrice).toBe(200);
  });

  it("não aceita valores negativos", () => {
    expect(
      calculateSuggestedPrice({
        materialCost: -5,
        hours: -2,
        hourlyRate: 20,
        marginPercent: -10,
      }).suggestedPrice,
    ).toBe(0);
  });
});

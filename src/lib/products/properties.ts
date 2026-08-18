import type { Product, ProductProperty } from "@/types/product";

const SIZE_NAMES = new Set(["tamanho", "tamanhos", "medida", "medidas"]);
const COLOR_NAMES = new Set(["cor", "cores"]);

export function normalizePropertyName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeProperties(properties: ProductProperty[] | undefined | null) {
  const seen = new Set<string>();

  return (properties ?? [])
    .map((property) => ({
      name: normalizePropertyName(property.name || ""),
      values: [...new Set((property.values ?? []).map((value) => value.trim()).filter(Boolean))],
    }))
    .filter((property) => {
      if (!property.name || !property.values.length) return false;
      const key = property.name.toLocaleLowerCase("pt-BR");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function getProductProperties(product: Pick<Product, "properties" | "sizes" | "colors">): ProductProperty[] {
  const explicit = normalizeProperties(product.properties);
  if (explicit.length) return explicit;

  const fallback: ProductProperty[] = [];
  if (product.sizes?.length) fallback.push({ name: "Tamanho", values: product.sizes });
  if (product.colors?.length) fallback.push({ name: "Cor", values: product.colors });
  return normalizeProperties(fallback);
}

export function getLegacyOptions(properties: ProductProperty[]) {
  const normalized = normalizeProperties(properties);
  const sizes = normalized.find((property) => SIZE_NAMES.has(property.name.toLocaleLowerCase("pt-BR")))?.values ?? [];
  const colors = normalized.find((property) => COLOR_NAMES.has(property.name.toLocaleLowerCase("pt-BR")))?.values ?? [];
  return { sizes, colors };
}

export function ensureProductProperties<T extends Partial<Product>>(product: T): T & Pick<Product, "properties"> {
  const properties = getProductProperties({
    properties: product.properties ?? [],
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
  } as Pick<Product, "properties" | "sizes" | "colors">);

  return { ...product, properties } as T & Pick<Product, "properties">;
}

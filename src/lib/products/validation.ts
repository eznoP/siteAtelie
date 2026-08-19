import { z } from "zod";

export const productPropertySchema = z.object({
  name: z.string().trim().min(1).max(60),
  values: z.array(z.string().trim().min(1).max(80)).min(1).max(30),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1200),
  images: z.array(z.string().min(1)).min(1).max(8),
  category: z.string().trim().min(2).max(60),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  sizes: z.array(z.string().trim()).max(20).default([]),
  colors: z.array(z.string().trim()).max(20).default([]),
  properties: z.array(productPropertySchema).max(20).default([]),
  position: z.coerce.number().int().min(0),
  active: z.boolean().default(true),
  showWhenOutOfStock: z.boolean().default(true),
});

export const productPatchSchema = productInputSchema.partial();

export const reorderSchema = z.object({
  positions: z
    .array(
      z.object({
        id: z.string().min(1),
        position: z.number().int().min(0),
      }),
    )
    .min(1),
});

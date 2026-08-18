import { NextResponse } from "next/server";
import {
  AuthorizationError,
  createProduct,
  getAdminProducts,
  getPublicProducts,
} from "@/lib/products/repository";
import { productInputSchema } from "@/lib/products/validation";
import { hasSupabaseConfig } from "@/lib/supabase/config";

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Erro inesperado." },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    const includeInactive = new URL(request.url).searchParams.get("admin") === "1";
    const products = includeInactive
      ? await getAdminProducts()
      : await getPublicProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { error: "No modo demonstração, as alterações são salvas no navegador." },
      { status: 409 },
    );
  }

  try {
    const parsed = productInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revise os campos do produto.", fields: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const product = await createProduct(parsed.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

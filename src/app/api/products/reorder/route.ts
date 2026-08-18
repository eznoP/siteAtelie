import { NextResponse } from "next/server";
import {
  AuthorizationError,
  reorderProducts,
} from "@/lib/products/repository";
import { reorderSchema } from "@/lib/products/validation";

export async function PATCH(request: Request) {
  try {
    const parsed = reorderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Ordem inválida." }, { status: 400 });
    }

    await reorderProducts(parsed.data.positions);
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error instanceof AuthorizationError ? error.status : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro inesperado." },
      { status },
    );
  }
}

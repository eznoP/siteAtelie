import { NextResponse } from "next/server";
import {
  AuthorizationError,
  deleteProduct,
  updateProduct,
} from "@/lib/products/repository";
import { productPatchSchema } from "@/lib/products/validation";

function errorResponse(error: unknown) {
  const status = error instanceof AuthorizationError ? error.status : 500;
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Erro inesperado." },
    { status },
  );
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const parsed = productPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revise os campos do produto.", fields: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const product = await updateProduct(id, parsed.data);
    return NextResponse.json({ product });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

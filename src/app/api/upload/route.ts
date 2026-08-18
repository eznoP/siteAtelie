import { NextResponse } from "next/server";
import sharp from "sharp";
import { AuthorizationError, requireAdmin } from "@/lib/products/repository";
import { hasSupabaseConfig } from "@/lib/supabase/config";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { error: "Upload remoto indisponível no modo demonstração." },
      { status: 409 },
    );
  }

  try {
    const { supabase, user } = await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || !allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Envie uma imagem JPG, PNG, WebP ou AVIF." },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "A imagem deve ter no máximo 10 MB." },
        { status: 400 },
      );
    }

    const webp = await sharp(await file.arrayBuffer())
      .rotate()
      .resize(1200, 1500, { fit: "cover", position: "attention" })
      .webp({ quality: 84, effort: 5 })
      .toBuffer();
    const path = `${user.id}/${crypto.randomUUID()}.webp`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, webp, { contentType: "image/webp", upsert: false });

    if (error) throw new Error(`Falha no armazenamento: ${error.message}`);

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return NextResponse.json({ image: data.publicUrl });
  } catch (error) {
    const status = error instanceof AuthorizationError ? error.status : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro inesperado." },
      { status },
    );
  }
}

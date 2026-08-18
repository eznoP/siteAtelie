import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const storageUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: storageUrl.protocol === "http:" ? "http" : "https",
      hostname: storageUrl.hostname,
      pathname: "/storage/v1/object/public/product-images/**",
    });
  } catch {
    console.warn("NEXT_PUBLIC_SUPABASE_URL inválida; imagens remotas desativadas.");
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

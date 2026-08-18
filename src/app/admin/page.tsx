import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";

export const metadata: Metadata = {
  title: "Painel do ateliê",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main id="conteudo">
      <AdminAuthGate />
    </main>
  );
}

import type { Metadata } from "next";

import RisikoAktifPage from "./risiko-aktif/page";

export const metadata: Metadata = {
  title: "Pemantauan & Tinjauan - Risiko Aktif",
  description: "Ringkasan data manajemen risiko.",
};

export default async function TabsRootPage() {
  return <RisikoAktifPage />;
}

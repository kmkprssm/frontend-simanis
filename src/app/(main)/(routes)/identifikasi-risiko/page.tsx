import { Suspense } from "react";
import type { Metadata } from "next";

import { IdentifikasiRisiko } from "@/components/identifikasi-risiko";
import { Loader } from "@/components/ui/loader";
import {
  getIdentifikasiRisiko,
  getIdentifikasiRisikoStats,
} from "@/server/apis/identifikasi-risiko";
import { currentUser } from "@/lib/auth";
import { getKategoriRisiko } from "@/server/apis/kategori-risiko";

export const metadata: Metadata = {
  title: "Identifikasi Risiko",
  description: "Ringkasan data manajemen risiko.",
};

export default async function IdentifikasiRisikoPage() {
  const user = await currentUser();
  const IdentifikasiRisikoData = await getIdentifikasiRisiko();
  const kategoriRisikoData = await getKategoriRisiko();
  const identifikasiRisikoStats = await getIdentifikasiRisikoStats();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <IdentifikasiRisiko
          data={IdentifikasiRisikoData}
          userSession={user}
          kategoriRisikoData={kategoriRisikoData}
          identifikasiRisikoStats={identifikasiRisikoStats}
        />
      </Suspense>
    </>
  );
}

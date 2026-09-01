import { Suspense } from "react";
import type { Metadata } from "next";

import { Loader } from "@/components/ui/loader";
import {
  getAnalisisRisiko,
  getAnalisisRisikoStats,
} from "@/server/apis/analisis-risiko";
import { AnalisisRisiko } from "@/components/analisis-resiko";
import { getIdentifikasiRisiko } from "@/server/apis/identifikasi-risiko";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Analisis Risiko",
  description: "Ringkasan data manajemen risiko.",
};

export default async function AnalisisRisikoPage() {
  const analisisRisikoData = await getAnalisisRisiko();
  const identifikasiRisikoData = await getIdentifikasiRisiko();
  const analisisRisikoStats = await getAnalisisRisikoStats();
  const user = await currentUser();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <AnalisisRisiko
          data={analisisRisikoData}
          identifikasiRisikoData={identifikasiRisikoData}
          analisisRisikoStats={analisisRisikoStats}
          user={user}
        />
      </Suspense>
    </>
  );
}

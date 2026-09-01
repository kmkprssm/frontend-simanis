import { Suspense } from "react";
import type { Metadata } from "next";

import { Loader } from "@/components/ui/loader";
import { EvaluasiRisiko } from "@/components/evaluasi-risiko/indes";
import {
  getEvaluasiRisiko,
  getEvaluasiRisikoStats,
} from "@/server/apis/evaluasi-risiko";

export const metadata: Metadata = {
  title: "Evaluasi Risiko",
  description: "Ringkasan data manajemen risiko.",
};

export default async function EvaluasiRisikoPage() {
  const evaluasiRisikoData = await getEvaluasiRisiko();
  const evaluasiRisikoStats = await getEvaluasiRisikoStats();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <EvaluasiRisiko
          data={evaluasiRisikoData}
          evaluasiRisikoStats={evaluasiRisikoStats}
        />
      </Suspense>
    </>
  );
}

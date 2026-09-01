import { Suspense } from "react";
import type { Metadata } from "next";

import { Loader } from "@/components/ui/loader";
import { AnalisisResiduRisiko } from "@/components/analisis-residu-risiko";
import { getAnalisisResiduRisiko } from "@/server/apis/analisis-risiko";

export const metadata: Metadata = {
  title: "Analisis Residu Risiko",
  description: "Ringkasan data manajemen risiko.",
};

export default async function AnalisisResiduRisikoPage() {
  const residuRisikoData = await getAnalisisResiduRisiko();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <AnalisisResiduRisiko data={residuRisikoData} />
      </Suspense>
    </>
  );
}

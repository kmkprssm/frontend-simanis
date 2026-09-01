import { Suspense } from "react";
import type { Metadata } from "next";

import { Loader } from "@/components/ui/loader";
import { getPengendalianRisikoStats } from "@/server/apis/pengendalian-risiko";
import { PengendalianRisiko } from "@/components/pengendalian-risiko";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pengendalian Risiko",
  description: "Ringkasan data manajemen risiko.",
};

export default async function PengendalianRisikoPage() {
  const user = await currentUser();
  const pengendalianRisikoStats = await getPengendalianRisikoStats();
  const totalTreatData = pengendalianRisikoStats.totalTreatData;

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <PengendalianRisiko
          totalTreatData={totalTreatData}
          userSession={user}
        />
      </Suspense>
    </>
  );
}

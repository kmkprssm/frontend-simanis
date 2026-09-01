import { Suspense } from "react";
import type { Metadata } from "next";

import { Loader } from "@/components/ui/loader";
import { PencatatanKejadianRisiko } from "@/components/pencatatan-kejadian-risiko";

export const metadata: Metadata = {
  title: "Pencatatan Kejadian Risiko",
  description: "Ringkasan data manajemen risiko.",
};

export default async function PencatatanKejadianRisikoPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <PencatatanKejadianRisiko />
      </Suspense>
    </>
  );
}

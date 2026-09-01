import { Suspense } from "react";

import { Loader } from "@/components/ui/loader";
import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { LaporanKejadianRisikoTab } from "@/components/pemantauan-tinjauan/tabs/laporan-kejadian-risiko";

export const metadata: Metadata = {
  title: "Pemantauan & Tinjauan - Rekap Laporan Kejadian Risiko",
  description: "Ringkasan data manajemen risiko.",
};

export default async function LaporanKejadianRisikoPage() {
  const user = await currentUser();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      }
    >
      <LaporanKejadianRisikoTab session={user} />
    </Suspense>
  );
}

import { Suspense } from "react";

import { Loader } from "@/components/ui/loader";
import type { Metadata } from "next";
import { LaporanTab } from "@/components/pemantauan-tinjauan/tabs/laporan";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pemantauan & Tinjauan - Rekap laporan",
  description: "Ringkasan data manajemen risiko.",
};

export default async function LaporanPage() {
  const user = await currentUser();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      }
    >
      <LaporanTab session={user} />
    </Suspense>
  );
}

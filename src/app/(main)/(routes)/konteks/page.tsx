import { Suspense } from "react";

import PenetapanKonteks from "@/components/penetapan-konteks";
import { Loader } from "@/components/ui/loader";
import { getKonteks } from "@/server/apis/penetapan-konteks";
import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Penetapan Konteks",
  description: "Ringkasan data manajemen risiko.",
};

export default async function PenetapanKonteksPage() {
  const konteksData = await getKonteks(1, 10);
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
        <PenetapanKonteks data={konteksData?.data} user={user} />
      </Suspense>
    </>
  );
}

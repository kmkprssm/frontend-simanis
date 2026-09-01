import { Suspense } from "react";
import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";
import { RisikoAktifTab } from "@/components/pemantauan-tinjauan/tabs/risiko-aktif";
import { Loader } from "@/components/ui/loader";
import CONST from "@/lib/constants";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pemantauan & Tinjauan - Risiko Aktif",
  description: "Ringkasan data manajemen risiko.",
};

async function getFirstPageRisks() {
  const limit = 6;
  const type = "active";
  const user = await currentUser();

  const res = await fetch(
    `${CONST.API_BASE_URL}/risks/monitoring?type=${type}&page=1&limit=${limit}&search=`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function RisikoAktifPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["risks", "monitoring", "active", ""],
    initialPageParam: 1,
    queryFn: () => getFirstPageRisks(),
    pages: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.risiko?.meta?.hasMore) {
        return lastPage.risiko.meta.page + 1;
      }
      return undefined;
    },
  });

  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RisikoAktifTab />
      </HydrationBoundary>
    </Suspense>
  );
}

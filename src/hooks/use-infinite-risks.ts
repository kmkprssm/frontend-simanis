import { getMonitoringRisiko } from "@/server/apis/risiko";
import { TPemantauanRisikoWithMeta } from "@/types/pemantauan-risiko-type";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteRisksProps {
  type?: "active" | "closed";
  search?: string;
  limit?: number;
}

export function useInfiniteRisks({
  type = "active",
  search = "",
  limit = 6,
}: UseInfiniteRisksProps) {
  return useInfiniteQuery<TPemantauanRisikoWithMeta, Error>({
    queryKey: ["risks", "monitoring", type, search],

    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) =>
      await getMonitoringRisiko(type, pageParam as number, limit, search),

    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasMore) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },

    placeholderData: (previousData) => previousData,
  });
}

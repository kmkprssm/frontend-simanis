import { getChoosedRisks } from "@/server/apis/risiko";
import { FetchRisksChoosedResponse } from "@/types/risiko-type";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteChoosedRisksProps {
  type?: "all" | "active" | "closed";
  search?: string;
  limit?: number;
  strategi?: string;
  mode?: string;
  bulan?: number;
  tahun?: number;
}

export function useInfiniteChoosedRisks({
  type = "all",
  search = "",
  limit = 10,
  strategi = "",
  mode = "",
  bulan,
  tahun,
}: UseInfiniteChoosedRisksProps) {
  return useInfiniteQuery<FetchRisksChoosedResponse, Error>({
    queryKey: [
      "risks",
      "infinite-choosed-risks",
      type,
      search,
      strategi,
      mode,
      bulan,
      tahun,
    ],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) =>
      await getChoosedRisks(
        type,
        pageParam as number,
        limit,
        search,
        strategi,
        mode,
        bulan,
        tahun,
      ),

    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.hasMore) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },

    placeholderData: (previousData) => previousData,
  });
}

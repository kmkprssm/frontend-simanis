import { useInfiniteQuery } from "@tanstack/react-query";
import { getChoosenRisiko } from "@/server/apis/pencatatan-kejadian-risiko";
import { FetchRisksResponse } from "@/types/pencatatan-kejadian-risiko-type";

interface UseInfiniteRisksProps {
  search?: string;
  limit?: number;
}

export function useInfiniteRisksKejadian({
  search = "",
  limit = 10,
}: UseInfiniteRisksProps) {
  return useInfiniteQuery<FetchRisksResponse, Error>({
    queryKey: ["risks", "infinite-kejadian", search],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) =>
      await getChoosenRisiko(pageParam, limit, search),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasMore) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },

    placeholderData: (previousData) => previousData,
  });
}

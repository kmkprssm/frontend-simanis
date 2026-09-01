import { useInfiniteQuery } from "@tanstack/react-query";

import { getUsersForFilter } from "@/server/apis/users";
import { TFetchUsersResponse } from "@/types/user-type";

interface UseInfiniteUsersProps {
  search?: string;
  limit?: number;
}

export function useInfiniteUsers({
  search = "",
  limit = 10,
}: UseInfiniteUsersProps) {
  return useInfiniteQuery<TFetchUsersResponse, Error>({
    queryKey: ["users", "infinite-users", search],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) =>
      await getUsersForFilter(pageParam as number, limit, search),

    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.hasMore) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },

    placeholderData: (previousData) => previousData,
  });
}

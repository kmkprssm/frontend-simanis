import CONST from "@/lib/constants";
import { TProfileRisiko } from "@/types/profile-risiko-type"; // Sesuaikan path type Anda
import { useInfiniteQuery } from "@tanstack/react-query";

interface FetchProfileResponse {
  profile_risiko: TProfileRisiko[];
  meta: {
    page: number;
    limit: number;
    totalRows: number;
    hasMore: boolean;
  };
}

interface UseInfiniteProfileRisksProps {
  token?: string;
  limit?: number;
}

export function useInfiniteProfileRisiko({
  token,
  limit = 12,
}: UseInfiniteProfileRisksProps) {
  return useInfiniteQuery<FetchProfileResponse, Error>({
    queryKey: ["profile-risiko", "infinite"],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${CONST.API_BASE_URL}/profile-risiko?page=${pageParam}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data profil risiko");
      }

      return response.json();
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasMore) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },

    placeholderData: (previousData) => previousData,
  });
}

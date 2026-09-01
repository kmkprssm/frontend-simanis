import { useQuery } from "@tanstack/react-query";

import { getKejadianRisiko } from "@/server/apis/pencatatan-kejadian-risiko";
import { TGetKejadianRisikoResponse } from "@/types/pencatatan-kejadian-risiko-type";

interface UseQueryKejadianRisikoProps {
  tahun: number;
}

export const useQueryKejadianRisiko = ({
  tahun,
}: UseQueryKejadianRisikoProps) => {
  return useQuery<TGetKejadianRisikoResponse, Error>({
    queryKey: ["kejadianRisiko", tahun],
    queryFn: async () => await getKejadianRisiko(tahun),
  });
};

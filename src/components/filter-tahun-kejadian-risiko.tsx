import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { IconRefresh } from "@tabler/icons-react";

import { TGetKejadianRisikoResponse } from "@/types/pencatatan-kejadian-risiko-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FilterTahunKejadianRisikoProps {
  tahunFilter?: number;
  setTahunFilter: React.Dispatch<React.SetStateAction<number>>;
  listTahunOptions?: number[];
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<NoInfer<TGetKejadianRisikoResponse>, Error>>;
  loading?: boolean;
  isFetching?: boolean;
}

export const FilterTahunKejadianRisiko = ({
  listTahunOptions,
  refetch,
  setTahunFilter,
  tahunFilter,
  isFetching,
  loading,
}: FilterTahunKejadianRisikoProps) => {
  return (
    <div className="flex items-center gap-2 self-start md:self-center">
      <span className="text-xs font-semibold text-slate-600">Pilih Tahun:</span>
      <Select
        value={tahunFilter?.toString()}
        onValueChange={(value) => setTahunFilter(parseInt(value))}
      >
        <SelectTrigger className="h-9 w-30 border-slate-200 font-medium text-slate-800">
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent>
          {listTahunOptions?.map((th) => (
            <SelectItem key={th} value={th.toString()} className="font-medium">
              {th}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-slate-200 text-slate-500 hover:bg-slate-50"
        onClick={() => refetch()}
        disabled={loading || isFetching}
      >
        <IconRefresh
          className={cn("h-4 w-4", (loading || isFetching) && "animate-spin")}
        />
      </Button>
    </div>
  );
};

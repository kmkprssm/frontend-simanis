"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modal-store";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HistoriRisikoDetail } from "./histori-risiko-detail";

interface CellActionsProps {
  data: TRisikoAktifMitigasiItem;
}

export const CellActions = ({ data }: CellActionsProps) => {
  const { onOpen } = useModalStore();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="edit"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                onOpen(
                  "detail",
                  {
                    title: "Detail Pengendalian Risiko",
                    message: <>Informasi risiko yang telah diselesaikan.</>,
                    childrenDetail: <HistoriRisikoDetail itemRisiko={data} />,
                  },
                  {
                    pengendalianRisikoDitutupDatas: data,
                  },
                )
              }
            >
              <IconInfoCircle className="h-4 w-4 text-indigo-50" stroke={2} />
              <span>Detail</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Detail Pengendalian</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

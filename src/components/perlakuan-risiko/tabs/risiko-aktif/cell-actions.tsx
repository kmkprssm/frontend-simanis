"use client";

import { IconShieldCog, IconBriefcase } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modal-store";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateMitigasiStats } from "@/helpers/perlakuan-risiko-helper";

interface CellActionsProps {
  data: TRisikoAktifMitigasiItem;
}

export const CellActions = ({ data }: CellActionsProps) => {
  const { onOpen } = useModalStore();
  const { totalKontrol } = calculateMitigasiStats(data);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-indigo-200 bg-indigo-50/30 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
              onClick={() =>
                onOpen(
                  "managePengendalian",
                  {
                    title: "Tambah Pengendalian Risiko",
                    message: (
                      <>
                        Tambahkan pengendalian risiko sesuai risiko yang
                        dipilih.
                      </>
                    ),
                  },
                  {
                    pengendalianRisikoAktifDatas: data,
                  },
                )
              }
            >
              <IconShieldCog className="h-4 w-4 text-indigo-600" stroke={2} />
              <span>Pengendalian</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Kelola Dokumen Pengendalian</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-sky-200 bg-sky-50/30 text-xs font-semibold text-sky-700 hover:bg-sky-50 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={totalKontrol === 0}
                onClick={() => {
                  onOpen(
                    "manageTindakan",
                    {
                      title: "Manajemen Tindakan Risiko",
                      message: `Risiko: ${data.nama_resiko}`,
                    },
                    { pengendalianRisikoAktifDatas: data },
                  );
                }}
              >
                <IconBriefcase className="h-4 w-4 text-sky-600" stroke={2} />
                <span>Tindakan</span>
              </Button>
            </span>
          </TooltipTrigger>
          {totalKontrol === 0 && (
            <TooltipContent className="border-none bg-rose-500 text-white shadow-md">
              Wajib menambahkan pengendalian terlebih dahulu!
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

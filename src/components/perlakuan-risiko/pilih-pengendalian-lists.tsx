"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TKontrolRisikoWithActions } from "@/types/perlakuan-risiko-type";
import { cn } from "@/lib/utils";
import { getTipeBadgeColor } from "@/helpers/risk-helpers";
import {
  calculateKontrolStats,
  getProgressColor,
} from "@/helpers/perlakuan-risiko-helper";

interface PilihPengendalianListsProps {
  masterListKontrol: TKontrolRisikoWithActions[];
  onSelectControl: (kontrol: TKontrolRisikoWithActions) => void;
}

export const PilihPengendalianLists = ({
  masterListKontrol = [],
  onSelectControl,
}: PilihPengendalianListsProps) => {
  return (
    <div className="space-y-4">
      <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">
        Pilih Kontrol Pengendalian:
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {masterListKontrol.map((kontrol) => {
          const { progressPercentage, totalActions } =
            calculateKontrolStats(kontrol);

          return (
            <div
              key={kontrol.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${getTipeBadgeColor(kontrol.tipe)}`}
                  >
                    {kontrol.tipe}
                  </Badge>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                    {totalActions} Tindakan
                  </span>
                </div>
                <h5 className="line-clamp-2 text-xs leading-snug font-bold text-slate-800">
                  {kontrol.nama_kontrol}
                </h5>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Progres Penyelesaian</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className={cn(
                      "h-1.5",
                      getProgressColor(progressPercentage),
                    )}
                  />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  onClick={() => onSelectControl(kontrol)}
                >
                  Pilih Kontrol Ini
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

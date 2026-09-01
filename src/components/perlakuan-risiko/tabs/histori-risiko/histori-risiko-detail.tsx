import {
  IconHierarchy,
  IconInfoCircle,
  IconListCheck,
  IconPlayerPlay,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRiskLevel, getTipeBadgeColor } from "@/helpers/risk-helpers";
import { cn } from "@/lib/utils";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";

interface HistoriRisikoDetailProps {
  itemRisiko: TRisikoAktifMitigasiItem;
}

export const HistoriRisikoDetail = ({
  itemRisiko,
}: HistoriRisikoDetailProps) => {
  const finalRisk = getRiskLevel((itemRisiko?.score && itemRisiko.score) || 0);

  const masterListKontrol = itemRisiko?.list_kontrol;
  const isClosed =
    itemRisiko.status === "Closed" ||
    itemRisiko.status === "CLOSED" ||
    itemRisiko.status === "DITUTUP";

  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-col gap-1.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base leading-snug font-bold text-slate-900">
            {itemRisiko?.nama_resiko || "NAMA RISIKO BELUM TERDEFINISI"}
          </h3>
          <Badge variant={isClosed ? "danger" : "success"}>
            {isClosed ? "Ditutup" : "Aktif"}
          </Badge>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-xs"
          >
            Kategori: {itemRisiko?.kategori_name || "Umum"}
          </Badge>

          <div className="text-muted-foreground ml-1 flex items-center gap-1 text-xs">
            <IconHierarchy className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              Unit:{" "}
              <span className="font-semibold text-slate-700">
                {itemRisiko?.pemilik_risiko || "Belum ada pemilik"}
              </span>
            </span>
          </div>
          <div className="ml-1 flex items-center gap-1">
            <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              Total Skor:
            </span>
            <span
              className={cn(
                "block text-2xl font-black tracking-tight",
                finalRisk.textClass,
              )}
            >
              {itemRisiko?.score}
            </span>
          </div>
          <div className="ml-1 flex items-center gap-1">
            <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              Tingkat Risiko:
            </span>
            <Badge
              className={cn(
                "border-none px-2.5 py-0.5 text-[11px] font-bold shadow-sm shadow-black/10",
                finalRisk.badgeClass,
              )}
            >
              {finalRisk.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100/50 bg-indigo-50/30 p-3 text-xs text-slate-600">
        <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800">Deskripsi Risiko</span>
          <p className="leading-normal text-slate-500">
            {itemRisiko?.deskripsi ||
              "Tidak ada deskripsi kontekstual risiko..."}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-bold uppercase">Daftar Pengendalian</div>
        <div className="grid grid-cols-1 gap-3.5">
          {masterListKontrol.map((kontrol) => {
            const actionsList = kontrol.actions || [];
            const totalActions = actionsList.length;
            const completedActions = actionsList.filter(
              (a) => a.status === "Closed",
            ).length;

            const percent =
              actionsList.length > 0
                ? Math.round((completedActions / actionsList.length) * 100)
                : 0;

            return (
              <Card
                key={kontrol.id}
                className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white py-2 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
              >
                <div className="space-y-3.5 p-2">
                  <div className="flex items-center justify-between gap-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase shadow-2xs",
                        getTipeBadgeColor(kontrol.tipe),
                      )}
                    >
                      {kontrol.tipe}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <IconPlayerPlay
                        className="h-4 w-4 text-sky-500"
                        stroke={2}
                      />
                      <span className="text-xs font-medium text-slate-600">
                        {totalActions} Tindakan
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-sm leading-snug font-bold tracking-tight text-slate-900">
                      {kontrol.nama_kontrol}
                    </h5>
                    {kontrol.deskripsi && (
                      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed font-normal">
                        {kontrol.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 border-t border-slate-100/60 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-medium">
                      <span className="flex items-center gap-1 text-slate-400">
                        <IconListCheck className="h-3.5 w-3.5 text-slate-400" />
                        Progress Aksi:{" "}
                        <span className="font-bold text-slate-700">
                          {completedActions}/{totalActions} Selesai
                        </span>
                      </span>
                      <span
                        className={cn(
                          "font-bold",
                          percent === 100
                            ? "text-emerald-600"
                            : "text-slate-700",
                        )}
                      >
                        {percent}%
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-full">
                      <Progress
                        value={percent}
                        className={cn(
                          "h-2 w-full bg-slate-100 transition-all [&>div]:duration-500",
                          percent === 100
                            ? "[&>div]:bg-emerald-500"
                            : percent >= 50
                              ? "[&>div]:bg-amber-500"
                              : "[&>div]:bg-red-500",
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

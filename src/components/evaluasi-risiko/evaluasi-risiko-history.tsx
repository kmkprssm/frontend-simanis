"use client";

import {
  IconUser,
  IconCalendar,
  IconFolderSearch,
  IconClockHour4,
  IconArchive,
} from "@tabler/icons-react";

import { TEvaluasiRisiko } from "@/types/evaluasi-risiko-type";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn, dateTimeFormat } from "@/lib/utils";
import { PRIORITAS_CONFIG, STRATEGI_CONFIG } from "@/helpers/risk-helpers";

interface EvaluasiRisikoHistoryProps {
  data: TEvaluasiRisiko[];
}

export const EvaluasiRisikoHistory = ({ data }: EvaluasiRisikoHistoryProps) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-8 text-center">
        <IconArchive className="mb-2 h-10 w-10 animate-pulse stroke-[1.5] text-slate-300" />
        <h5 className="text-sm font-bold text-slate-700">
          Belum Ada Riwayat Evaluasi
        </h5>
        <p className="mt-0.5 max-w-65 text-xs text-slate-400">
          Risiko operasional ini belum pernah melewati tahapan evaluasi
          penanganan berkala.
        </p>
      </div>
    );
  }

  const riskInfo = data[0];
  const isClosed =
    riskInfo.status_risiko?.toUpperCase() === "CLOSED" ||
    riskInfo.status_risiko?.toUpperCase() === "DITUTUP";

  return (
    <div className="space-y-5 p-6 py-2">
      {/* HEADER RINGKASAN RISIKO */}
      <div className="text-primary rounded-xl border border-zinc-100 bg-zinc-200 p-3.5 shadow-sm">
        <h4 className="line-clamp-2 text-sm leading-normal font-bold">
          {riskInfo.nama_resiko || "Judul Risiko"}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-800">
          <span>
            Unit:{" "}
            <span className="text-foreground font-semibold">
              {riskInfo.evaluator_name || "Belum ada pemilik"}
            </span>
          </span>
          <div className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
          <span>
            Total Evaluasi:{" "}
            <span className="rounded-full bg-blue-600/20 px-1.5 py-0.5 font-bold text-blue-500">
              {data.length} Evaluasi
            </span>
          </span>
          <div className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
          <Badge
            className={cn(
              "flex border-none px-2 py-2 text-[10px] font-bold",
              isClosed ? "bg-emerald-600" : "bg-amber-500",
            )}
          >
            Status: {riskInfo.status_risiko === "Open" ? "Aktif" : "Ditutup"}
          </Badge>
        </div>
      </div>

      {/* BANNER AUDIT TRAIL JIKALAU RISIKO CLOSED */}
      {isClosed && (
        <Alert className="rounded-lg border-blue-200 bg-blue-50/50 p-3 text-blue-800">
          <div className="flex items-start gap-2.5 text-xs">
            <IconFolderSearch className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <AlertDescription className="leading-normal text-blue-700">
              <strong className="font-bold">Mode Audit Trail Aktif:</strong>{" "}
              Seluruh riwayat historis ini telah dibekukan secara permanen
              karena status risiko utama telah dinyatakan ditutup.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* KONTEN UTAMA: JALUR TIMELINE VERTIKAL */}
      <div className="relative space-y-6 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-slate-200">
        {data.map((item, index) => {
          const isLatest = index === 0;

          const upperStr = item.strategi?.toUpperCase() || "";
          let stratKey: keyof typeof STRATEGI_CONFIG | null = null;
          if (upperStr.includes("TREAT")) stratKey = "TREAT";
          else if (upperStr.includes("TRANSFER")) stratKey = "TRANSFER";
          else if (upperStr.includes("AVOID")) stratKey = "AVOID";
          else if (upperStr.includes("ACCEPT")) stratKey = "ACCEPT";

          const strat = stratKey ? STRATEGI_CONFIG[stratKey] : null;
          const prio = item.prioritas
            ? PRIORITAS_CONFIG[
                Number(item.prioritas) as keyof typeof PRIORITAS_CONFIG
              ]
            : null;

          return (
            <div key={item.id || index} className="group relative">
              {/* INDIKATOR BULATAN TIMELINE */}
              <div
                className={cn(
                  "absolute top-1.5 -left-5.5 h-3 w-3 rounded-full border-2 transition-all duration-300",
                  isLatest
                    ? "scale-110 border-white bg-emerald-500 ring-4 ring-emerald-500/20"
                    : "border-slate-300 bg-white group-hover:border-slate-400",
                )}
              />

              {/* CARD ELEMEN EVALUASI */}
              <Card
                className={cn(
                  "overflow-hidden border py-2 shadow-xs transition-all duration-200",
                  isLatest
                    ? "border-emerald-200 bg-green-100/20 shadow-xs ring-1 ring-emerald-500/5"
                    : "border-slate-150 bg-white",
                )}
              >
                {/* SUB HEADER EVALUASI */}
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2",
                    isLatest
                      ? "border-emerald-100 bg-emerald-50/50"
                      : "border-slate-100 bg-slate-50/50",
                  )}
                >
                  {/* IDENTITAS EVALUATOR / UNIT */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <IconUser className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">
                      {item.evaluator_name || "Petugas Evaluator"}
                    </span>
                    {isLatest && (
                      <span className="flex items-center gap-0.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        <IconClockHour4 className="h-2.5 w-2.5" /> Terbaru
                        (Aktif)
                      </span>
                    )}
                  </div>

                  {/* TANGGAL TRANSAKSI */}
                  <div className="text-muted-foreground flex items-center gap-1 text-[11px] font-medium">
                    <IconCalendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {item.created_at ? dateTimeFormat(item.created_at) : "-"}
                    </span>
                  </div>
                </div>

                {/* KONTEN BADGE MATRIKS STRATEGI & PRIORITAS */}
                <CardContent className="space-y-3 p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Badge Strategi */}
                    {strat ? (
                      <Badge
                        className={cn(
                          "flex items-center gap-1 rounded-full border-none px-2.5 py-0.5 text-[10px] font-bold shadow-xs",
                          strat.badgeClass,
                        )}
                      >
                        <strat.icon className="h-3 w-3" />
                        <span>{strat.label}</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        {item.strategi || "Tanpa Strategi"}
                      </Badge>
                    )}

                    {/* Badge Prioritas */}
                    {prio && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                          prio.badgeClass,
                        )}
                      >
                        <prio.icon className="h-3 w-3" />
                        <span>Prioritas: {prio.label}</span>
                      </Badge>
                    )}
                  </div>

                  {/* BOX JUSTIFIKASI / CATATAN */}
                  <div className="rounded-lg border border-zinc-100/70 bg-zinc-100 p-2.5 text-xs leading-relaxed wrap-break-word text-zinc-600">
                    <span className="mb-0.5 block text-[11px] font-bold tracking-wide text-zinc-700 uppercase">
                      Uraian Justifikasi:
                    </span>
                    <p className="whitespace-pre-line text-zinc-500">
                      {item.justifikasi ||
                        "Tidak ada catatan justifikasi tambahan."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* FOOTER INFORMASI BAWAH */}
      <div className="pt-1 text-center text-[10px] font-medium text-zinc-400">
        💡 Menggunakan skema urutan kronologis waktu terbalik (Terbaru ke
        Terlama).
      </div>
    </div>
  );
};

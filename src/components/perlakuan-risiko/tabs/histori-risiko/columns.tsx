import { ColumnDef } from "@tanstack/react-table";
import { IconShieldCheck, IconPlayerPlay } from "@tabler/icons-react";

import { CellActions } from "./cell-actions";
import { cn, dateTimeFormat } from "@/lib/utils";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";
import { calculateMitigasiStats } from "@/helpers/perlakuan-risiko-helper";
import { Badge } from "@/components/ui/badge";
import { getRiskLevel } from "@/helpers/risk-helpers";

export const columns: ColumnDef<TRisikoAktifMitigasiItem>[] = [
  {
    accessorKey: "nama_resiko",
    header: "Risiko",
    cell: ({ row }) => {
      const namaRisiko = row.getValue("nama_resiko") as string;
      const pemilik = row.original.pemilik_risiko;

      return (
        <div className="flex flex-col font-medium wrap-break-word">
          <span className="text-sm font-semibold text-slate-900">
            {namaRisiko}
          </span>
          <p className="text-muted-foreground mt-0.5 text-xs font-normal">
            Pemilik:{" "}
            <span className="font-medium text-slate-700">
              {pemilik || "Belum ditentukan"}
            </span>
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status Risiko",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isClosed =
        status === "Closed" || status === "CLOSED" || status === "DITUTUP";

      return (
        <Badge
          variant={isClosed ? "outline" : "default"}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
            isClosed
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700",
          )}
        >
          {isClosed ? "Ditutup" : "Aktif"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "score",
    header: "Level Risiko",
    cell: ({ row }) => {
      const score = row.getValue("score") as number;
      const likelihood = row.original.likelihood;
      const impact = row.original.impact;

      const riskConfig = getRiskLevel(score);

      return (
        <div className="flex items-center gap-2">
          <Badge
            className={`border-border h-8 w-8 text-sm font-bold shadow-inner transition-colors duration-300 ${riskConfig.circleClass}`}
          >
            {score}
          </Badge>
          <div className="flex flex-col text-[11px]">
            <Badge
              className={`border-none px-3 py-1 text-xs font-bold shadow-sm ${riskConfig.badgeClass}`}
            >
              {riskConfig.label}
            </Badge>
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              L{likelihood} × I{impact}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "mitigasi_counts",
    header: "Struktur Mitigasi",
    cell: ({ row }) => {
      const { totalKontrol, totalActions } = calculateMitigasiStats(
        row.original,
      );

      return (
        <div className="flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <IconShieldCheck className="h-4 w-4 text-indigo-500" stroke={2} />
            <span className="text-xs font-medium text-slate-700">
              {totalKontrol} Kontrol
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconPlayerPlay className="h-4 w-4 text-sky-500" stroke={2} />
            <span className="text-xs font-medium text-slate-600">
              {totalActions} Tindakan
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "progress_mitigasi",
    header: "Progres Tindakan",
    cell: ({ row }) => {
      const { progressPercentage, closedActions, totalActions } =
        calculateMitigasiStats(row.original);

      const progressColor =
        progressPercentage >= 80
          ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
          : progressPercentage >= 50
            ? "bg-gradient-to-r from-amber-500 to-amber-400"
            : "bg-gradient-to-r from-red-500 to-red-400";

      return (
        <div className="flex min-w-25 flex-col items-start gap-1">
          <div className="flex w-full items-center justify-between text-xs font-bold text-slate-800">
            <span>{progressPercentage}%</span>
            <span className="text-muted-foreground text-[11px] font-normal">
              {closedActions}/{totalActions} Selesai
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full transition-all duration-300",
                progressColor,
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Tanggal Selesai",
    cell: ({ row }) => {
      const tanggal = row.getValue("updated_at") as Date;
      return <div className="font-semibold">{dateTimeFormat(tanggal)}</div>;
    },
  },
  {
    id: "actions",
    header: "Detail Pengendalian",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];

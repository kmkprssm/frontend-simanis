import { ColumnDef } from "@tanstack/react-table";
import {
  IconShieldCheck,
  IconPlayerPlay,
  IconAlertCircle,
  IconHourglassHigh,
  IconClock,
} from "@tabler/icons-react";
import { differenceInDays, startOfDay } from "date-fns";

import { CellActions } from "./cell-actions";
import { cn, truncate } from "@/lib/utils";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";
import { calculateMitigasiStats } from "@/helpers/perlakuan-risiko-helper";
import { Badge } from "@/components/ui/badge";
import {
  getRiskLevel,
  normalizeStrategi,
  STRATEGI_CONFIG,
} from "@/helpers/risk-helpers";

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
            {truncate(namaRisiko, 50)}
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
          variant={isClosed ? "closed" : "active"}
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
        >
          {isClosed ? "Ditutup" : "Aktif"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "strategi",
    header: "Strategi",
    cell: ({ row }) => {
      const rawStrategi = row.getValue("strategi") as string;
      const normalized = normalizeStrategi(rawStrategi);

      if (!normalized) {
        return (
          <span className="text-xs font-medium text-slate-400">
            {rawStrategi || "-"}
          </span>
        );
      }

      const cfg = STRATEGI_CONFIG[normalized];
      const Icon = cfg.icon;

      return (
        <div className="font-medium">
          <div className="flex items-center">
            <Badge
              className={cn(
                "flex min-w-25 items-center justify-center gap-1 rounded-full border-none px-2.5 py-1 text-[11px] font-bold tracking-wide shadow-xs",
                cfg.badgeClass,
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{cfg.label}</span>
            </Badge>
          </div>
        </div>
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
        <div className="flex w-fit flex-col items-center justify-center px-2 text-center">
          <Badge
            className={`border-none px-3 py-1 text-xs font-bold shadow-sm ${riskConfig.badgeClass}`}
          >
            {riskConfig.label}
          </Badge>
          <div
            className={`mt-2 flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold shadow-inner transition-colors duration-300 ${riskConfig.circleClass}`}
          >
            {score}
          </div>
          <Badge
            variant={"outline"}
            className="text-muted-foreground mt-1.5 text-xs font-semibold tracking-wider uppercase"
          >
            L{likelihood} × I{impact}
          </Badge>
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

          {/* Progress Bar */}
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
    id: "status_deadline",
    header: "Status Batas Waktu",
    cell: ({ row }) => {
      const item = row.original;

      if (item.has_overdue_action) {
        return (
          <Badge className="shadow-3xs flex w-fit items-center gap-1 border-none bg-rose-50 px-2.5 py-1 text-[11px] font-black tracking-wide text-rose-600 hover:bg-rose-50">
            <IconAlertCircle className="h-3.5 w-3.5 animate-pulse text-rose-500" />
            <span>Tindakan Melewati Deadline</span>
          </Badge>
        );
      }

      const allActions = item.list_kontrol.flatMap((k) => k.actions || []);
      const activeActions = allActions.filter(
        (a) => a.status !== "Closed" && a.target_date,
      );

      if (activeActions.length === 0) {
        return (
          <span className="text-xs font-medium text-slate-400">
            Tidak ada target aktif
          </span>
        );
      }

      const today = startOfDay(new Date());
      const daysRemainingList = activeActions.map((a) =>
        differenceInDays(startOfDay(new Date(a.target_date)), today),
      );
      const minDaysRemaining = Math.min(...daysRemainingList);

      if (minDaysRemaining <= 3) {
        return (
          <Badge className="shadow-3xs flex w-fit items-center gap-1 border-none bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-50">
            <IconHourglassHigh className="h-3.5 w-3.5 text-amber-500" />
            <span>Mendesak ({minDaysRemaining} hari lagi)</span>
          </Badge>
        );
      }

      return (
        <Badge className="shadow-3xs flex w-fit items-center gap-1 border-none bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-50">
          <IconClock className="h-3.5 w-3.5 text-sky-500" />
          <span>Sisa {minDaysRemaining} Hari</span>
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi Manajemen",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];

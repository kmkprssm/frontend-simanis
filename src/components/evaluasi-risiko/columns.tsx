import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../ui/badge";
import { CellActions } from "./cell-actions";
import { TEvaluasiRisiko } from "@/types/evaluasi-risiko-type";
import { cn, dateTimeFormat, truncate } from "@/lib/utils";
import {
  getStatusRisiko,
  PRIORITAS_CONFIG,
  STRATEGI_CONFIG,
} from "@/helpers/risk-helpers";

const normalizeStrategi = (
  strategi: string | null | undefined,
): keyof typeof STRATEGI_CONFIG | null => {
  if (!strategi) return null;
  const upper = strategi.toUpperCase().trim();

  if (upper.includes("ACCEPT")) return "ACCEPT";
  if (upper.includes("TREAT")) return "TREAT";
  if (upper.includes("TRANSFER")) return "TRANSFER";
  if (upper.includes("AVOID")) return "AVOID";

  return null;
};

export const columns: ColumnDef<TEvaluasiRisiko>[] = [
  {
    accessorKey: "nama_resiko",
    header: "Risiko",
    cell: ({ row }) => {
      const namaRisiko = row.getValue("nama_resiko") as string;
      const pemilik = row.original.evaluator_name;

      return (
        <div className="flex flex-col font-medium wrap-break-word">
          <span className="text-sm text-slate-900">
            {truncate(namaRisiko, 50)}
          </span>
          <p className="text-muted-foreground mt-0.5 text-xs font-normal">
            {pemilik || "Belum ada pemilik"}
          </p>
        </div>
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
    accessorKey: "prioritas",
    header: "Prioritas",
    cell: ({ row }) => {
      const rawPrioritas = row.getValue("prioritas");
      const prioritasKey =
        rawPrioritas !== undefined ? Number(rawPrioritas) : null;

      if (!prioritasKey || !(prioritasKey in PRIORITAS_CONFIG)) {
        return <span className="text-xs font-medium text-slate-400">-</span>;
      }

      const cfg =
        PRIORITAS_CONFIG[prioritasKey as keyof typeof PRIORITAS_CONFIG];
      const Icon = cfg.icon;

      return (
        <div className="font-semibold">
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-xs",
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
    accessorKey: "justifikasi",
    header: "Justifikasi",
    cell: ({ row }) => {
      const justifikasi = row.getValue("justifikasi") as string;

      return (
        <div className="text-muted-foreground font-normal">
          {justifikasi.substring(0, 40) || "-"}
          {justifikasi.length > 40 && "..."}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Evaluasi",
    cell: ({ row }) => {
      const tanggal = row.getValue("created_at") as Date;
      return <div className="font-semibold">{dateTimeFormat(tanggal)}</div>;
    },
  },
  {
    accessorKey: "status_risiko",
    header: "Status Risiko",
    cell: ({ row }) => {
      const status = row.getValue("status_risiko") as string;
      const statusInfo = getStatusRisiko(status);
      return (
        <div className="font-semibold">
          <Badge variant={statusInfo.badgeClass}>{statusInfo.label}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];

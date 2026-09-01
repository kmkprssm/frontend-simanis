import { ColumnDef } from "@tanstack/react-table";
import { CATEGORY_COLORS, getRiskLevel } from "@/helpers/risk-helpers";
import { IconAlertTriangle } from "@tabler/icons-react";
import { TAnalisisResiduRisiko } from "@/types/analisis-risiko-type";
import { Badge } from "@/components/ui/badge";
import { CellActions } from "./cell-actions";
import { cn, truncate } from "@/lib/utils";

export const columns: ColumnDef<TAnalisisResiduRisiko>[] = [
  {
    accessorKey: "nama_resiko",
    header: "Risiko / Pemilik",
    cell: ({ row }) => {
      const namaRisiko = row.getValue("nama_resiko") as string;
      const pemilik = row.original.pemilik_risiko;

      return (
        <div className="flex flex-col font-medium wrap-break-word">
          <span className="text-sm text-slate-900">
            {truncate(namaRisiko, 50)}
          </span>
          <span className="text-muted-foreground mt-0.5 text-xs font-normal">
            👤 {pemilik || "Belum ada pemilik"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "kategori_name",
    header: "Kategori",
    cell: ({ row }) => {
      const kategori = row.getValue("kategori_name") as string;
      const customBg =
        CATEGORY_COLORS[kategori as keyof typeof CATEGORY_COLORS] || "#64748b";

      return (
        <Badge
          style={{ backgroundColor: customBg }}
          className="border-none px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white shadow-sm"
        >
          {kategori}
        </Badge>
      );
    },
  },
  {
    accessorKey: "inherent_score",
    header: "Skala Before (Inherent)",
    cell: ({ row }) => {
      const scoreBefore = row.getValue("inherent_score") as number | null;
      if (scoreBefore === null || scoreBefore === 0) {
        return (
          <span className="text-xs text-slate-400 italic">Belum diisi</span>
        );
      }

      const riskConfig = getRiskLevel(scoreBefore);
      return (
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold shadow-inner ${riskConfig.circleClass}`}
          >
            {scoreBefore}
          </div>
          <div className="flex flex-col text-[11px]">
            <span className={cn("font-semibold", riskConfig.textClass)}>
              {riskConfig.label}
            </span>
            <span className="text-slate-400">
              L{row.original.likelihood_before}×I{row.original.impact_before}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "score_after",
    header: "Skala After (Residual)",
    cell: ({ row }) => {
      const scoreAfter = row.getValue("score_after") as number | null;
      if (scoreAfter === null) {
        return (
          <span className="text-xs text-slate-400 italic">— Belum dinilai</span>
        );
      }

      const riskConfig = getRiskLevel(scoreAfter);
      return (
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold shadow-inner ${riskConfig.circleClass}`}
          >
            {scoreAfter}
          </div>
          <div className="flex flex-col text-[11px]">
            <span className="font-semibold text-slate-700">
              {riskConfig.label}
            </span>
            <span className="text-slate-400">
              L{row.original.likelihood_after}×I{row.original.impact_after}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "pernah_terjadi",
    header: "Status Kejadian (Tahun Ini)",
    cell: ({ row }) => {
      const pernahTerjadi = row.getValue("pernah_terjadi") as boolean;
      return pernahTerjadi ? (
        <Badge className="gap-1 border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 shadow-none">
          <IconAlertTriangle
            size={12}
            className="animate-pulse text-rose-600"
          />
          Pernah Terjadi
        </Badge>
      ) : (
        <Badge className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 shadow-none">
          Nihil Kejadian
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi Evaluasi & Residu",
    cell: ({ row }) => <CellActions rowData={row.original} />,
  },
];

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../ui/badge";
import { CellActions } from "./cell-actions";
import { TAnalisisRisiko } from "@/types/analisis-risiko-type";
import {
  CATEGORY_COLORS,
  getRiskLevel,
  getStatusRisiko,
} from "@/helpers/risk-helpers";
import { ExtendedUser } from "@/next-auth";
import { truncate } from "@/lib/utils";

export const getColumns = (
  user?: ExtendedUser,
): ColumnDef<TAnalisisRisiko>[] => [
  {
    accessorKey: "nama_resiko",
    header: "Risiko",
    cell: ({ row }) => {
      const namaRisiko = row.getValue("nama_resiko") as string;
      const pemilik = row.original.pemilik_risiko;

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
    accessorKey: "kategori_name",
    header: "Kategori",
    cell: ({ row }) => {
      const kategori = row.getValue(
        "kategori_name",
      ) as keyof typeof CATEGORY_COLORS;
      const customBg = CATEGORY_COLORS[kategori] || "#64748b";

      return (
        <div className="font-medium">
          <Badge
            style={{ backgroundColor: customBg }}
            className="border-none px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white shadow-sm"
          >
            {kategori}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    header: "Score (L × I)",
    cell: ({ row }) => {
      const score = row.getValue("score") as number;
      const likelihood = row.original.likelihood;
      const impact = row.original.impact;

      const riskConfig = getRiskLevel(score);

      return (
        <div className="flex w-fit flex-col items-center justify-center px-2 text-center">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold shadow-inner transition-colors duration-300 ${riskConfig.circleClass}`}
          >
            {score}
          </div>

          <small className="text-muted-foreground mt-1.5 text-[10px] font-semibold tracking-wider uppercase">
            L{likelihood} × I{impact}
          </small>
        </div>
      );
    },
  },
  {
    accessorKey: "level_resiko",
    header: "Level Risiko",
    cell: ({ row }) => {
      const score = row.original.score;
      const riskConfig = getRiskLevel(score);

      return (
        <div className="font-semibold">
          <Badge
            className={`border-none px-3 py-1 text-xs font-bold shadow-sm ${riskConfig.badgeClass}`}
          >
            {riskConfig.label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status Risiko",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
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
    cell: ({ row }) => <CellActions data={row.original} user={user} />,
  },
];

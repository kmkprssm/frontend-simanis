import { ColumnDef } from "@tanstack/react-table";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconHourglassHigh,
} from "@tabler/icons-react";

import { CellActions } from "./cell-actions";
import { cn } from "@/lib/utils";
import { TDataBulan } from "@/types/pencatatan-kejadian-risiko-type";
import { Badge } from "@/components/ui/badge";
import { getNamaBulanIndo } from "@/helpers/risk-helpers";

export const columns: ColumnDef<TDataBulan>[] = [
  {
    id: "periode_bulan",
    header: "Bulan",
    cell: ({ row }) => {
      const { bulan, tahun } = row.original.log_master;
      return (
        <div className="flex flex-col py-1">
          <span className="text-sm font-bold text-slate-900">
            {getNamaBulanIndo(bulan)}
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            Tahun {tahun}
          </span>
        </div>
      );
    },
  },
  {
    id: "status_laporan",
    header: "Status Laporan",
    cell: ({ row }) => {
      const status = row.original.log_master.status_laporan;
      const jumlah_kejadian = row.original.jumlah_kejadian;

      const totalRisikoDiterbitkan = row.original.detail.length;
      const risikoNihilCount = row.original.detail.filter(
        (d) => d.is_nihil === true,
      ).length;
      const risikoTerjadiCount = totalRisikoDiterbitkan - risikoNihilCount;

      if (status === "TERJADI_RISIKO" && jumlah_kejadian > 0) {
        return (
          <Badge className="flex w-fit items-center gap-1 rounded-full border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100">
            <IconAlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            TERJADI RISIKO
          </Badge>
        );
      }

      if (
        status === "NIHIL" ||
        (risikoNihilCount > 0 &&
          risikoTerjadiCount === 0 &&
          jumlah_kejadian === 0)
      ) {
        return (
          <Badge className="flex w-fit items-center gap-1 rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100">
            <IconCircleCheck className="h-3.5 w-3.5 text-emerald-600" />✔ NIHIL
            (Dilaporkan)
          </Badge>
        );
      }

      return (
        <Badge className="flex w-fit items-center gap-1 rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600 hover:bg-amber-100">
          <IconHourglassHigh className="h-3.5 w-3.5 animate-pulse text-amber-500" />
          ⏳ BELUM DILAPORKAN
        </Badge>
      );
    },
  },
  {
    accessorKey: "jumlah_kejadian",
    header: "Jumlah Kejadian",
    cell: ({ row }) => {
      const status = row.original.log_master.status_laporan;
      const jumlah = row.original.jumlah_kejadian;

      if (status === "BELUM_DIISI") {
        return <span className="text-sm font-medium text-slate-400">-</span>;
      }

      return (
        <span
          className={cn(
            "text-sm font-semibold",
            jumlah > 0 ? "font-bold text-rose-600" : "text-slate-600",
          )}
        >
          {jumlah} Kejadian
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi / Detail",
    cell: ({ row }) => <CellActions rowData={row.original} />,
  },
];

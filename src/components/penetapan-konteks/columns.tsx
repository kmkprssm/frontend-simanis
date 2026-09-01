import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../ui/badge";
import { TKonteks } from "@/types/konteks-type";
import { CellActions } from "./cell-actions";
import { formatCurrencyWithFormatterNumber } from "@/lib/utils";
import {
  METODE_LABEL,
  METODE_VARIANT,
  SELERA_VARIANT,
} from "@/helpers/risk-helpers";
import { ExtendedUser } from "@/next-auth";

export const getColumns = (user?: ExtendedUser): ColumnDef<TKonteks>[] => [
  {
    accessorKey: "unit_kerja",
    header: "Unit Kerja",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("unit_kerja")}</div>;
    },
  },
  {
    accessorKey: "periode",
    header: "Periode",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("periode")}</div>;
    },
  },
  {
    accessorKey: "metode_evaluasi",
    header: "Metode",
    cell: ({ row }) => {
      const metode = row.getValue(
        "metode_evaluasi",
      ) as keyof typeof METODE_LABEL;

      return (
        <div className="font-semibold">
          {
            <Badge variant={METODE_VARIANT[metode] || "secondary"}>
              {METODE_LABEL[metode] || "-"}
            </Badge>
          }
        </div>
      );
    },
  },
  {
    accessorKey: "selera_resiko",
    header: "Selera",
    cell: ({ row }) => {
      const selera = row.getValue(
        "selera_resiko",
      ) as keyof typeof SELERA_VARIANT;
      return (
        <div className="font-semibold">
          <Badge variant={SELERA_VARIANT[selera].variant || "secondary"}>
            {selera}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "ambang_dampak_rp",
    header: "Ambang Dampak",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatCurrencyWithFormatterNumber(row.getValue("ambang_dampak_rp"))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
      return (
        <div className="font-medium">
          <Badge variant={status === true ? "success" : "destructive"}>
            {status === true ? "Aktif" : "Tidak Aktif"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <CellActions data={row.original} currentUserData={user} />
    ),
  },
];

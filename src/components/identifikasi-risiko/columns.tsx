import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../ui/badge";
import {
  TIdentifikasiRisiko,
  TIdentifikasiRisikoCategory,
} from "@/types/identifikasi-risiko-type";
import { CellActions } from "./cell-actions";
import { CATEGORY_COLORS, getStatusRisiko } from "@/helpers/risk-helpers";
import { TKategoriRisiko } from "@/types/kategori-risiko-type";
import { truncate } from "@/lib/utils";

export const getColumns = (
  kategoriRisiko?: TKategoriRisiko[],
): ColumnDef<TIdentifikasiRisiko>[] => [
  {
    accessorKey: "created_by_name",
    header: "Unit",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col font-medium">
          {row.getValue("created_by_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "nama_resiko",
    header: "Resiko",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col font-medium">
          {truncate(row.getValue("nama_resiko"), 50)}
          <p className="text-muted-foreground">
            {row.original.deskripsi?.substring(0, 40) ||
              "Tidak ada deskripsi..."}
            {row.original.deskripsi?.length > 40 && "..."}
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
      ) as TIdentifikasiRisikoCategory;

      return (
        <div className="font-medium">
          {
            <Badge style={{ backgroundColor: CATEGORY_COLORS[kategori] }}>
              {row.getValue("kategori_name") || "-"}
            </Badge>
          }
        </div>
      );
    },
  },
  {
    accessorKey: "consequences",
    header: "Dampak",
    cell: ({ row }) => {
      const dampak = row.getValue("consequences") as string;

      return (
        <div className="text-muted-foreground font-normal">
          {dampak.substring(0, 40) || "Tidak ada deskripsi..."}
          {dampak.length > 40 && "..."}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusVariant = getStatusRisiko(status);

      return (
        <div className="font-semibold">
          <Badge variant={statusVariant.badgeClass}>
            {statusVariant?.label}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <CellActions data={row.original} kategoriRisiko={kategoriRisiko} />
    ),
  },
];

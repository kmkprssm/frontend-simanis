import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../ui/badge";
import { TMasterUser } from "@/types/user-type";
import { CellActions } from "./cell-actions";

export const columns: ColumnDef<TMasterUser>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role Pengguna",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      return (
        <div className="font-semibold">
          {
            <Badge variant={role === "ADMIN" ? "default" : "outline"}>
              {role}
            </Badge>
          }
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

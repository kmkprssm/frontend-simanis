"use client";

import { useModalStore } from "@/stores/modal-store";
import { PageHeader } from "../page-header";
import { IconUserCog } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { TUsersResponseWithoutMeta } from "@/types/user-type";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";

interface MasterUsersProps {
  data: TUsersResponseWithoutMeta;
}

export const MasterUsers = ({ data }: MasterUsersProps) => {
  const { onOpen } = useModalStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Data Pengguna"
        description="Admin dapat mengelola data pengguna yang mengakses manrisk sesuai role masing-masing"
        showAction={true}
        icon={IconUserCog}
        action={
          <>
            <Button
              onClick={() =>
                onOpen("addNewUser", {
                  title: "Tambah Pengguna Baru",
                  message: <>Menambahkan pengguna baru sesuai role</>,
                })
              }
              variant={"secondary"}
            >
              Tambah Pengguna
            </Button>
          </>
        }
      />
      <DataTable
        columns={columns}
        data={data.users}
        filterKey="name"
        filterName="Nama Pengguna"
        variant="general"
      />
    </div>
  );
};

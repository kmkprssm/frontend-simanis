"use client";

import { IconFileSignal } from "@tabler/icons-react";
import { useMemo } from "react";

import { TKonteks } from "@/types/konteks-type";
import { DataTable } from "../ui/data-table";
import { getColumns } from "./columns";
import { PageHeader } from "../page-header";
import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import { ExtendedUser } from "@/next-auth";
import { canManageKonteks } from "@/helpers/manage-konteks";

interface PenetapanKonteksProps {
  data: TKonteks[] | undefined;
  user?: ExtendedUser;
}

const PenetapanKonteks = ({ data, user }: PenetapanKonteksProps) => {
  const { onOpen } = useModalStore();
  const isAllowedToEdit = canManageKonteks(user);
  const Columns = useMemo(() => getColumns(user), [user]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penetapan Konteks Risiko"
        description="Landasan strategis dan batasan risiko organisasi"
        showAction={isAllowedToEdit}
        icon={IconFileSignal}
        action={
          isAllowedToEdit && (
            <>
              <Button
                onClick={() =>
                  onOpen("addEditKonteks", {
                    title: "Tambah Konteks Resiko",
                    message: (
                      <>Menambahkan penetapan konteks resiko organisasi</>
                    ),
                  })
                }
                variant={"secondary"}
              >
                Tambah Konteks
              </Button>
            </>
          )
        }
      />
      <DataTable
        columns={Columns}
        data={data!}
        filterKey="unit_kerja"
        filterName="Unit Kerja"
        variant="general"
      />
    </div>
  );
};

export default PenetapanKonteks;

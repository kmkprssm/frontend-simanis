"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { IconEdit, IconInfoCircle, IconTrash } from "@tabler/icons-react";

import { Button } from "../ui/button";
import { TKonteks } from "@/types/konteks-type";
import { useModalStore } from "@/stores/modal-store";
import { deleteKonteks } from "@/server/apis/penetapan-konteks";
import { KonteksDetail } from "./konteks-detail";
import { CustomTooltip } from "../custom-tooltip";
import { ExtendedUser } from "@/next-auth";
import { canManageKonteks } from "@/helpers/manage-konteks";

interface CellActionsProps {
  data: TKonteks;
  currentUserData?: ExtendedUser;
}

export const CellActions = ({ data, currentUserData }: CellActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const { onOpen } = useModalStore();

  const isAllowedToEdit = canManageKonteks(currentUserData);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteKonteks(data.id);

      if (result.success) {
        toast.success("Konteks berhasil dihapus", {
          position: "top-right",
        });
      } else {
        toast.error(result?.message || "Terjadi kesalahan.", {
          position: "top-right",
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <CustomTooltip
        align="center"
        side="top"
        tooltipContent={<>Detail Konteks Risiko</>}
      >
        <Button
          variant={"detail"}
          size={"icon"}
          onClick={() =>
            onOpen(
              "detail",
              {
                title: "Detail Penetapan Konteks",
                message:
                  "Informasi lengkap mengenai parameter konteks risiko organisasi.",
                childrenDetail: <KonteksDetail data={data} />,
              },
              { konteksData: data },
            )
          }
        >
          <IconInfoCircle stroke={2} />{" "}
        </Button>
      </CustomTooltip>
      {isAllowedToEdit && (
        <>
          <CustomTooltip
            align="center"
            side="top"
            tooltipContent={<>Edit Konteks Risiko</>}
          >
            <Button
              variant={"edit"}
              size={"icon"}
              onClick={() =>
                onOpen(
                  "addEditKonteks",
                  {
                    title: "Update Konteks Resiko",
                    message: <>Perbarui penetapan konteks resiko organisasi</>,
                  },
                  { konteksData: data },
                )
              }
            >
              <IconEdit stroke={2} />{" "}
            </Button>
          </CustomTooltip>
          <CustomTooltip
            align="center"
            side="top"
            tooltipContent={<>Hapus Konteks Risiko</>}
          >
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() =>
                onOpen("deleteAlert", {
                  title: "Apakah kamu yakin?",
                  message: (
                    <>
                      Apakah kamu yakin ingin menghapus konteks risiko ini?
                      Risiko akan dihapus secara permanen. Tindakan ini tidak
                      bisa dibatalkan.
                    </>
                  ),
                  onAlertDelete: handleDelete,
                  loading: isPending,
                })
              }
            >
              <IconTrash stroke={2} />{" "}
            </Button>
          </CustomTooltip>
        </>
      )}
    </div>
  );
};

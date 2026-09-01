"use client";

import { IconEdit, IconInfoCircle, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import { TIdentifikasiRisiko } from "@/types/identifikasi-risiko-type";
import { deleteIdentifikasiRisiko } from "@/server/apis/identifikasi-risiko";
import { IdentifikasiRisikoDetail } from "./identifikasi-risiko-detail";
import { useTransition } from "react";
import { CustomTooltip } from "../custom-tooltip";
import { TKategoriRisiko } from "@/types/kategori-risiko-type";

interface CellActionsProps {
  data: TIdentifikasiRisiko;
  kategoriRisiko?: TKategoriRisiko[];
}

export const CellActions = ({ data, kategoriRisiko }: CellActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const { onOpen } = useModalStore();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteIdentifikasiRisiko(data.id);

      if (!result.success) {
        toast.error(result?.message || "Terjadi kesalahan.", {
          position: "top-right",
        });
      } else {
        toast.success("Risiko berhasil dihapus", {
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
        tooltipContent={<>Detail Risiko</>}
      >
        <Button
          variant={"detail"}
          size={"icon"}
          onClick={() =>
            onOpen(
              "detail",
              {
                title: "Detail Risiko",
                message:
                  "Informasi lengkap mengenai risiko yang telah ditetapkan oleh organisasi.",
                childrenDetail: <IdentifikasiRisikoDetail data={data} />,
              },
              { identifikasiData: data },
            )
          }
        >
          <IconInfoCircle stroke={2} />{" "}
        </Button>
      </CustomTooltip>
      {data.status !== "Closed" && (
        <>
          <CustomTooltip
            align="center"
            side="top"
            tooltipContent={<>Edit Risiko</>}
          >
            <Button
              variant={"edit"}
              size={"icon"}
              onClick={() =>
                onOpen(
                  "addEditIdentifikasiRisiko",
                  {
                    title: "Update Risiko",
                    message: <>Perbarui risiko yang sudah ditambajkan</>,
                  },
                  {
                    identifikasiData: data,
                    kategoriRisikoData: kategoriRisiko,
                  },
                )
              }
            >
              <IconEdit stroke={2} />{" "}
            </Button>
          </CustomTooltip>
          <CustomTooltip
            align="center"
            side="top"
            tooltipContent={<>Hapus Risiko</>}
          >
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() =>
                onOpen("deleteAlert", {
                  title: "Apakah kamu yakin?",
                  message: (
                    <>
                      Apakah kamu yakin ingin menghapus risiko ini? Risiko akan
                      dihapus secara permanen. Tindakan ini tidak bisa
                      dibatalkan.
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

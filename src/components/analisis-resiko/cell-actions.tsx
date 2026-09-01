"use client";

import {
  IconCheckFilled,
  IconEdit,
  IconInfoCircle,
  IconTrash,
  IconUserStar,
} from "@tabler/icons-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import { TAnalisisRisiko } from "@/types/analisis-risiko-type";
import { AnalisisRisikoDetail } from "./analisis-risiko-detail";
import { addToProfileRisiko } from "@/server/apis/profile-risiko";
import { Loader } from "../ui/loader";
import { CustomTooltip } from "../custom-tooltip";
import { deleteAnalisisRisiko } from "@/server/apis/analisis-risiko";
import { ExtendedUser } from "@/next-auth";

interface CellActionsProps {
  data: TAnalisisRisiko;
  user?: ExtendedUser;
}

export const CellActions = ({ data, user }: CellActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const { onOpen } = useModalStore();
  const isAlreadyInProfile = data.is_in_profile;

  const handleAddToProfile = () => {
    startTransition(async () => {
      try {
        const response = await addToProfileRisiko({
          risk_analysis_id: data.id,
        });

        if (response.success) {
          toast.success("Berhasil!", {
            description: "Risiko berhasil dimasukkan ke daftar profil risiko.",
          });
        } else {
          toast.error("Gagal!", {
            description:
              response.message || "Gagal menambahkan risiko ke profil.",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Error!", {
          description: "Terjadi kesalahan sistem saat menghubungi server.",
        });
      }
    });
  };

  const handleDelete = async () => {
    const result = await deleteAnalisisRisiko(data.id);

    if (!result.success) {
      toast.error(result?.message || "Terjadi kesalahan.", {
        position: "top-right",
      });
    } else {
      toast.success("Analisis risiko berhasil dihapus", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <CustomTooltip
        align="center"
        side="top"
        tooltipContent={<>Detail Analisis Risiko</>}
      >
        <Button
          variant={"detail"}
          size={"icon"}
          onClick={() =>
            onOpen(
              "detail",
              {
                title: "Detail Analisis Risiko",
                message:
                  "Informasi lengkap mengenai analisis risiko dari risiko yang telah dipilih.",
                childrenDetail: <AnalisisRisikoDetail data={data} />,
              },
              { analisisRisikoData: data },
            )
          }
        >
          <IconInfoCircle stroke={2} />
        </Button>
      </CustomTooltip>
      {data.status !== "Closed" && (
        <>
          <CustomTooltip
            align="center"
            side="top"
            tooltipContent={<>Edit Analisis Risiko</>}
          >
            <Button
              variant={"edit"}
              size={"icon"}
              onClick={() =>
                onOpen(
                  "addEditAnalisisRisiko",
                  {
                    title: "Update Analisis Risiko",
                    message: (
                      <>
                        Perbarui analisis skor di bagian skala kemungkinan dan
                        skala dampak jika ada yang berubah
                      </>
                    ),
                  },
                  {
                    analisisRisikoData: data,
                  },
                )
              }
            >
              <IconEdit stroke={2} />{" "}
            </Button>
          </CustomTooltip>
          {/* <CustomTooltip
            align="center"
            side="top"
            tooltipContent={<>Hapus Analisis Risiko</>}
          >
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() =>
                onOpen("deleteAlert", {
                  title: "Apakah kamu yakin?",
                  message: (
                    <>
                      Apakah kamu yakin ingin menghapus analisis risiko ini?
                      Analisis risiko akan dihapus secara permanen. Tindakan ini
                      tidak bisa dibatalkan.
                    </>
                  ),
                  onAlertDelete: handleDelete,
                })
              }
            >
              <IconTrash stroke={2} />{" "}
            </Button>
          </CustomTooltip> */}
        </>
      )}
      {user?.role !== "USER" && (
        <Button
          size="default"
          variant={isAlreadyInProfile ? "secondary" : "profile"}
          className="min-w-35 gap-1 px-2.5 text-xs shadow-none"
          disabled={isAlreadyInProfile || isPending}
          onClick={handleAddToProfile}
        >
          {isPending ? (
            <>
              <Loader />
              Memproses...
            </>
          ) : isAlreadyInProfile ? (
            <>
              <IconCheckFilled className="h-3 w-3 text-emerald-600" />
              Sudah Ditambahkan
            </>
          ) : (
            <>
              <IconUserStar className="h-3 w-3" />
              Tambah ke Profile
            </>
          )}
        </Button>
      )}
    </div>
  );
};

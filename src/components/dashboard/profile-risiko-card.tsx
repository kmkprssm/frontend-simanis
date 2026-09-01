"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  IconTrash,
  IconLoader2,
  IconUser,
  IconCalendarMonth,
  IconScoreboard,
  IconBookmark,
  IconActivity,
  IconFlame,
} from "@tabler/icons-react";

import { TProfileRisiko } from "@/types/profile-risiko-type";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  getRiskLevel,
  normalizeStrategi,
  STRATEGI_CONFIG,
  PRIORITAS_CONFIG,
} from "@/helpers/risk-helpers";
import { dateFormat } from "@/lib/utils";
import { deleteProfileResiko } from "@/server/apis/profile-risiko";
import { useModalStore } from "@/stores/modal-store";
import { CustomTooltip } from "../custom-tooltip";
import { CanModifyGuard } from "../auth/permission-guard";

interface ProfileRisikoCardProps {
  item: TProfileRisiko;
  onSuccessDelete: () => void;
}

export const ProfileRisikoCard = ({
  item,
  onSuccessDelete,
}: ProfileRisikoCardProps) => {
  const [isPending, startTransition] = useTransition();
  const { onOpen } = useModalStore();

  const riskLevel = getRiskLevel(item.skor_risiko || 0);
  const strategiKey = normalizeStrategi(item.strategi);
  const strategi = strategiKey ? STRATEGI_CONFIG[strategiKey] : null;
  const prioritas =
    PRIORITAS_CONFIG[
      (item.prioritas as unknown as keyof typeof PRIORITAS_CONFIG) || 3
    ];

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await deleteProfileResiko(item.profile_id);
        if (res.success) {
          toast.success("Berhasil!", {
            description: "Risiko berhasil dihapus dari profil.",
          });
          onSuccessDelete();
        } else {
          toast.error("Gagal!", {
            description: res.message || "Gagal menghapus risiko.",
          });
        }
      } catch (error) {
        toast.error("Error!", {
          description: "Terjadi kesalahan koneksi jaringan.",
        });
      }
    });
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-xs transition-all duration-200 hover:border-zinc-300/90 hover:shadow-md">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 bg-zinc-50/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <IconBookmark size={14} className="shrink-0 text-zinc-400" />
            <span className="truncate text-xs font-semibold text-zinc-600">
              {item.kategori_name || "Tanpa Kategori"}
            </span>
          </div>
          <Badge
            variant={item.treatment_status === "Open" ? "success" : "danger"}
          >
            {item.treatment_status === "Open" ? "Aktif" : "Ditutup"}
          </Badge>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge
            className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${riskLevel.badgeClass}`}
          >
            {riskLevel.label}
          </Badge>
          <CanModifyGuard>
            <CustomTooltip
              align="center"
              side="top"
              tooltipContent={<>Hapus dari profile</>}
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  onOpen("deleteAlert", {
                    title: "Apakah kamu yakin?",
                    message: (
                      <>
                        Apakah kamu yakin ingin menghapus profile risiko ini?
                        Profile risiko akan dihapus secara permanen. Tindakan
                        ini tidak bisa dibatalkan.
                      </>
                    ),
                    onAlertDelete: handleDelete,
                    loading: isPending,
                  })
                }
                disabled={isPending}
                className="h-7 w-7 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                {isPending ? (
                  <IconLoader2 className="h-3.5 w-3.5 animate-spin text-red-600" />
                ) : (
                  <IconTrash className="h-3.5 w-3.5" />
                )}
              </Button>
            </CustomTooltip>
          </CanModifyGuard>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h6 className="mb-2 line-clamp-2 text-sm leading-snug font-bold text-zinc-800 transition-colors group-hover:text-amber-600">
            {item.nama_resiko}
          </h6>
          <p className="text-muted-foreground mb-4 line-clamp-3 text-xs leading-relaxed">
            {item.deskripsi || "Tidak ada deskripsi rinci untuk risiko ini."}
          </p>

          <div className="flex items-center gap-4">
            <div className="mb-4 flex w-fit items-center gap-1.5 text-xs text-zinc-600">
              <IconActivity size={14} className="text-zinc-400" />
              <span>Kemungkinan:</span>
              <span className="text-foreground text-xs font-semibold">
                {item.likelihood}
              </span>
            </div>
            <div className="mb-4 flex w-fit items-center gap-1.5 text-xs text-zinc-600">
              <IconFlame size={14} className="text-zinc-400" />
              <span>Dampak:</span>
              <span className="text-foreground text-xs font-semibold">
                {item.impact}
              </span>
            </div>
          </div>
          <div className="mb-4 flex w-fit items-center gap-1.5 rounded-lg border border-zinc-100 bg-zinc-50/50 p-2 text-xs text-zinc-600">
            <IconScoreboard size={14} className="text-zinc-400" />
            <span>Skor Risiko:</span>
            <strong className={`text-sm font-bold ${riskLevel.textClass}`}>
              {item.skor_risiko}{" "}
            </strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-zinc-100 pt-3">
          {strategi ? (
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${strategi.badgeClass}`}
            >
              <strategi.icon size={11} />
              <span>{strategi.label}</span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-400 italic">
              Belum dievaluasi
            </span>
          )}

          {prioritas && item.strategi && (
            <div
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${prioritas.badgeClass}`}
            >
              <prioritas.icon size={11} />
              <span>{prioritas.label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-zinc-100 bg-zinc-50/40 px-4 py-2.5 text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5 truncate">
          <IconUser size={12} className="shrink-0 text-zinc-400" />
          <span className="truncate">
            Unit Kerja:{" "}
            <strong className="font-medium text-zinc-700">
              {item.pemilik_risiko || "-"}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconCalendarMonth size={12} className="shrink-0 text-zinc-400" />
          <span>
            Ditambahkan:{" "}
            <strong className="font-medium text-zinc-700">
              {dateFormat(item.assigned_at)}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

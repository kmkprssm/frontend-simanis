import { IconListCheck, IconEdit, IconTrash } from "@tabler/icons-react";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { TKontrolRisikoWithActions } from "@/types/perlakuan-risiko-type";
import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import { getTipeBadgeColor } from "@/helpers/risk-helpers";
import { getProgressColor } from "@/helpers/perlakuan-risiko-helper";

interface PengendalianRisikoCardProps {
  kontrol: TKontrolRisikoWithActions;
  totalActions: number;
  completedActions: number;
  percent: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const PengendalianRisikoCard = ({
  kontrol,
  totalActions,
  completedActions,
  percent,
  onEdit,
  onDelete,
}: PengendalianRisikoCardProps) => {
  const { onOpen } = useModalStore();

  return (
    <Card className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white py-2 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="space-y-3.5 p-2">
        <div className="flex items-center justify-between gap-4">
          <Badge
            variant="outline"
            className={cn(
              "rounded-md border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase shadow-2xs",
              getTipeBadgeColor(kontrol.tipe),
            )}
          >
            {kontrol.tipe}
          </Badge>

          <div className="flex items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              onClick={onEdit}
              title="Edit instrumen kontrol"
            >
              <IconEdit className="h-3.5 w-3.5" />
            </Button>
            {totalActions > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                disabled={totalActions > 0}
                onClick={() =>
                  onOpen("deleteAlert", {
                    title: "Apakah kamu yakin?",
                    message: (
                      <>
                        Apakah kamu yakin ingin menghapus pengendalian risiko
                        ini? Pengendalian risiko akan dihapus secara permanen.
                        Tindakan ini tidak bisa dibatalkan.
                      </>
                    ),
                    onDelete: onDelete,
                  })
                }
                title={
                  totalActions > 0
                    ? "Tidak bisa dihapus karena memiliki rencana aksi aktif"
                    : "Hapus kontrol"
                }
              >
                <IconTrash className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h5 className="text-sm leading-snug font-bold tracking-tight text-slate-900">
            {kontrol.nama_kontrol}
          </h5>
          {kontrol.deskripsi && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed font-normal">
              {kontrol.deskripsi}
            </p>
          )}
        </div>

        <div className="space-y-1.5 border-t border-slate-100/60 pt-1">
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1 text-slate-400">
              <IconListCheck className="h-3.5 w-3.5 text-slate-400" />
              Progress Aksi:{" "}
              <span className="font-bold text-slate-700">
                {completedActions}/{totalActions} Selesai
              </span>
            </span>
            <span
              className={cn(
                "font-bold",
                percent === 100 ? "text-emerald-600" : "text-slate-700",
              )}
            >
              {percent}%
            </span>
          </div>

          <div className="relative overflow-hidden rounded-full">
            <Progress
              value={percent}
              className={cn(
                "h-2 w-full bg-zinc-100 transition-all [&>div]:duration-500",
                getProgressColor(percent),
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

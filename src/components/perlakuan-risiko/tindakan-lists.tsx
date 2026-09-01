"use client";

import { cn, dateFormat } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TKontrolRisikoWithActions,
  TRencanaAksiRisiko,
} from "@/types/perlakuan-risiko-type";
import {
  IconBriefcase,
  IconPlus,
  IconEdit,
  IconX,
  IconPlayerPlay,
  IconCheck,
  IconArrowLeft,
  IconCalendar,
} from "@tabler/icons-react";
import { useModalStore } from "@/stores/modal-store";
import { getActionStatusInfo } from "@/helpers/risk-helpers";

interface TindakanListsProps {
  selectedControl: TKontrolRisikoWithActions | null;
  showBackButton: boolean;
  onBackToControls: () => void;
  onAddAction: () => void;
  onEditAction: (action: TRencanaAksiRisiko) => void;
  onDeleteAction: (actionId: string) => void;
  onMulaiPengerjaan: (action: TRencanaAksiRisiko) => void;
  onTandaiSelesai: (action: TRencanaAksiRisiko) => void;
}

export const TindakanLists = ({
  selectedControl,
  showBackButton,
  onBackToControls,
  onAddAction,
  onEditAction,
  onDeleteAction,
  onMulaiPengerjaan,
  onTandaiSelesai,
}: TindakanListsProps) => {
  const actions = selectedControl?.actions || [];
  const { onOpen } = useModalStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 text-xs font-medium text-slate-500"
            onClick={onBackToControls}
          >
            <IconArrowLeft className="mr-1 h-3.5 w-3.5" /> Kembali ke Pilihan
            Kontrol
          </Button>
        ) : (
          <div />
        )}
      </div>

      {actions.length === 0 ? (
        <div className="mx-auto my-4 max-w-md rounded-xl border border-dashed border-slate-200 bg-white p-6 py-10 text-center shadow-2xs">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border bg-slate-50 text-slate-400">
            <IconBriefcase className="h-5 w-5 stroke-[1.5]" />
          </div>
          <h6 className="text-sm font-bold text-slate-800">
            Belum Ada Tindakan
          </h6>
          <p className="mx-auto mt-1 mb-4 max-w-70 text-xs leading-normal text-slate-400">
            Kontrol ini belum memiliki rencana tindakan (Action Plan) mitigasi
            di lapangan.
          </p>
          <Button
            size="sm"
            className="gap-1 px-4 text-xs font-semibold"
            onClick={onAddAction}
          >
            <IconPlus className="h-4 w-4" /> Tambah Tindakan Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {actions.map((action) => {
            const statusInfo = getActionStatusInfo(
              action.status,
              action.target_date,
            );

            return (
              <div
                key={action.id}
                className={cn(
                  "flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-2xs transition-all hover:shadow-xs",
                  statusInfo.isOverdue
                    ? "border-l-4 border-red-200 border-l-red-500"
                    : statusInfo.isClosed
                      ? "border-emerald-200 bg-emerald-50/10"
                      : "border-slate-200",
                )}
              >
                <div className="space-y-2.5 p-3.5">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn(
                        "rounded-md border-none px-2 py-0.5 text-[10px] font-bold shadow-none",
                      )}
                      variant={statusInfo.badgeVariant}
                    >
                      {statusInfo.label}
                    </Badge>
                    <span
                      className={cn(
                        "text-[10px] font-bold tracking-tight",
                        statusInfo.isOverdue
                          ? "text-red-500"
                          : "text-slate-400",
                      )}
                    >
                      {dateFormat(action.target_date)}
                    </span>
                  </div>

                  <h6 className="min-h-9 text-xs leading-normal font-bold wrap-break-word text-slate-800">
                    {action.action_plan}
                  </h6>

                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100/60 bg-slate-50 p-2 text-[11px] font-semibold text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="shadow-3xs rounded border bg-white px-1 text-[9px] font-black text-slate-400 uppercase">
                        PIC
                      </span>
                      <span className="truncate text-slate-600">
                        {action.pic_name}
                      </span>
                    </div>
                    {statusInfo.isClosed && (
                      <div className="flex items-center gap-1">
                        <IconCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>
                          Realisasi:{" "}
                          <span className="font-semibold text-slate-700">
                            {dateFormat(action.realisasi_date)}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 border-t border-slate-100 bg-slate-50/50 p-2">
                  <Button
                    variant="edit"
                    size="icon"
                    onClick={() => onEditAction(action)}
                  >
                    <IconEdit className="h-3.5 w-3.5" />
                  </Button>
                  {!statusInfo.isClosed && (
                    <>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          onOpen("deleteAlert", {
                            title: "Apakah kamu yakin?",
                            message: (
                              <>
                                Apakah kamu yakin ingin menghapus tindakan
                                risiko ini? tindakan risiko akan dihapus secara
                                permanen. Tindakan ini tidak bisa dibatalkan.
                              </>
                            ),
                            onAlertDelete: () => onDeleteAction(action.id),
                          })
                        }
                      >
                        <IconX className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}

                  {action.status === "Open" && (
                    <Button
                      size="sm"
                      className="ml-auto h-7 rounded-md bg-sky-600 px-2.5 text-[10px] font-bold hover:bg-sky-700"
                      onClick={() => onMulaiPengerjaan(action)}
                    >
                      <IconPlayerPlay className="mr-1 h-3 w-3" /> Mulai Kerjakan
                    </Button>
                  )}

                  {statusInfo.isOnProgress && (
                    <Button
                      size="sm"
                      className="ml-auto h-7 rounded-md bg-emerald-600 px-2.5 text-[10px] font-bold hover:bg-emerald-700"
                      onClick={() => onTandaiSelesai(action)}
                    >
                      <IconCheck className="mr-1 h-3 w-3" /> Tandai Selesai
                    </Button>
                  )}

                  {statusInfo.isClosed && (
                    <div className="flex w-full items-center justify-between px-1 py-0.5">
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                        <IconCheck className="h-3.5 w-3.5" /> Selesai
                        Terverifikasi
                      </span>
                      {action.bukti_mitigasi && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 border-sky-200 bg-white px-2 text-[10px] font-bold text-sky-700 hover:bg-sky-50"
                          onClick={() =>
                            window.open(action.bukti_mitigasi, "_blank")
                          }
                        >
                          Lihat Bukti
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

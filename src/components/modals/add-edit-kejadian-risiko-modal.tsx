"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal-store";
import { IconReportMedical } from "@tabler/icons-react";
import { DetailKejadianRisikoForm } from "../pencatatan-kejadian-risiko/detail-kejadian-risiko-form";
import { getNamaBulanIndo } from "@/helpers/risk-helpers";
import { cn } from "@/lib/utils";

export const AddEditKejadianRisikoModal = () => {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type, data } = useModalStore();

  const isModalOpen = isOpen && type === "addEditKejadianRisiko";
  const logMaster = data?.logMasterData;
  const detailKejadianData = data?.dataBulanDetail;

  if (!logMaster) return null;

  const namaBulan = getNamaBulanIndo(logMaster.bulan);
  const isEditMode = !!detailKejadianData?.kejadian_id;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden border-slate-200 p-0">
        {/* HEADER MODAL */}
        <DialogHeader className="border-b bg-slate-50/50 p-5 pb-4">
          <div className="flex w-full items-start gap-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                <IconReportMedical
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isEditMode ? "text-amber-600" : "text-blue-600",
                  )}
                />
                <span>
                  {isEditMode
                    ? "Koreksi / Edit Kejadian Risiko"
                    : "Tambahkan Kejadian Risiko"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Periode Pelaporan:{" "}
                <span className="font-semibold text-slate-700">
                  {namaBulan} {logMaster.tahun}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5">
          <DetailKejadianRisikoForm
            logMaster={logMaster}
            defaultValues={detailKejadianData}
            onSuccessSubmit={() => {
              queryClient.invalidateQueries({
                queryKey: ["kejadianRisiko", logMaster.tahun],
              });
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

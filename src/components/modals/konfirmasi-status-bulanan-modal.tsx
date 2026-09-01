"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modal-store";
import {
  IconAlertCircle,
  IconCheck,
  IconX,
  IconReportMedical,
  IconArrowLeft,
} from "@tabler/icons-react";
// import { createUpdateKejadianRisiko } from "@/server/apis/pencatatan-kejadian-risiko";
// import { Loader } from "../ui/loader";
import { DetailKejadianRisikoForm } from "../pencatatan-kejadian-risiko/detail-kejadian-risiko-form";
import { getNamaBulanIndo } from "@/helpers/risk-helpers";
import { FormLaporanNihilRisiko } from "../pencatatan-kejadian-risiko/laporan-nihil-risiko-form";

export type TModalView = "CHOOSE_STATUS" | "INPUT_DETAIL" | "INPUT_NIHIL";

export const KonfirmasiStatusBulananModal = () => {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type, data, config } = useModalStore();

  const isModalOpen = isOpen && type === "konfirmasiStatusBulanan";
  const logMaster = data?.logMasterData;
  const forceViewMode = config?.forceViewMode as TModalView | undefined;

  const [viewMode, setViewMode] = React.useState<TModalView>("CHOOSE_STATUS");
  // const [isLoadingNihil, setIsLoadingNihil] = React.useState(false);

  React.useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        if (forceViewMode) {
          setViewMode(forceViewMode);
        } else {
          setViewMode("CHOOSE_STATUS");
        }
      }, 0);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setViewMode("CHOOSE_STATUS"), 200);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, forceViewMode]);

  if (!logMaster) return null;

  const namaBulan = getNamaBulanIndo(logMaster.bulan);

  // AKSI A: Menangani Pelaporan NIHIL (Tidak ada kejadian)
  // const handleReportNihil = async () => {
  //   setIsLoadingNihil(true);
  //   try {
  //     const response = await createUpdateKejadianRisiko(undefined, {
  //       tahun: logMaster.tahun,
  //       bulan: logMaster.bulan,
  //       status_laporan: "NIHIL",
  //     });

  //     if (response.success) {
  //       toast.success(
  //         `Laporan bulanan ${namaBulan} ${logMaster.tahun} berhasil disimpan sebagai NIHIL.`,
  //       );

  //       // INVALIDASI CACHE: Sesuai diskusi, paksa TanStack Query refresh tahun tersebut
  //       queryClient.invalidateQueries({
  //         queryKey: ["kejadianRisiko", logMaster.tahun],
  //       });
  //       onClose();
  //     } else {
  //       toast.error(response.message || "Gagal menyimpan laporan.");
  //     }
  //   } catch (error) {
  //     toast.error("Terjadi kesalahan sistem saat menyimpan laporan.");
  //   } finally {
  //     setIsLoadingNihil(false);
  //   }
  // };

  return (
    <Dialog
      key={isModalOpen ? `open-${forceViewMode || "default"}` : "closed"}
      open={isModalOpen}
      // onOpenChange={() => !isLoadingNihil && onClose()}
      onOpenChange={() => onClose()}
    >
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden border-slate-200 p-0">
        {/* HEADER MODAL */}
        <DialogHeader className="border-b bg-slate-50/50 p-5 pb-4">
          <div className="flex w-full items-start gap-3">
            {viewMode === "INPUT_DETAIL" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500"
                onClick={() => setViewMode("CHOOSE_STATUS")}
                // disabled={isLoadingNihil}
              >
                <IconArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="min-w-0 flex-1 space-y-0.5">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                <IconReportMedical className="h-5 w-5 shrink-0 text-blue-600" />
                <span>
                  {viewMode === "CHOOSE_STATUS" && "Konfirmasi Laporan Bulanan"}
                  {viewMode === "INPUT_DETAIL" && "Form Catat Kejadian Risiko"}
                  {viewMode === "INPUT_NIHIL" &&
                    "Justifikasi Evaluasi Komitmen Nihil"}
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

        {/* AREA ISI MULTI-VIEW KONDISIONAL */}
        <div className="flex-1 overflow-y-auto p-5">
          {viewMode === "CHOOSE_STATUS" && (
            /* VIEW 1: Pertanyaan Penentu Status (Nihil atau Terjadi Insiden) */
            <div className="space-y-5 py-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-inner">
                <IconAlertCircle className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">
                  Apakah ada kejadian insiden risiko di bulan ini?
                </h4>
                <p className="mx-auto max-w-sm text-xs leading-normal text-slate-400">
                  Kriteria wajib dari BPKP. Jika tidak ada insiden, sistem
                  mengunci laporan periode ini dengan status komitmen Nihil.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Opsi TIDAK (Nihil) */}
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  // disabled={isLoadingNihil}
                  className="h-11 border-emerald-200 bg-emerald-50/50 font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  // onClick={handleReportNihil}
                  onClick={() => setViewMode("INPUT_NIHIL")}
                >
                  {/* {isLoadingNihil ? (
                    <Loader />
                  ) : (
                    <IconCheck className="mr-1.5 h-4 w-4" />
                  )} */}
                  <IconCheck className="mr-1.5 h-4 w-4" />
                  Tidak (Nihil)
                </Button>

                {/* Opsi YA (Terjadi Risiko) */}
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  // disabled={isLoadingNihil}
                  className="h-11 border-rose-200 bg-rose-50/50 font-semibold text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  onClick={() => setViewMode("INPUT_DETAIL")}
                >
                  <IconX className="mr-1.5 h-4 w-4" /> Ya, Ada Kejadian
                </Button>
              </div>
            </div>
          )}

          {viewMode === "INPUT_DETAIL" && (
            <DetailKejadianRisikoForm
              logMaster={logMaster}
              onSuccessSubmit={() => {
                queryClient.invalidateQueries({
                  queryKey: ["kejadianRisiko", logMaster.tahun],
                });
                onClose();
              }}
            />
          )}

          {viewMode === "INPUT_NIHIL" && (
            <FormLaporanNihilRisiko
              logMaster={logMaster}
              onSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: ["kejadianRisiko", logMaster.tahun],
                });
                queryClient.invalidateQueries({ queryKey: ["analisisResidu"] });
                onClose();
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

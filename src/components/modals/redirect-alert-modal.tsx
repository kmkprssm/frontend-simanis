"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalStore } from "@/stores/modal-store";
import { LoadingButton } from "../ui/loading-button";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { IconCheckFilled } from "@tabler/icons-react";

export const RedirectAlertModal = () => {
  const { isOpen, onClose, type, config, data } = useModalStore();
  const router = useRouter();

  const { title, message } = config;
  const isModalOpen = isOpen && type === "redirectSavedKejadianRisiko";

  // Ambil id risiko yang barusan dikirim dari form kejadian
  const targetRiskId = data?.id;

  const handleRedirectEvaluasi = () => {
    onClose();
    if (targetRiskId) {
      // Mengarahkan user beserta Query Parameters bimbingan pengisian
      router.push(
        `/evaluasi-risiko?open_risk_id=${targetRiskId}&action=new_evaluation`,
      );
    } else {
      router.push("/evaluasi-risiko");
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={() => onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
            <IconCheckFilled stroke={2} className="size-6" />
          </div>
          <AlertDialogTitle className="text-base font-bold text-slate-900">
            {title || "Pencatatan Berhasil!"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs leading-normal text-slate-500">
            {message || "Data insiden berhasil disimpan ke log bulanan sistem."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onClose()}
          >
            Nanti Saja
          </Button>
          <LoadingButton
            variant="default"
            size="sm"
            className="border-none bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
            loading={false}
            loadingType="submit"
            type="button"
            onClick={handleRedirectEvaluasi}
          >
            Evaluasi Risiko Sekarang
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

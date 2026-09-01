"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal-store";
import { AnalisisResiduRisikoForm } from "../analisis-residu-risiko/analisis-residu-risiko-form";

export const AddEditAnalisisResiduRisikoModal = () => {
  const { isOpen, onClose, type, config, data } = useModalStore();
  const isModalOpen = isOpen && type === "addEditAnalisisResidu";

  const residuRisikoData = data?.residuData; // Mengambil object row dari table row data.original
  // Mapping agar properti klop dengan format internal Form Analisis
  const mappedDefaultValues = residuRisikoData
    ? {
        risk_id: residuRisikoData.risk_id,
        likelihood:
          residuRisikoData.likelihood_after !== null
            ? String(residuRisikoData.likelihood_after)
            : "",
        impact:
          residuRisikoData.impact_after !== null
            ? String(residuRisikoData.impact_after)
            : "",
        score:
          residuRisikoData.score_after !== null
            ? String(residuRisikoData.score_after)
            : "",
      }
    : undefined;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-xs flex-col gap-0 p-0 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <DialogHeader className="border-b p-6 pb-4">
          <DialogTitle>{config?.title}</DialogTitle>
          <DialogDescription>{config?.message}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {isModalOpen && (
            <AnalisisResiduRisikoForm
              key={residuRisikoData?.risk_id || "add-residu"}
              rawResiduData={residuRisikoData}
              defaultValues={mappedDefaultValues}
              onSubmitSuccess={() => onClose()}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

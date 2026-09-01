import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CloseRisikoValues } from "@/schemas/pengendalian-risiko-schema";
import { useModalStore } from "@/stores/modal-store";
import { CloseRisikoForm } from "../pengendalian-risiko/close-risiko-form";
import { executeCloseRisk } from "@/server/apis/pengendalian-risiko";

export const CloseRisikoModal = () => {
  const { isOpen, onClose, type, config, data } = useModalStore();
  const { title, message } = config;
  const isModalOpen = isOpen && type === "closeRisk";

  const selectedRiskId = data?.id;
  const pengendalianRisikoData = data?.pengendalianRisikoDetail;
  const summaryData = data?.summaryData;

  const handleClose = () => {
    onClose({
      title,
      message,
    });
  };

  const onSubmit = async (values: CloseRisikoValues) => {
    const result = await executeCloseRisk(selectedRiskId, values);

    if (!result.success) {
      toast.error(result.message || "Gagal memproses penutupan risiko.");
    } else {
      toast.success("Risiko berhasil ditutup secara resmi!", {
        position: "top-right",
      });
      handleClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-xs flex-col gap-0 p-0 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <DialogHeader className="border-b p-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <CloseRisikoForm
            key={"add"}
            summary={summaryData}
            risikoDetail={pengendalianRisikoData}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

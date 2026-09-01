import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal-store";
import { IdentifikasiRisikoForm } from "../identifikasi-risiko/identifikasi-risiko-form";

export const AddEditIdentifikasiRisikoModal = () => {
  const { isOpen, onClose, type, config, data } = useModalStore();
  const { title, message } = config;
  const isModalOpen = isOpen && type === "addEditIdentifikasiRisiko";

  const editData = data?.identifikasiData;
  const kategoriData = data?.kategoriRisikoData;

  const handleClose = () => {
    onClose({
      title,
      message,
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-xs flex-col gap-0 p-0 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <DialogHeader className="border-b p-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <IdentifikasiRisikoForm
            key={editData?.id || "add"}
            defaultValues={editData}
            kategoriRisiko={kategoriData}
            onSubmitSuccess={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

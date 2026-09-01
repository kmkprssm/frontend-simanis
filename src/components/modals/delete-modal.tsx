import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal-store";
import { LoadingButton } from "../ui/loading-button";
import { IconAlertTriangle } from "@tabler/icons-react";

export const DeleteModal = () => {
  const { isOpen, onClose, type, config } = useModalStore();

  const { title, message, loading, onDelete } = config;
  const isModalOpen = isOpen && type === "delete";

  const handleClose = () => {
    onClose({
      title,
      message,
      loading,
      onDelete,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    handleClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="shadow-4 max-w-xs rounded-xl sm:max-w-sm sm:rounded-xl md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <DialogHeader>
          <div className="sm:flex sm:items-start">
            <div className="bg-destructive/10 mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <IconAlertTriangle
                stroke={2}
                className="text-destructive size-6"
              />
            </div>
            <div className="mt-3 space-y-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{message}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="pt-2">
          <Button
            onClick={handleClose}
            variant="outline"
            className="relative mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-max"
          >
            Batal
          </Button>
          <LoadingButton
            onClick={handleDelete}
            variant="delete"
            size="default"
            loading={loading!}
            loadingType="submit"
            className="relative inline-flex w-full justify-center sm:w-max"
          >
            Hapus
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

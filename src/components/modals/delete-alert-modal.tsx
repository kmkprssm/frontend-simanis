"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalStore } from "@/stores/modal-store";
import { IconAlertTriangle } from "@tabler/icons-react";
import { LoadingButton } from "../ui/loading-button";

export const DeleteAlertModal = () => {
  const { isOpen, onClose, type, config } = useModalStore();

  const { title, message, loading, onAlertDelete } = config;
  const isModalOpen = isOpen && type === "deleteAlert";

  const handleClose = () => {
    onClose({
      title,
      message,
      loading,
      onAlertDelete,
    });
  };

  const handleDelete = () => {
    if (onAlertDelete) {
      onAlertDelete();
    }
    handleClose();
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <div className="bg-destructive/10 mx-auto mb-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <IconAlertTriangle stroke={2} className="text-destructive size-6" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <LoadingButton
            onClick={handleDelete}
            variant="delete"
            size="default"
            loading={loading!}
            loadingType="submit"
            type="submit"
          >
            Hapus
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

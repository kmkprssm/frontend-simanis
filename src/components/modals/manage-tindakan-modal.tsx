"use client";

import * as React from "react";
import { toast } from "sonner";
import { IconBriefcase, IconPlus } from "@tabler/icons-react";

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
  TKontrolRisikoWithActions,
  TRencanaAksiRisiko,
  TRisikoAktifMitigasiItem,
} from "@/types/perlakuan-risiko-type";
import { PilihPengendalianLists } from "../perlakuan-risiko/pilih-pengendalian-lists";
import { TindakanLists } from "../perlakuan-risiko/tindakan-lists";
import { TindakanRisikoForm } from "../perlakuan-risiko/tindakan-risiko-form";
import { CompleteTindakanRisikoForm } from "../perlakuan-risiko/complete-tindakan-risiko-form";
import {
  CompleteTindakanValues,
  CreateTindakanValues,
} from "@/schemas/perlakuan-risiko-schema";
import {
  completeTindakanRisiko,
  createUpdateTindakanRisiko,
  deleteTindakanResiko,
  updateStatusTindakanRisiko,
} from "@/server/apis/perlakuan-risiko";

// Mengubah tipe view agar lebih spesifik hanya untuk sub-form internal modal
type TFormView = "DEFAULT" | "FORM_ACTION" | "FORM_COMPLETE";

export const ManageTindakanModal = () => {
  const { isOpen, onClose, type, config, data, onOpen } = useModalStore();
  const { title, message } = config;
  const isModalOpen = isOpen && type === "manageTindakan";

  // State subFormView hanya digunakan jika user sedang membuka form tambah/edit/complete
  const [subFormView, setSubFormView] = React.useState<TFormView>("DEFAULT");
  const [manuallySelectedControl, setManuallySelectedControl] =
    React.useState<TKontrolRisikoWithActions | null>(null);
  const [selectedAction, setSelectedAction] =
    React.useState<TRencanaAksiRisiko | null>(null);

  const itemRisiko = data?.pengendalianRisikoAktifDatas;
  const masterListKontrol = React.useMemo(() => {
    return itemRisiko?.list_kontrol || [];
  }, [itemRisiko?.list_kontrol]);

  // Evaluasi Selected Control secara langsung
  const selectedControl = React.useMemo(() => {
    if (masterListKontrol.length === 1) {
      return masterListKontrol[0];
    }
    return manuallySelectedControl;
  }, [masterListKontrol, manuallySelectedControl]);

  // SOLUSI UTAMA: Menentukan view aktif berdasarkan state data secara deklaratif (Bebas dari useEffect/setState loop)
  const isDirectListAction = masterListKontrol.length === 1;
  const showSelectControlView =
    !isDirectListAction &&
    !manuallySelectedControl &&
    subFormView === "DEFAULT";
  const showListActionsView =
    (isDirectListAction || manuallySelectedControl) &&
    subFormView === "DEFAULT";

  const handleClose = () => {
    onClose({ title, message });

    setTimeout(() => {
      setSubFormView("DEFAULT");
      setManuallySelectedControl(null);
      setSelectedAction(null);
    }, 300);
  };

  const handleSelectControl = (kontrol: TKontrolRisikoWithActions) => {
    setManuallySelectedControl(kontrol);
    setSubFormView("DEFAULT");
  };

  const handleBackToControls = () => {
    setManuallySelectedControl(null);
    setSubFormView("DEFAULT");
  };

  const updateGlobalStore = (updatedKontrol: TKontrolRisikoWithActions) => {
    const updatedList = masterListKontrol.map((k) =>
      k.id === updatedKontrol.id ? updatedKontrol : k,
    );
    onOpen("manageTindakan", config, {
      ...data,
      pengendalianRisikoAktifDatas: {
        ...itemRisiko,
        list_kontrol: updatedList,
      } as TRisikoAktifMitigasiItem,
    });
  };

  const handleSubmitTindakan = async (values: CreateTindakanValues) => {
    if (!selectedControl) {
      toast.error("Kontrol pengendalian tidak ditemukan.");
      return;
    }

    try {
      const result = await createUpdateTindakanRisiko(
        selectedAction?.id,
        values,
      );

      if (!result.success) {
        toast.error(result?.message || "Terjadi kesalahan.");
      } else {
        toast.success(
          selectedControl
            ? "Tindakan risiko berhasil diperbarui!"
            : "Tindakan risiko berhasil ditambahkan!",
          { position: "top-right" },
        );

        const currentActions = selectedControl.actions || [];
        let updatedActions: TRencanaAksiRisiko[] = [];
        const tindakanBaruAtauDiubah = result.data.data;

        if (selectedAction) {
          updatedActions = currentActions.map((a) =>
            a.id === selectedAction.id
              ? { ...a, ...tindakanBaruAtauDiubah, ...values }
              : a,
          );
        } else {
          updatedActions = [
            { ...tindakanBaruAtauDiubah, ...values, status: "Open" },
            ...currentActions,
          ];
        }

        const updatedControlObject: TKontrolRisikoWithActions = {
          ...selectedControl,
          actions: updatedActions,
        };

        updateGlobalStore(updatedControlObject);
        setManuallySelectedControl(updatedControlObject);
        setSubFormView("DEFAULT");
      }
    } catch (err) {
      toast.error("Gagal memproses data kontrol.");
    }
  };

  const handleSubmitCompleteTindakan = async (
    values: CompleteTindakanValues,
  ) => {
    if (!selectedControl || !selectedAction) {
      toast.error("Data kontrol atau tindakan tidak ditemukan.");
      return;
    }

    try {
      const result = await completeTindakanRisiko(selectedAction?.id, values);

      if (!result.success) {
        toast.error(result?.message || "Terjadi kesalahan.");
      } else {
        toast.success("Tindakan risiko berhasil diselesaikan!", {
          position: "top-right",
        });

        const currentActions = selectedControl.actions || [];
        const updatedActions: TRencanaAksiRisiko[] = currentActions.map((a) =>
          a.id === selectedAction.id
            ? { ...a, ...values, status: "Closed" }
            : a,
        );

        const updatedControlObject: TKontrolRisikoWithActions = {
          ...selectedControl,
          actions: updatedActions,
        };

        updateGlobalStore(updatedControlObject);
        setManuallySelectedControl(updatedControlObject);
        setSubFormView("DEFAULT");
      }
    } catch (err) {
      toast.error("Gagal memproses data kontrol.");
    }
  };

  const handleMulaiPengerjaan = async (action: TRencanaAksiRisiko) => {
    if (!selectedControl) {
      toast.error("Kontrol pengendalian tidak ditemukan.");
      return;
    }

    try {
      const result = await updateStatusTindakanRisiko(action.id);
      if (!result.success) {
        toast.error(result?.message || "Terjadi kesalahan.", {
          position: "top-right",
        });
      } else {
        toast.success("Tindakan dimulai! Status berubah menjadi On Progress.", {
          position: "top-right",
        });

        const currentActions = selectedControl.actions || [];
        const updatedActions: TRencanaAksiRisiko[] = currentActions.map((a) =>
          a.id === action.id ? { ...a, status: "On Progress" } : a,
        );

        const updatedControlObject: TKontrolRisikoWithActions = {
          ...selectedControl,
          actions: updatedActions,
        };

        updateGlobalStore(updatedControlObject);
        setManuallySelectedControl(updatedControlObject);
      }
    } catch (err) {
      toast.error("Gagal mengubah status pengerjaan.");
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    if (!selectedControl) {
      toast.error("Kontrol pengendalian tidak ditemukan.");
      return;
    }

    try {
      const result = await deleteTindakanResiko(actionId);

      if (!result.success) {
        toast.error(result?.message || "Terjadi kesalahan.", {
          position: "top-right",
        });
      } else {
        toast.success("Tindakan risiko berhasil dihapus", {
          position: "top-right",
        });

        const currentActions = selectedControl.actions || [];
        const updatedActions = currentActions.filter((a) => a.id !== actionId);

        const updatedControlObject: TKontrolRisikoWithActions = {
          ...selectedControl,
          actions: updatedActions,
        };

        updateGlobalStore(updatedControlObject);
        setManuallySelectedControl(updatedControlObject);
      }
    } catch (err) {
      toast.error("Gagal menghapus tindakan.");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-xs flex-col gap-0 overflow-hidden border-slate-200 p-0 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <DialogHeader className="border-b bg-slate-50/50 p-5 pb-4">
          <div className="flex w-full items-start gap-4">
            <div className="min-w-0 flex-1 space-y-0.5">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                <IconBriefcase className="h-5 w-5 shrink-0 text-sky-600" />
                <span>
                  {showSelectControlView && "Pilih Kontrol Pengendalian"}
                  {showListActionsView && "Daftar Tindakan (Action Plan)"}
                  {subFormView === "FORM_ACTION" &&
                    (selectedAction ? "Edit Tindakan" : "Tambah Tindakan Baru")}
                  {subFormView === "FORM_COMPLETE" && "Tandai Tindakan Selesai"}
                </span>
              </DialogTitle>
              <DialogDescription className="max-w-137.5 truncate text-xs text-slate-500">
                {selectedControl
                  ? `Kontrol: ${selectedControl.nama_kontrol}`
                  : message}
              </DialogDescription>
            </div>
            {showListActionsView &&
              selectedControl &&
              selectedControl?.actions.length > 0 && (
                <Button
                  size="sm"
                  className="shrink-0 gap-1 text-xs font-semibold"
                  onClick={() => {
                    setSelectedAction(null);
                    setSubFormView("FORM_ACTION");
                  }}
                >
                  <IconPlus className="h-3.5 w-3.5" /> Tambah Tindakan
                </Button>
              )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-5">
          {showSelectControlView && (
            <PilihPengendalianLists
              masterListKontrol={masterListKontrol}
              onSelectControl={handleSelectControl}
            />
          )}

          {showListActionsView && selectedControl && (
            <TindakanLists
              selectedControl={selectedControl}
              showBackButton={masterListKontrol.length > 1}
              onBackToControls={handleBackToControls}
              onAddAction={() => {
                setSelectedAction(null);
                setSubFormView("FORM_ACTION");
              }}
              onEditAction={(action) => {
                setSelectedAction(action);
                if (action.status === "Closed") {
                  setSubFormView("FORM_COMPLETE");
                } else {
                  setSubFormView("FORM_ACTION");
                }
              }}
              onDeleteAction={handleDeleteAction}
              onMulaiPengerjaan={handleMulaiPengerjaan}
              onTandaiSelesai={(action) => {
                setSelectedAction(action);
                setSubFormView("FORM_COMPLETE");
              }}
            />
          )}

          {subFormView === "FORM_ACTION" && selectedControl && (
            <TindakanRisikoForm
              kontrolId={selectedControl.id}
              editData={selectedAction}
              onCancel={() => setSubFormView("DEFAULT")}
              onSubmitSuccess={handleSubmitTindakan}
            />
          )}

          {subFormView === "FORM_COMPLETE" &&
            selectedControl &&
            selectedAction && (
              <CompleteTindakanRisikoForm
                actionData={selectedAction}
                onCancel={() => setSubFormView("DEFAULT")}
                onSubmitSuccess={handleSubmitCompleteTindakan}
              />
            )}
        </div>

        {(showSelectControlView || showListActionsView) && (
          <div className="flex justify-end border-t bg-slate-50 p-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleClose}
            >
              Tutup Jendela
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

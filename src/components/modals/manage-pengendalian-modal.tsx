"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconShieldCheck,
  IconPlus,
  IconAlertCircle,
  IconInfoCircle,
  IconHierarchy,
} from "@tabler/icons-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modal-store";
import { CreatePengendalianRisikoValues } from "@/schemas/perlakuan-risiko-schema";
import { PengendalianRisikoCard } from "../perlakuan-risiko/pengendalian-risiko-card";
import {
  TKontrolRisikoWithActions,
  TRisikoAktifMitigasiItem,
} from "@/types/perlakuan-risiko-type";
import { PengendalianRisikoForm } from "../perlakuan-risiko/pengendalian-risiko-form";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  createUpdatePengendalianRisiko,
  deletePengendalianRisiko,
} from "@/server/apis/perlakuan-risiko";
import { getRiskLevel } from "@/helpers/risk-helpers";

type TViewMode = "LIST" | "FORM";

export const ManagePengendalianModal = () => {
  const { isOpen, onOpen, onClose, type, config, data } = useModalStore();
  const { title, message } = config;
  const isModalOpen = isOpen && type === "managePengendalian";

  const [view, setView] = React.useState<TViewMode>("LIST");
  const [selectedControlForEdit, setSelectedControlForEdit] =
    React.useState<TKontrolRisikoWithActions | null>(null);

  const itemRisiko = data?.pengendalianRisikoAktifDatas;
  const masterListKontrol = itemRisiko?.list_kontrol || [];

  const finalRisk = getRiskLevel((itemRisiko?.score && itemRisiko.score) || 0);

  const handleOpenAddForm = () => {
    setSelectedControlForEdit(null);
    setView("FORM");
  };

  const handleOpenEditForm = (kontrol: TKontrolRisikoWithActions) => {
    setSelectedControlForEdit(kontrol);
    setView("FORM");
  };

  const handleClose = () => {
    onClose({
      title,
      message,
    });

    setTimeout(() => {
      setView("LIST");
      setSelectedControlForEdit(null);
    }, 300);
  };

  const isEditPengendalianMode = !!selectedControlForEdit?.id;

  const handleFormSubmit = async (values: CreatePengendalianRisikoValues) => {
    try {
      const result = await createUpdatePengendalianRisiko(
        isEditPengendalianMode ? selectedControlForEdit?.id : undefined,
        values,
      );

      if (!result.success) {
        toast.error(result?.message || "Terjadi kesalahan.");
      } else {
        toast.success(
          selectedControlForEdit
            ? "Pengendalian risiko berhasil diperbarui!"
            : "Pengendalian risiko berhasil ditambahkan!",
          {
            position: "top-right",
          },
        );

        const kontrolBaruAtauDiubah = result.data;

        if (kontrolBaruAtauDiubah) {
          let updatedListKontrol = [...masterListKontrol];

          if (selectedControlForEdit) {
            updatedListKontrol = updatedListKontrol.map((k) =>
              k.id === selectedControlForEdit.id
                ? {
                    ...k,
                    ...kontrolBaruAtauDiubah,
                    ...values,
                    actions: k.actions || [],
                  }
                : k,
            );
          } else {
            updatedListKontrol = [
              { ...kontrolBaruAtauDiubah, ...values, actions: [] },
              ...updatedListKontrol,
            ];
          }

          onOpen("managePengendalian", config, {
            ...data,
            pengendalianRisikoAktifDatas: {
              ...itemRisiko,
              list_kontrol: updatedListKontrol,
            } as TRisikoAktifMitigasiItem,
          });
        }

        setView("LIST");
      }
    } catch (err) {
      toast.error("Gagal memproses data kontrol.");
    }
  };

  const handleDeleteKontrol = async (kontrolId: string) => {
    try {
      const result = await deletePengendalianRisiko(kontrolId);

      if (!result.success) {
        toast.error(result?.message || "Terjadi kesalahan.", {
          position: "top-right",
        });
      } else {
        toast.success("Kontrol risiko berhasil dihapus", {
          position: "top-right",
        });

        const updatedListKontrol = masterListKontrol.filter(
          (k) => k.id !== kontrolId,
        );

        onOpen("managePengendalian", config, {
          ...data,
          pengendalianRisikoAktifDatas: {
            ...itemRisiko,
            list_kontrol: updatedListKontrol,
          } as TRisikoAktifMitigasiItem,
        });
      }
    } catch (err) {
      toast.error("Gagal menghapus tindakan.");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-xs flex-col gap-0 overflow-hidden border-slate-200 p-0 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <DialogHeader className="border-b bg-slate-50/50 p-5 pb-4">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-0.5">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                <IconShieldCheck className="h-5 w-5 shrink-0 text-indigo-600" />
                <span>
                  {view === "FORM"
                    ? selectedControlForEdit
                      ? "Edit Kontrol"
                      : "Tambah Kontrol Baru"
                    : title}
                </span>
              </DialogTitle>
              <DialogDescription className="max-w-125 truncate text-xs">
                {view === "FORM"
                  ? `Risiko Induk: ${itemRisiko?.nama_resiko}`
                  : message}
              </DialogDescription>
            </div>

            {view === "LIST" && masterListKontrol.length > 0 && (
              <Button
                size="sm"
                className="shrink-0 gap-1 text-xs font-semibold"
                onClick={handleOpenAddForm}
              >
                <IconPlus className="h-3.5 w-3.5" /> Kontrol Baru
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          {view === "FORM" ? (
            <PengendalianRisikoForm
              riskId={itemRisiko?.id || ""}
              editData={selectedControlForEdit}
              onCancel={() => setView("LIST")}
              onSubmitSuccess={handleFormSubmit}
            />
          ) : (
            <div className="space-y-4 p-5">
              <div className="flex flex-col gap-1.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <h3 className="text-base leading-snug font-bold text-slate-900">
                  {itemRisiko?.nama_resiko || "NAMA RISIKO BELUM TERDEFINISI"}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-xs"
                  >
                    Kategori: {itemRisiko?.kategori_name || "Umum"}
                  </Badge>

                  <div className="text-muted-foreground ml-1 flex items-center gap-1 text-xs">
                    <IconHierarchy className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>
                      Unit:{" "}
                      <span className="font-semibold text-slate-700">
                        {itemRisiko?.pemilik_risiko || "Belum ada pemilik"}
                      </span>
                    </span>
                  </div>
                  <div className="ml-1 flex items-center gap-1">
                    <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                      Total Skor
                    </span>
                    <span
                      className={cn(
                        "block text-2xl font-black tracking-tight",
                        finalRisk.textClass,
                      )}
                    >
                      {itemRisiko?.score}
                    </span>
                  </div>
                  <div className="ml-1 flex items-center gap-1">
                    <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                      Tingkat Risiko
                    </span>
                    <Badge
                      className={cn(
                        "border-none px-2.5 py-0.5 text-[11px] font-bold shadow-sm shadow-black/10",
                        finalRisk.badgeClass,
                      )}
                    >
                      {finalRisk.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100/50 bg-indigo-50/30 p-3 text-xs text-slate-600">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">
                    Deskripsi Risiko
                  </span>
                  <p className="leading-normal text-slate-500">
                    {itemRisiko?.deskripsi ||
                      "Tidak ada deskripsi kontekstual risiko..."}
                  </p>
                </div>
              </div>

              {masterListKontrol.length === 0 ? (
                <div className="mx-auto my-4 max-w-md rounded-xl border border-dashed border-slate-200 bg-white p-6 py-10 text-center shadow-2xs">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-amber-600 shadow-inner">
                    <IconAlertCircle className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <h6 className="text-sm font-bold text-slate-800">
                    Belum Ada Kontrol Terdaftar
                  </h6>
                  <p className="mx-auto mt-1 mb-4 max-w-70 text-xs leading-normal text-slate-400">
                    Risiko ini membutuhkan setidaknya satu instrumen kontrol
                    mitigasi untuk menunjang rencana aksi.
                  </p>
                  <Button
                    size="sm"
                    className="gap-1 px-4 text-xs font-semibold"
                    onClick={handleOpenAddForm}
                  >
                    <IconPlus className="h-4 w-4" /> Tambah Kontrol Pertama
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-bold uppercase">
                    Daftar Pengendalian
                  </div>
                  <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
                    {masterListKontrol.map((kontrol) => {
                      const actionsList = kontrol.actions || [];
                      const completedActions = actionsList.filter(
                        (a) => a.status === "Closed",
                      ).length;

                      const percent =
                        actionsList.length > 0
                          ? Math.round(
                              (completedActions / actionsList.length) * 100,
                            )
                          : 0;

                      return (
                        <PengendalianRisikoCard
                          key={kontrol.id}
                          kontrol={kontrol}
                          totalActions={actionsList.length}
                          completedActions={completedActions}
                          percent={percent}
                          onEdit={() => handleOpenEditForm(kontrol)}
                          onDelete={() => handleDeleteKontrol(kontrol.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {view === "LIST" && (
          <div className="flex justify-end border-t bg-slate-50 p-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleClose}
            >
              Tutup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

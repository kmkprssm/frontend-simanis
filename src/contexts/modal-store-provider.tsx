"use client";

import { useSyncExternalStore } from "react";
import { AddEditKonteksModal } from "@/components/modals/add-edit-konteks-modal";
import { DeleteModal } from "@/components/modals/delete-modal";
import { DetailModal } from "@/components/modals/detail-modal";
import { AddEditIdentifikasiRisikoModal } from "@/components/modals/add-edit-identifikasi-risiko-modal";
import { AddEditAnalisisRisikoModal } from "@/components/modals/add-edit-analisis-risiko-modal";
import { AddEditEvaluasiRisikoModal } from "@/components/modals/add-edit-evaluasi-risiko-modal";
import { ManagePengendalianModal } from "@/components/modals/manage-pengendalian-modal";
import { ManageTindakanModal } from "@/components/modals/manage-tindakan-modal";
import { CloseRisikoModal } from "@/components/modals/close-risiko-modal";
import { DeleteAlertModal } from "@/components/modals/delete-alert-modal";
import { KonfirmasiStatusBulananModal } from "@/components/modals/konfirmasi-status-bulanan-modal";
import { AddEditKejadianRisikoModal } from "@/components/modals/add-edit-kejadian-risiko-modal";
import { RedirectAlertModal } from "@/components/modals/redirect-alert-modal";
import { AddEditAnalisisResiduRisikoModal } from "@/components/modals/add-edit-analisis-residu-risiko-modal";
import { AddNewUserModal } from "@/components/modals/add-new-user-modal";

const emptySubscribe = () => () => {};

export const ModalStoreProvider = () => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isMounted) return null;

  return (
    <>
      <DeleteModal />
      <DeleteAlertModal />
      <AddEditKonteksModal />
      <DetailModal />
      <AddEditIdentifikasiRisikoModal />
      <AddEditAnalisisRisikoModal />
      <AddEditEvaluasiRisikoModal />
      <ManagePengendalianModal />
      <ManageTindakanModal />
      <CloseRisikoModal />
      <KonfirmasiStatusBulananModal />
      <AddEditKejadianRisikoModal />
      <RedirectAlertModal />
      <AddEditAnalisisResiduRisikoModal />
      <AddNewUserModal />
    </>
  );
};

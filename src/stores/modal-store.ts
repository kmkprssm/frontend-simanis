import { create } from "zustand";

import { TIdentifikasiRisiko } from "@/types/identifikasi-risiko-type";
import { TKategoriRisiko } from "@/types/kategori-risiko-type";
import { TKonteks } from "@/types/konteks-type";
import {
  TAnalisisResiduRisiko,
  TAnalisisRisiko,
} from "@/types/analisis-risiko-type";
import { TEvaluasiRisiko } from "@/types/evaluasi-risiko-type";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";
import { TRisikoDetail, TSummary } from "@/hooks/usePengendalian";
import {
  TKejadianRisikoDetail,
  TLogRisikoBulanan,
} from "@/types/pencatatan-kejadian-risiko-type";
import { TModalView } from "@/components/modals/konfirmasi-status-bulanan-modal";
import { TMasterUser } from "@/types/user-type";

export type TModal =
  | "delete"
  | "deleteAlert"
  | "detail"
  | "addEditKonteks"
  | "addEditIdentifikasiRisiko"
  | "addEditAnalisisRisiko"
  | "addEditEvaluasiRisiko"
  | "managePengendalian"
  | "manageTindakan"
  | "closeRisk"
  | "konfirmasiStatusBulanan"
  | "addEditKejadianRisiko"
  | "redirectSavedKejadianRisiko"
  | "addEditAnalisisResidu"
  | "addNewUser";

export interface IModalData {
  id?: string;
  konteksData?: TKonteks;
  identifikasiData?: TIdentifikasiRisiko;
  identifikasiRisikoData?: TIdentifikasiRisiko[];
  kategoriRisikoData?: TKategoriRisiko[];
  analisisRisikoData?: TAnalisisRisiko;
  analisisRisikoDatas?: TAnalisisRisiko[];
  evaluasiRisikoData?: TEvaluasiRisiko;
  evaluasiRisikoDatas?: TEvaluasiRisiko[];
  riwayatEvaluasiRisikoData?: TEvaluasiRisiko[];
  pengendalianRisikoAktifDatas?: TRisikoAktifMitigasiItem;
  pengendalianRisikoDitutupDatas?: TRisikoAktifMitigasiItem;
  summaryData?: TSummary;
  pengendalianRisikoDetail?: TRisikoDetail | null;
  logMasterData?: TLogRisikoBulanan;
  dataBulanDetail?: TKejadianRisikoDetail;
  residuData?: TAnalisisResiduRisiko;
  userData?: TMasterUser;
}

interface IModalConfig {
  title?: string;
  message?: React.ReactNode;
  footer?: React.ReactNode;
  childrenDetail?: React.ReactNode;
  loading?: boolean;
  forceViewMode?: TModalView;
  onDelete?: () => void;
  onAlertDelete?: (param?: string) => void;
}

interface IModalStore {
  type: TModal | null;
  data: IModalData;
  isOpen: boolean;
  config: IModalConfig;
  onOpen: (type: TModal, config?: IModalConfig, data?: IModalData) => void;
  onClose: (config?: IModalConfig, data?: IModalData) => void;
}

export const useModalStore = create<IModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  config: {},
  onOpen: (type, config = {}, data = {}) =>
    set({ isOpen: true, type, config, data }),
  onClose: (config = {}, data = {}) =>
    set({ type: null, isOpen: false, config, data }),
}));

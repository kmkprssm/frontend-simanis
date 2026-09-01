import { TIdentifikasiRisiko, TStatusRisiko } from "./identifikasi-risiko-type";

export type TKontrolRisiko = {
  created_at: Date;
  created_by_uuid: string;
  deskripsi: string;
  document_link: string;
  id: string;
  nama_kontrol: string;
  nama_resiko: string;
  risk_id: string;
  status_risiko: TStatusRisiko;
  tipe: string;
  updated_at: Date;
  effectiveness: number;
  status_penilaian: string;
  total_action: number;
  closed_action: number;
  is_calculated: boolean;
};

export type TKontrolRisikoWithActions = {
  created_at: Date;
  created_by_uuid: string;
  deskripsi: string;
  document_link: string;
  id: string;
  nama_kontrol: string;
  nama_resiko: string;
  risk_id: string;
  status_risiko: TStatusRisiko;
  tipe: string;
  updated_at: Date;
  strategi: string;
  actions: TRencanaAksiRisiko[];
};

export type TRencanaAksiRisiko = {
  action_plan: string;
  bukti_mitigasi: string;
  created_at: Date;
  created_by_uuid: string;
  id: string;
  kebutuhan_sumberdaya: string;
  kontrol_id: string;
  nama_kontrol: string;
  nama_resiko: string;
  pemilik_risiko: string;
  pic_name: string;
  risiko_created_by: string;
  risk_id: string;
  status: TStatusTIndakanRIsiko;
  target_date: Date;
  updated_at: Date;
  realisasi_date: Date;
};

export type TStatusTIndakanRIsiko = "Open" | "On Progress" | "Closed";
export type TStatsRisikoWithMitigasi = {
  totalRisks: number;
  totalKontrol: number;
  totalAction: number;
  doneActions: number;
  overdueActions: number;
  activeRisks: number;
  closedRisks: number;
};

export type TRisikoAktifMitigasiItem = TIdentifikasiRisiko & {
  kategori_name: string;
  pemilik_risiko: string;
  impact: number;
  likelihood: number;
  score: number;
  has_overdue_action: boolean;
  list_kontrol: TKontrolRisikoWithActions[];
};

export type TRisikoAktifMitigasiResponse = TRisikoAktifMitigasiItem[] & {
  error?: string;
};

export type TStatsRisikoWithMitigasiResponse = TStatsRisikoWithMitigasi & {
  error?: string;
};

import { TKejadianRisikoDetailInCurrentMonth } from "./pencatatan-kejadian-risiko-type";
import { TKontrolRisikoWithActions } from "./perlakuan-risiko-type";

export type TPemantauanRisiko = {
  id: string;
  nama_resiko: string;
  deskripsi: string;
  status: string;
  closed_at: Date;
  close_reason: string;
  updated_at: Date;
  created_by_uuid: string;
  kategori_name: string;
  likelihood_before: number;
  inherent_score: number;
  likelihood_after: number;
  impact_after: number;
  score_after: number;
  strategi: string;
  prioritas: number;
  pemilik_risiko: string;
  total_kejadian_berjalan: number;
};

export type TDetailPemantauanRisiko = {
  list_kontrol: TKontrolRisikoWithActions[];
} & {
  error?: string;
};

export type TDetailKejadianRisiko = {
  tahun: number;
  jumlah_kejadian: number;
  risk_id: string;
  detail: TKejadianRisikoDetailInCurrentMonth[];
} & {
  error?: string;
};

export type TPemantauanRisikoWithMeta = {
  risiko: TPemantauanRisiko[];
  meta: {
    page: number;
    limit: number;
    totalRows: number;
    hasMore: boolean;
  };
};

export type TPemantauanRisikoResponse = TPemantauanRisikoWithMeta & {
  error?: string;
};

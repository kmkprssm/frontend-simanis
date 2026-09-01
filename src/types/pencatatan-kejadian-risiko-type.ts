export type TLogRisikoBulanan = {
  id?: string;
  tahun: number;
  bulan: number;
  status_laporan: "BELUM_DIISI" | "NIHIL" | "TERJADI_RISIKO";
  reported_by: string | null;
  reported_at: string | Date | null;
  pelapor: string | null;
};

export type TKejadianRisikoDetail = {
  kejadian_id: string;
  log_bulanan_id: string;
  tanggal_kejadian: string | Date;
  sebab_saat_ini: string;
  dampak_riil: string;
  tindakan_lanjutan: string;
  is_nihil: boolean;
  keterangan_nihil: string;
  kejadian_created_at: string | Date;
  risk_id: string;
  nama_resiko: string;
  deskripsi: string | null;
  status_utama_risiko: string;
  created_by_uuid: string;
  kategori_name: string | null;
  skor_risiko: number | null;
  likelihood: number | null;
  impact: number | null;
  strategi: string | null;
  prioritas: number | null;
};

export type TKejadianRisikoDetailInCurrentMonth = {
  kejadian_id: string;
  tanggal_kejadian: string | Date;
  sebab_saat_ini: string;
  dampak_riil: string;
  tindakan_lanjutan: string;
  created_at: string | Date;
  pelapor: string | null;
  is_nihil: boolean;
  keterangan_nihil: string;
  bulan: number;
  status_laporan: "BELUM_DIISI" | "NIHIL" | "TERJADI_RISIKO";
};

export interface TRisikoOption {
  risk_id: string;
  nama_resiko: string;
  deskripsi: string | null;
  status: string;
  strategi: string | null;
}

export type FetchRisksResponse = {
  risiko: TRisikoOption[];
  meta: {
    page: number;
    limit: number;
    totalRows: number;
    hasMore: boolean;
    total_aktif?: number;
    total_non_aktif?: number;
  };
};

export type TDataBulan = {
  log_master: TLogRisikoBulanan;
  jumlah_kejadian: number;
  detail: TKejadianRisikoDetail[];
};

export type TGetKejadianRisikoResponse = {
  [tahun: string]: Record<number, TDataBulan>;
} & {
  error?: string;
};

export interface TGroupedInsidenItem {
  nama_resiko: string;
  skor_risiko: number | null;
  status_utama_risiko: string;
  list_insiden: TKejadianRisikoDetail[];
}

export type TGroupedKejadianData = {
  insiden: Record<string, TGroupedInsidenItem>;
  nihil: TKejadianRisikoDetail[];
};

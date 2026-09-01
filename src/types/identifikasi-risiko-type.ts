export type TIdentifikasiRisiko = {
  close_reason: string;
  closed_at: Date;
  consequences: string;
  created_at: Date;
  created_by: number;
  created_by_name: string;
  created_by_uuid: string;
  deskripsi: string;
  existing_controls: string;
  fase: string;
  id: string;
  kategori_id: number;
  kategori_name: string;
  konteks_id: number;
  nama_resiko: string;
  root_cause: string;
  status: string;
  updated_at: Date;
};

export type TIdentifikasiRisikoCategory =
  | "Strategis"
  | "Operasional"
  | "Keuangan"
  | "Kepatuhan"
  | "Teknologi"
  | "Kecurangan"
  | "Reputasi";

export type TStatusRisiko = "Open" | "Closed";

export type TIdentifikasiRisikoStats = {
  totalRisiko: number;
  risikoAktif: number;
  risikoClosed: number;
  totalKategori: number;
};

export type TIdentifikasiRisikoData = {
  data: TIdentifikasiRisiko[];
};

export type TIdentifikasiRisikoDetailData = {
  data: TIdentifikasiRisiko;
  kategori_name: string;
  score: number;
  strategi: number;
};

export type TIdentifikasiRisikoResponse = TIdentifikasiRisiko[] & {
  error?: string;
};

export type TIdentifikasiRisikoStatsResponse = TIdentifikasiRisikoStats & {
  error?: string;
};

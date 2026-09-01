export type TAnalisisRisiko = {
  assessed_by: string;
  assessment_type: TTipeAnalisisRisiko;
  created_at: Date;
  created_by_uuid: string;
  id: string;
  impact: number;
  likelihood: number;
  nama_resiko: string;
  pemilik_risiko: string;
  risk_id: string;
  score: number;
  kategori_name: string;
  level_resiko: string;
  status: string;
  profile_id: string;
  is_in_profile: boolean;
};

export type TAnalisisResiduRisiko = {
  risk_id: string;
  nama_resiko: string;
  created_by_uuid: string;
  status: string;
  pemilik_risiko: string;
  kategori_name: string;
  strategi: string;
  prioritas: string;
  assessment_before_id: string;
  likelihood_before: number;
  impact_before: number;
  inherent_score: number;
  level_resiko_before: string;
  created_at_before: Date;
  assessment_after_id: string;
  likelihood_after: number;
  impact_after: number;
  score_after: number;
  created_at_after: Date;
  level_resiko_after: string;
  pernah_terjadi: boolean;
  total_kejadian: number;
  risiko_terlaporkan_tahun_ini: number;
};

export type TAnalisisRisikoStats = {
  totalIdentifikasi: number;
  totalAnalisis: number;
  high: number;
  medium: number;
  low: number;
};

export type TTipeAnalisisRisiko = {
  type: "INHERENT" | "RESIDUAL";
};

export type TAnalisisRisikoResponse = TAnalisisRisiko[] & {
  error?: string;
};

export type TAnalisisRisikoStatsResponse = TAnalisisRisikoStats & {
  error?: string;
};

export type TAnalisisResiduRisikoResponse = TAnalisisResiduRisiko[] & {
  error?: string;
};

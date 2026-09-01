export type TProfileRisiko = {
  profile_id: string;
  risk_analysis_id: string;
  risk_level: string;
  owner_id: string;
  pemilik_risiko: string;
  assigned_at: Date;
  risk_id: string;
  nama_resiko: string;
  deskripsi: string;
  treatment_status: string;
  skor_risiko: number;
  assessment_type: string;
  likelihood: number;
  impact: number;
  strategi: string;
  prioritas: string;
  kategori_name: string;
};

export type TProfileRisikoResponse = TProfileRisiko[] & {
  error?: string;
};

export type TKonteks = {
  id: string;
  politik_ekonomi: string;
  sosial_teknologi: string;
  hukum_regulasi: string;
  lingkungan: string;
  sasaran_strategis: string;
  kapabilitas_sumber_daya: string;
  struktur_budaya: string;
  ambang_dampak_rp: number;
  metode_evaluasi: string;
  selera_resiko: string;
  periode: string;
  unit_kerja: string;
  status: boolean;
  dibuat_oleh: string;
  dibuat_pada: Date;
  diperbarui_pada: Date;
};

export type TKontekData = {
  data: TKonteks[];
  total: number;
  page: number;
  limit: number;
};

export type TAddEditKonteks = {
  data: TKonteks;
  message: string;
};

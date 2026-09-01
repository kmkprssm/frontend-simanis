export type TMetrics = {
  totalRisks: number;
  profileRisks: number;
  highRisks: number;
  activeRisks: number;
  avgProgress: number;
  avgProfileProgress: number;
  avgEffectiveness: number;
  closedRisks: number;
  totalControls?: number;
  pendingActions?: number;
};

export type TCategoryColors = {
  Strategis: string;
  Operasional: string;
  Keuangan: string;
  Kepatuhan: string;
  Teknologi: string;
};

export type TCategories = {
  name: string;
  count: number;
  color: TCategoryColors;
};

export type TTopRisks = {
  id: string;
  nama_resiko: string;
  deskripsi: string;
  status: string;
  kategori: string;
  inherent_score: string;
};

export type TSummaryData = {
  metrics: TMetrics;
  categories: TCategories[];
  topRisks: TTopRisks[];
};

export type TRiskHeatmap = {
  likelihood: number;
  impact: number;
  total: number;
  risk_level: string;
  color_hex: string;
};

export type TRiskHeatmapData = {
  success: boolean;
  type: string;
  data: TRiskHeatmap[];
};

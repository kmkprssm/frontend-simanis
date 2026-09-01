import { TStatusRisiko } from "./identifikasi-risiko-type";

export type TEvaluasiRisiko = {
  created_at: Date;
  created_by_uuid: string;
  evaluated_by: string;
  evaluator_name: string;
  id: string;
  justifikasi: string;
  nama_resiko: string;
  prioritas: number;
  risk_id: string;
  rn: string;
  status_risiko: TStatusRisiko;
  strategi: string;
  is_active: boolean;
};

export type TEvaluasiRisikoStats = {
  totalEvaluated: number;
  pendingEvaluation: number;
  urgentCount: number;
  strategiCount: TStrategiEvaluasiCount;
  activeRisks: number;
};

export type TStrategiEvaluasiCount = {
  TREAT: number;
  TRANSFER: number;
  AVOID: number;
  ACCEPT: number;
};

export type TEvaluasiRisikoResponse = TEvaluasiRisiko[] & {
  error?: string;
};

export type TRiwayatEvaluasiRisikoResponse = TEvaluasiRisiko[] & {
  error?: string;
};

export type TEvaluasiRisikoStatsResponse = TEvaluasiRisikoStats & {
  error?: string;
};

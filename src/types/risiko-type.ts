export type TRisikoChoosed = {
  risk_id: string;
  nama_resiko: string;
  deskripsi: string;
  status: string;
  created_by_uuid: string;
  created_at: Date;
  kategori_name: string;
  created_by_name: string;
  sudah_evaluasi: boolean;
  strategi_evaluasi: string;
  prioritas_evaluasi: string;
};

export type FetchRisksChoosedResponse = {
  risiko: TRisikoChoosed[];
  meta: {
    page: number;
    limit: number;
    totalRows: number;
    hasMore: boolean;
    totalSudahEvaluasi: number;
    totalBelumEvaluasi: number;
    totalAktif: number;
    totalTidakAktif: number;
    totalSudahAnalisis: number;
    totalBelumAnalisis: number;
  };
};

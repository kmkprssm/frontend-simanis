export type TPengendalianRisikoStrategTreat = {
  created_by_uuid: string;
  deskripsi: string;
  nama_resiko: string;
  risk_id: string;
};

export type TPengendalianRisikoStrategTreatWithMeta = {
  data: TPengendalianRisikoStrategTreat[];
  meta: {
    page: number;
    limit: number;
    totalRows: number;
    hasMore: boolean;
  };
};

export type TPengendalianRisikoStats = {
  totalTreatData: number;
};

export type TPengendalianRisikoStrategTreatResponse =
  TPengendalianRisikoStrategTreatWithMeta & {
    error?: string;
  };

export type TPengendalianRisikoStatsResponse = TPengendalianRisikoStats & {
  error?: string;
};

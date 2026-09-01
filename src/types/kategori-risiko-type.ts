export type TKategoriRisiko = {
  id: number;
  name: string;
};

export type TKategoriRisikoResponse = TKategoriRisiko[] & { error?: string };

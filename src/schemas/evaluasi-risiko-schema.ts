import * as z from "zod";

export const EvaluasiRisikoSchema = z.object({
  risk_id: z.string(),
  strategi: z.string().min(1, "Strategi wajib diisi"),
  prioritas: z.string().min(1, "Prioritas wajib diisi"),
  justifikasi: z.string().min(1, "Justifikasi wajib diisi").trim(),
  evaluated_by: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type EvaluasiRisikoValues = z.infer<typeof EvaluasiRisikoSchema>;

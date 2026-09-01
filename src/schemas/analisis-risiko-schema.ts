import * as z from "zod";

export const AnalisisRisikoSchema = z.object({
  risk_id: z.string(),
  assessment_type: z.string().default("INHERENT").optional(),
  likelihood: z.string().min(1, "Skala kemungkinan harus dipilih"),
  impact: z.string().min(1, "Skala dampak harus dipilih"),
  score: z.string().min(1, "Skor harus terhitung"),
  assessed_by: z.string().optional(),
});

export const InsertAnalisisResiduRisikoSchema = z.object({
  risk_id: z.string(),
  likelihood: z.string().min(1, "Skala kemungkinan harus dipilih"),
  impact: z.string().min(1, "Skala dampak harus dipilih"),
  score: z.string().min(1, "Skor harus terhitung"),
});

export type AnalisisRisikoValues = z.infer<typeof AnalisisRisikoSchema>;
export type InsertAnalisisResiduRisikoValues = z.infer<
  typeof InsertAnalisisResiduRisikoSchema
>;

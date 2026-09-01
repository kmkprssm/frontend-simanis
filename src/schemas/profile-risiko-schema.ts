import * as z from "zod";

export const InsertProfileRisikoSchema = z.object({
  risk_analysis_id: z.string(),
  owner_id: z.string().optional(),
});

export type InsertProfileRisikoValues = z.infer<
  typeof InsertProfileRisikoSchema
>;

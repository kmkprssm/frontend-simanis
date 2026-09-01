import * as z from "zod";

export const CreatePengendalianRisikoSchema = z.object({
  risk_id: z.string(),
  nama_kontrol: z.string().min(1, "Nama kontrol wajib diisi").trim(),
  tipe: z.string().min(1, "Tipe kontrol wajib diisi"),
  deskripsi: z.string().min(1, "Deskripsi kontrol wajib diisi").trim(),
  created_by_uuid: z.string().optional(),
});

export const CreateTindakanRisikoSchema = z.object({
  kontrol_id: z.string().min(1, "Kontrol ID wajib dipilih/diisi"),
  action_plan: z.string().min(1, "Rencana tindakan wajib diisi").trim(),
  pic_name: z.string().min(1, "Nama PIC wajib diisi").trim(),

  target_date: z.date({
    error: "Target tanggal wajib diisi",
  }),

  status: z.enum(["Open", "On Progress", "Closed"]),
  created_by_uuid: z.string().optional(),
});

export const CompleteTindakanRisikoSchema = CreateTindakanRisikoSchema.extend({
  status: z.literal("Closed"),

  realisasi_date: z.date({
    error: "Target realisasi wajib diisi",
  }),

  bukti_mitigasi: z
    .string()
    .min(1, "Bukti mitigasi wajib diisi")
    .url(
      "Bukti mitigasi harus berupa tautan/URL yang valid (contoh: https://...)",
    ),
});

export type CreatePengendalianRisikoValues = z.infer<
  typeof CreatePengendalianRisikoSchema
>;
export type CreateTindakanValues = z.infer<typeof CreateTindakanRisikoSchema>;
export type CompleteTindakanValues = z.infer<
  typeof CompleteTindakanRisikoSchema
>;

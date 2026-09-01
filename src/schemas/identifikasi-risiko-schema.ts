import * as z from "zod";

export const InsertIdentifikasiRisikoSchema = z.object({
  nama_resiko: z.string().min(1, "Resiko wajib diisi").trim(),
  kategori_id: z.string().min(1, "Kategori wajib dipilih").trim(),
  deskripsi: z.string().min(1, "Deskripsi resiko wajib diisi").trim(),
  root_cause: z.string().min(1, "Penyebab wajib diisi").trim(),
  consequences: z.string().min(1, "Dampak wajib diisi").trim(),
  existing_controls: z
    .string()
    .min(1, "Pengendalian yang sudah ada wajib diisi")
    .trim(),
  created_by_uuid: z.string().optional(),
});

export type InsertIdentifikasiRisikoValues = z.infer<
  typeof InsertIdentifikasiRisikoSchema
>;

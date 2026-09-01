import * as z from "zod";

export const KonteksSchema = z.object({
  unit_kerja: z.string().min(1, "Unit kerja wajib diisi").trim(),
  periode: z.string().min(1, "Periode wajib diisi").trim(),
  sasaran_strategis: z.string().min(1, "Sasaran strategis wajib diisi").trim(),
  politik_ekonomi: z.string().min(1, "Politik ekonomi wajib diisi").trim(),
  sosial_teknologi: z.string().min(1, "Sosial teknologi wajib diisi").trim(),
  hukum_regulasi: z.string().min(1, "Hukum regulasi wajib diisi").trim(),
  lingkungan: z.string().min(1, "Lingkungan wajib diisi").trim(),
  kapabilitas_sumber_daya: z
    .string()
    .min(1, "Kapabilitas sumber data wajib diisi")
    .trim(),
  struktur_budaya: z.string().min(1, "Struktur budaya wajib diisi").trim(),
  metode_evaluasi: z.string().min(1, "Metode evaluasi wajib diisi").trim(),
  selera_resiko: z.string().min(1, "Selera resiko wajib diisi").trim(),
  ambang_dampak_rp: z.string().min(1).trim(),
  dibuat_oleh: z.string().optional(),
});

export type KonteksValues = z.infer<typeof KonteksSchema>;

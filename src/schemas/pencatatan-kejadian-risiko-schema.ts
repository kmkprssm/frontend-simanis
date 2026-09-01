// import * as z from "zod";

// export const KejadianRisikoDetailSchema = z.object({
//   risk_id: z.string().min(1, "Risiko wajib dipilih"),
//   tanggal_kejadian: z.date({ error: "Tanggal kejadian wajib diisi" }),

//   sebab_saat_ini: z.string().min(1, "Penyebab wajib diisi").trim(),
//   dampak_riil: z.string().min(1, "Dampak nyata wajib diisi").trim(),
//   tindakan_lanjutan: z.string().min(1, "Tindakan lanjutan wajib diisi").trim(),
// });

// export const CreateKejadianRisikoSchema = z
//   .object({
//     tahun: z.number().int().min(2000, "Tahun tidak valid"),
//     bulan: z.number().int().min(1).max(12, "Bulan harus antara 1-12"),
//     status_laporan: z.enum(["NIHIL", "TERJADI_RISIKO"], {
//       error: "Status laporan wajib dipilih",
//     }),
//     detail_kejadian: KejadianRisikoDetailSchema.optional(),
//   })
//   .refine(
//     (data) => {
//       if (data.status_laporan === "TERJADI_RISIKO" && !data.detail_kejadian) {
//         return false;
//       }
//       return true;
//     },
//     {
//       message:
//         "Detail kejadian wajib dilengkapi jika status laporan Terjadi Risiko",
//       path: ["detail_kejadian"],
//     },
//   );

// export type CreateKejadianRisikoValues = z.infer<
//   typeof CreateKejadianRisikoSchema
// >;

import * as z from "zod";

export const KejadianRisikoDetailSchema = z.object({
  risk_id: z.string().min(1, "Risiko wajib dipilih"),
  tanggal_kejadian: z.date({ error: "Tanggal kejadian wajib diisi" }),
  sebab_saat_ini: z.string().min(1, "Penyebab wajib diisi").trim(),
  dampak_riil: z.string().min(1, "Dampak nyata wajib diisi").trim(),
  tindakan_lanjutan: z.string().min(1, "Tindakan lanjutan wajib diisi").trim(),
});

export const DetailNihilItemSchema = z.object({
  risk_id: z.string().min(1),
  keterangan_nihil: z
    .string()
    .min(1, "Harap berikan alasan evaluasi mengapa nihil")
    .trim(),
});

export const CreateKejadianRisikoSchema = z
  .object({
    tahun: z.number().int().min(2000),
    bulan: z.number().int().min(1).max(12),
    status_laporan: z.enum(["NIHIL", "TERJADI_RISIKO"]),
    list_detail_nihil: DetailNihilItemSchema.optional(),
    detail_kejadian: KejadianRisikoDetailSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.status_laporan === "TERJADI_RISIKO" && !data.detail_kejadian)
        return false;
      if (data.status_laporan === "NIHIL" && !data.list_detail_nihil)
        return false;
      return true;
    },
    {
      message: "Kelengkapan data formulir wajib dipenuhi",
      path: ["status_laporan"],
    },
  );

export type CreateKejadianRisikoValues = z.infer<
  typeof CreateKejadianRisikoSchema
>;

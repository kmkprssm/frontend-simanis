import * as z from "zod";

export const CloseRisikoSchema = z.object({
  close_reason: z
    .string()
    .min(1, "Alasan penutupan risiko wajib diisi")
    .min(10, "Alasan penutupan terlalu pendek, minimal gunakan 10 karakter")
    .trim(),
});

export type CloseRisikoValues = z.infer<typeof CloseRisikoSchema>;

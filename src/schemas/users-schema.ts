import * as z from "zod";

export const RegisterUserSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .trim()
    .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),

  email: z
    .string()
    .min(1, "Email wajib diisi")
    .trim()
    .email("Format email tidak valid"),

  role: z.enum(["ADMIN", "USER", "GUEST"], {
    error: "Role wajib dipilih",
  }),

  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal harus 8 karakter")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password harus mengandung minimal 1 huruf besar (A-Z)",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password harus mengandung minimal 1 huruf kecil (a-z)",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password harus mengandung minimal 1 angka (0-9)",
    })
    .refine((val) => /[@$!%\*?&]/.test(val), {
      message: "Password harus mengandung minimal 1 karakter khusus (@$!%*?&)",
    }),
});

export type RegisterUserValues = z.infer<typeof RegisterUserSchema>;

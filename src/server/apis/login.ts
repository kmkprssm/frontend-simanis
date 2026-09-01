"use server";

import { AuthError } from "next-auth";
import { LoginSchema, LoginValues } from "@/schemas/auth-schema";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/auth.routes";
import { verifyMathCaptcha } from "@/lib/captcha-crypto"; // Import verifikator

export const login = async (
  values: LoginValues,
  callbackUrl?: string | null,
  captchaAnswer?: string, // Tambahan parameter jawaban
  captchaToken?: string, // Tambahan parameter token kunci
) => {
  // 1. Validasi awal input captcha
  if (!captchaAnswer || !captchaToken) {
    return { error: "Selesaikan tantangan captcha terlebih dahulu!" };
  }

  // 2. Verifikasi matematika lokal secara kriptografi
  const isCaptchaValid = verifyMathCaptcha(captchaAnswer, captchaToken);
  if (!isCaptchaValid) {
    return { error: "Jawaban matematika salah atau captcha kedaluwarsa!" };
  }

  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Data login tidak valid" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Login berhasil" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        default:
          return { error: "Email atau password salah!" };
      }
    }

    throw error;
  }
};

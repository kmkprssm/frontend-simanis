"use server";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import { TKategoriRisikoResponse } from "@/types/kategori-risiko-type";

const KATEGORI_RISIKO_API_URL = `${CONST.API_BASE_URL}/kategori-resiko`;

export const getKategoriRisiko = async (): Promise<TKategoriRisikoResponse> => {
  const fallbackData: TKategoriRisikoResponse = [];

  try {
    const user = await currentUser();
    if (!user) {
      fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
      return fallbackData;
    }

    const response = await fetch(KATEGORI_RISIKO_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      fallbackData.error =
        errorData.message || `Server error: ${response.status}`;
      return fallbackData;
    }

    const result = (await response.json()) as TKategoriRisikoResponse;
    return result || [];
  } catch (error: any) {
    fallbackData.error = error.message || "Gagal terhubung ke server.";
    return fallbackData;
  }
};

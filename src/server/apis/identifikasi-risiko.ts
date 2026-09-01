"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import { InsertIdentifikasiRisikoValues } from "@/schemas/identifikasi-risiko-schema";
import {
  TIdentifikasiRisikoResponse,
  TIdentifikasiRisikoStatsResponse,
} from "@/types/identifikasi-risiko-type";

const IDENTIFIKASI_RiSIKO_API_URL = `${CONST.API_BASE_URL}/identifikasi`;

export const getIdentifikasiRisiko =
  async (): Promise<TIdentifikasiRisikoResponse> => {
    const fallbackData: TIdentifikasiRisikoResponse = [];

    try {
      const user = await currentUser();
      if (!user) {
        fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
        return fallbackData;
      }

      const response = await fetch(IDENTIFIKASI_RiSIKO_API_URL, {
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

      const result = (await response.json()) as TIdentifikasiRisikoResponse;
      return result || [];
    } catch (error: any) {
      fallbackData.error = error.message || "Gagal terhubung ke server.";
      return fallbackData;
    }
  };

export const getIdentifikasiRisikoStats =
  async (): Promise<TIdentifikasiRisikoStatsResponse> => {
    const fallbackData: TIdentifikasiRisikoStatsResponse = {
      totalRisiko: 0,
      risikoAktif: 0,
      risikoClosed: 0,
      totalKategori: 0,
    };

    try {
      const user = await currentUser();
      if (!user) {
        fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
        return fallbackData;
      }

      const response = await fetch(
        `${IDENTIFIKASI_RiSIKO_API_URL}/stats/risiko`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        fallbackData.error =
          errorData.message || `Server error: ${response.status}`;
        return fallbackData;
      }

      const result =
        (await response.json()) as TIdentifikasiRisikoStatsResponse;
      return result || [];
    } catch (error: any) {
      fallbackData.error = error.message || "Gagal terhubung ke server.";
      return fallbackData;
    }
  };

export const createUpdateIdentifikasiRisiko = async (
  id: string | undefined,
  json: InsertIdentifikasiRisikoValues,
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const isEditMode = !!id && id.trim() !== "";

  const method = isEditMode ? "PUT" : "POST";
  const apiTargetUrl = isEditMode
    ? `${IDENTIFIKASI_RiSIKO_API_URL}/${id}`
    : IDENTIFIKASI_RiSIKO_API_URL;

  try {
    const payload = {
      ...json,
      created_by_uuid: isEditMode ? json.created_by_uuid || user.id : user.id,
    };

    const response = await fetch(apiTargetUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/identifikasi-risiko", "page");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Gagal melakukan ${isEditMode ? "pembaruan" : "penambahan"} data.`,
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Error pada createUpdateIdentifikasiResko:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

export const deleteIdentifikasiRisiko = async (id: string | undefined) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const response = await fetch(`${IDENTIFIKASI_RiSIKO_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    revalidatePath("/identifikasi-risiko", "page");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message,
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Error pada deleteIdentifikasiResko:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

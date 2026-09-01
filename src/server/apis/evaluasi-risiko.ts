"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import {
  TEvaluasiRisikoResponse,
  TEvaluasiRisikoStatsResponse,
  TRiwayatEvaluasiRisikoResponse,
} from "@/types/evaluasi-risiko-type";
import { EvaluasiRisikoValues } from "@/schemas/evaluasi-risiko-schema";

const EVALUASI_RISIKO_API_URL = `${CONST.API_BASE_URL}/evaluasi`;
const RIWAYAT_EVALUASI_RISIKO_API_URL = `${CONST.API_BASE_URL}/evaluasi/riwayat`;

export const getEvaluasiRisiko = async (): Promise<TEvaluasiRisikoResponse> => {
  const fallbackData: TEvaluasiRisikoResponse = [];

  try {
    const user = await currentUser();
    if (!user) {
      fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
      return fallbackData;
    }

    const response = await fetch(EVALUASI_RISIKO_API_URL, {
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

    const result = (await response.json()) as TEvaluasiRisikoResponse;
    return result || [];
  } catch (error: any) {
    fallbackData.error = error.message || "Gagal terhubung ke server.";
    return fallbackData;
  }
};

export const createUpdateEvaluasiRisiko = async (
  id: string | undefined,
  json: EvaluasiRisikoValues,
) => {
  const user = await currentUser();

  if (!user) return { success: false, message: "Unauthorized! Sesi berakhir." };

  const isEditMode = !!id && id.trim() !== "";
  const method = isEditMode ? "PUT" : "POST";
  const apiTargetUrl = isEditMode
    ? `${EVALUASI_RISIKO_API_URL}/${id}`
    : EVALUASI_RISIKO_API_URL;

  try {
    const payload = {
      risk_id: json.risk_id,
      strategi: json.strategi,
      prioritas: json.prioritas,
      justifikasi: json.justifikasi || null,
      is_active: json.is_active !== undefined ? json.is_active : true,
    };

    const response = await fetch(apiTargetUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/evaluasi-risiko", "page");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Gagal melakukan ${isEditMode ? "pembaruan" : "penambahan"} data evaluasi.`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error pada createUpdateEvaluasiRisiko:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

export const getEvaluasiRisikoByRiskId = async (
  id: string | undefined,
): Promise<TRiwayatEvaluasiRisikoResponse> => {
  const fallbackData: TRiwayatEvaluasiRisikoResponse = [];

  try {
    const user = await currentUser();
    if (!user) {
      fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
      return fallbackData;
    }

    const response = await fetch(`${RIWAYAT_EVALUASI_RISIKO_API_URL}/${id}`, {
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

    const result = (await response.json()) as TRiwayatEvaluasiRisikoResponse;
    return result || [];
  } catch (error: any) {
    fallbackData.error = error.message || "Gagal terhubung ke server.";
    return fallbackData;
  }
};

export const getEvaluasiRisikoStats =
  async (): Promise<TEvaluasiRisikoStatsResponse> => {
    const fallbackData: TEvaluasiRisikoStatsResponse = {
      activeRisks: 0,
      pendingEvaluation: 0,
      totalEvaluated: 0,
      urgentCount: 0,
      strategiCount: {
        ACCEPT: 0,
        AVOID: 0,
        TRANSFER: 0,
        TREAT: 0,
      },
    };

    try {
      const user = await currentUser();
      if (!user) {
        fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
        return fallbackData;
      }

      const response = await fetch(`${EVALUASI_RISIKO_API_URL}/stats`, {
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

      const result = (await response.json()) as TEvaluasiRisikoStatsResponse;
      return result || [];
    } catch (error: any) {
      fallbackData.error = error.message || "Gagal terhubung ke server.";
      return fallbackData;
    }
  };

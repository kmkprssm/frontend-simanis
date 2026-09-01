"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import {
  TAnalisisResiduRisikoResponse,
  TAnalisisRisikoResponse,
  TAnalisisRisikoStatsResponse,
} from "@/types/analisis-risiko-type";
import {
  AnalisisRisikoValues,
  InsertAnalisisResiduRisikoValues,
} from "@/schemas/analisis-risiko-schema";

const ANALISIS_RISIKO_API_URL = `${CONST.API_BASE_URL}/penilaian`;

export const getAnalisisRisiko = async (): Promise<TAnalisisRisikoResponse> => {
  const fallbackData: TAnalisisRisikoResponse = [];

  try {
    const user = await currentUser();
    if (!user) {
      fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
      return fallbackData;
    }

    const response = await fetch(ANALISIS_RISIKO_API_URL, {
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

    const result = (await response.json()) as TAnalisisRisikoResponse;
    return result || [];
  } catch (error: any) {
    fallbackData.error = error.message || "Gagal terhubung ke server.";
    return fallbackData;
  }
};

export const getAnalisisRisikoStats =
  async (): Promise<TAnalisisRisikoStatsResponse> => {
    const fallbackData: TAnalisisRisikoStatsResponse = {
      totalAnalisis: 0,
      totalIdentifikasi: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    try {
      const user = await currentUser();
      if (!user) {
        fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
        return fallbackData;
      }

      const response = await fetch(`${ANALISIS_RISIKO_API_URL}/stats`, {
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

      const result = (await response.json()) as TAnalisisRisikoStatsResponse;
      return result || [];
    } catch (error: any) {
      fallbackData.error = error.message || "Gagal terhubung ke server.";
      return fallbackData;
    }
  };

export const getAnalisisResiduRisiko =
  async (): Promise<TAnalisisResiduRisikoResponse> => {
    const fallbackData: TAnalisisResiduRisikoResponse = [];

    try {
      const user = await currentUser();
      if (!user) {
        fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
        return fallbackData;
      }

      const response = await fetch(`${ANALISIS_RISIKO_API_URL}/residu`, {
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

      const result = (await response.json()) as TAnalisisResiduRisikoResponse;
      return result || [];
    } catch (error: any) {
      fallbackData.error = error.message || "Gagal terhubung ke server.";
      return fallbackData;
    }
  };

export const createUpdateAnalisisRisiko = async (
  id: string | undefined,
  json: AnalisisRisikoValues,
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const isEditMode = !!id && id.trim() !== "";

  const method = isEditMode ? "PUT" : "POST";
  const apiTargetUrl = isEditMode
    ? `${ANALISIS_RISIKO_API_URL}/${id}`
    : ANALISIS_RISIKO_API_URL;

  try {
    const likelihoodNum = Number(json.likelihood);
    const impactNum = Number(json.impact);

    const payload = {
      risk_id: json.risk_id,
      assessment_type: "INHERENT",
      likelihood: likelihoodNum,
      impact: impactNum,
      score: likelihoodNum * impactNum,
      assessed_by: isEditMode ? json.assessed_by || user.id : user.id,
    };

    const response = await fetch(apiTargetUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/analisis-risiko", "page");

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

export const createUpdateAnalisisResiduRisiko = async (
  json: InsertAnalisisResiduRisikoValues,
) => {
  const user = await currentUser();
  if (!user)
    return {
      success: false,
      message: "Sesi kedaluwarsa, silakan login kembali.",
    };

  try {
    const payload = {
      risk_id: json.risk_id,
      likelihood: Number(json.likelihood),
      impact: Number(json.impact),
    };

    const response = await fetch(`${ANALISIS_RISIKO_API_URL}/residu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Gagal menyimpan analisis residu risiko.",
      };
    }

    revalidatePath("/analisis-residu-risiko", "page");
    const resultData = await response.json();

    return {
      success: true,
      message: resultData.message,
      data: resultData.data,
    };
  } catch (error) {
    console.error("Error pada saveAnalisisResiduApi:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

export const deleteAnalisisRisiko = async (id: string | undefined) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const response = await fetch(`${ANALISIS_RISIKO_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    revalidatePath("/analisis-risiko", "page");

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
    console.error("Error pada deleteAnalisisRisiko:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

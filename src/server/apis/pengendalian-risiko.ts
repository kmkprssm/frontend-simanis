"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import {
  TPengendalianRisikoStatsResponse,
  TPengendalianRisikoStrategTreatResponse,
} from "@/types/pengendalian-risiko-type";
import { CloseRisikoValues } from "@/schemas/pengendalian-risiko-schema";

const PENGENDALIAN_RISIKO_API_URL = `${CONST.API_BASE_URL}/celah-pengendalian`;
const RISK_API_URL = `${CONST.API_BASE_URL}/risks`;

export const getPengendalianRisikoStrategiTreat =
  async (): Promise<TPengendalianRisikoStrategTreatResponse> => {
    try {
      const user = await currentUser();
      if (!user) throw new Error("Unauthorized! Sesi berakhir.");

      const response = await fetch(`${PENGENDALIAN_RISIKO_API_URL}/risiko`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`,
        );
      }

      const result =
        (await response.json()) as TPengendalianRisikoStrategTreatResponse;
      return result || [];
    } catch (error: any) {
      console.error("❌ API getChoosedRisks Error:", error);
      throw new Error(error.message || "Gagal terhubung ke server.");
    }
  };

export const getPengendalianRisikoStats =
  async (): Promise<TPengendalianRisikoStatsResponse> => {
    const fallbackData: TPengendalianRisikoStatsResponse = {
      totalTreatData: 0,
    };

    try {
      const user = await currentUser();
      if (!user) {
        fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
        return fallbackData;
      }

      const response = await fetch(
        `${PENGENDALIAN_RISIKO_API_URL}/risiko/stats`,
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
        (await response.json()) as TPengendalianRisikoStatsResponse;
      return result || [];
    } catch (error: any) {
      fallbackData.error = error.message || "Gagal terhubung ke server.";
      return fallbackData;
    }
  };

export const executeCloseRisk = async (
  riskId: string | undefined,
  json: CloseRisikoValues,
) => {
  const user = await currentUser();
  if (!user)
    return {
      success: false,
      message: "Sesi Anda habis, silakan login kembali.",
    };
  if (!riskId) return { success: false, message: "ID Risiko tidak valid." };

  try {
    const response = await fetch(`${RISK_API_URL}/${riskId}/close`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(json),
    });

    revalidatePath("/pengendalian-risiko", "page");

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Gagal menutup risiko.",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("❌ Error pada executeCloseRisk:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

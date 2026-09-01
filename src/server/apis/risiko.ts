"use server";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import {
  TDetailPemantauanRisiko,
  TPemantauanRisikoWithMeta,
} from "@/types/pemantauan-risiko-type";
import { FetchRisksChoosedResponse } from "@/types/risiko-type";

const RISIKO_API_URL = `${CONST.API_BASE_URL}/risks`;

export const getChoosedRisks = async (
  type: "all" | "active" | "closed",
  pageParam: number,
  limit: number,
  search: string,
  strategi?: string,
  mode?: string,
  bulan?: number,
  tahun?: number,
): Promise<FetchRisksChoosedResponse> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized! Sesi berakhir.");

    const queryParams = new URLSearchParams({
      type,
      page: String(pageParam),
      limit: String(limit),
      search: search,
    });

    if (strategi) {
      queryParams.append("strategi", strategi);
    }

    if (mode) queryParams.append("mode", mode);

    if (bulan) queryParams.append("bulan", String(bulan));
    if (tahun) queryParams.append("tahun", String(tahun));

    const response = await fetch(
      `${RISIKO_API_URL}/choosed?${queryParams.toString()}`,
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
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ API getChoosedRisks Error:", error);
    throw new Error(error.message || "Gagal terhubung ke server.");
  }
};

export const getMonitoringRisiko = async (
  type: "active" | "closed",
  pageParam: number,
  limit: number,
  search: string,
): Promise<TPemantauanRisikoWithMeta> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized! Sesi berakhir.");

    const queryParams = new URLSearchParams({
      type,
      page: String(pageParam),
      limit: String(limit),
      search: search,
    });

    const response = await fetch(
      `${RISIKO_API_URL}/monitoring?${queryParams.toString()}`,
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
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ API getChoosedRisks Error:", error);
    throw new Error(error.message || "Gagal terhubung ke server.");
  }
};

export const getDetailMonitoringRisiko = async (
  id: string | undefined,
): Promise<TDetailPemantauanRisiko> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized! Sesi berakhir.");

    const response = await fetch(`${RISIKO_API_URL}/monitoring/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ API getChoosedRisks Error:", error);
    throw new Error(error.message || "Gagal terhubung ke server.");
  }
};

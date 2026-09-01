"use server";

import qs from "query-string";
import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import {
  TRisikoAktifMitigasiResponse,
  TStatsRisikoWithMitigasiResponse,
} from "@/types/perlakuan-risiko-type";
import {
  CompleteTindakanValues,
  CreatePengendalianRisikoValues,
  CreateTindakanValues,
} from "@/schemas/perlakuan-risiko-schema";
import { dateFormatFns } from "@/lib/utils";

const IDENTIFIKASI_RESIKO_API_URL = `${CONST.API_BASE_URL}/identifikasi`;
const PENGENDALIAN_RISIKO_API_URL = `${CONST.API_BASE_URL}/kontrol`;
const TINDAKAN_RISIKO_API_URL = `${CONST.API_BASE_URL}/action`;

export const getPerlakuanRisiko = async (
  status: string,
): Promise<TRisikoAktifMitigasiResponse> => {
  const fallbackData: TRisikoAktifMitigasiResponse = [];

  try {
    const user = await currentUser();
    if (!user) {
      fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
      return fallbackData;
    }

    const url = qs.stringifyUrl({
      url: `${IDENTIFIKASI_RESIKO_API_URL}/active/mitigasi`,
      query: {
        status,
      },
    });

    const response = await fetch(url, {
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

    const result = (await response.json()) as TRisikoAktifMitigasiResponse;
    return result || [];
  } catch (error: any) {
    fallbackData.error = error.message || "Gagal terhubung ke server.";
    return fallbackData;
  }
};

export const getStatsRisikoWithMitigasi =
  async (): Promise<TStatsRisikoWithMitigasiResponse> => {
    const fallbackData: TStatsRisikoWithMitigasiResponse = {
      activeRisks: 0,
      closedRisks: 0,
      totalAction: 0,
      totalKontrol: 0,
      doneActions: 0,
      overdueActions: 0,
      totalRisks: 0,
    };

    try {
      const user = await currentUser();
      if (!user) {
        fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
        return fallbackData;
      }

      const response = await fetch(
        `${IDENTIFIKASI_RESIKO_API_URL}/stats/mitigasi`,
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
        (await response.json()) as TStatsRisikoWithMitigasiResponse;
      return result || [];
    } catch (error: any) {
      fallbackData.error = error.message || "Gagal terhubung ke server.";
      return fallbackData;
    }
  };

export const createUpdatePengendalianRisiko = async (
  id: string | undefined,
  json: CreatePengendalianRisikoValues,
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const isEditMode = !!id && id.trim() !== "";

  const method = isEditMode ? "PUT" : "POST";
  const apiTargetUrl = isEditMode
    ? `${PENGENDALIAN_RISIKO_API_URL}/${id}`
    : PENGENDALIAN_RISIKO_API_URL;

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

    revalidatePath("/perlakuan-resiko", "page");

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

export const deletePengendalianRisiko = async (id: string | undefined) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const response = await fetch(`${PENGENDALIAN_RISIKO_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    revalidatePath("/perlakuan-resiko", "page");

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

export const createUpdateTindakanRisiko = async (
  id: string | undefined,
  json: CreateTindakanValues,
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const isEditMode = !!id && id.trim() !== "";

  const method = isEditMode ? "PUT" : "POST";
  const apiTargetUrl = isEditMode
    ? `${TINDAKAN_RISIKO_API_URL}/${id}`
    : TINDAKAN_RISIKO_API_URL;

  try {
    const payload = {
      ...json,
      target_date: json.target_date ? dateFormatFns(json.target_date) : null,
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

    revalidatePath("/perlakuan-resiko", "page");

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

export const updateStatusTindakanRisiko = async (id: string | undefined) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const payload = {
      status: "On Progress",
    };

    const response = await fetch(`${TINDAKAN_RISIKO_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/perlakuan-resiko", "page");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Gagal melakukan pembaruan data.`,
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Error pada createUpdateIdentifikasiResko:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

export const completeTindakanRisiko = async (
  id: string | undefined,
  json: CompleteTindakanValues,
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const payload = {
      ...json,
      realisasi_date: json.realisasi_date
        ? dateFormatFns(json.realisasi_date)
        : null,
      status: "Closed",
    };

    const response = await fetch(`${TINDAKAN_RISIKO_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/perlakuan-risiko", "page");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Gagal melakukan penyelesaian tindakan.`,
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Error pada createUpdateIdentifikasiResko:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

export const deleteTindakanResiko = async (id: string | undefined) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const response = await fetch(`${TINDAKAN_RISIKO_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    revalidatePath("/perlakuan-resiko", "page");

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

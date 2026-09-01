"use server";

import qs from "query-string";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import {
  FetchRisksResponse,
  TGetKejadianRisikoResponse,
} from "@/types/pencatatan-kejadian-risiko-type";
import { CreateKejadianRisikoValues } from "@/schemas/pencatatan-kejadian-risiko-schema";
import { dateFormatFns } from "@/lib/utils";
import { TDetailKejadianRisiko } from "@/types/pemantauan-risiko-type";

const KEJADIAN_RISIKO_API_URL = `${CONST.API_BASE_URL}/kejadian-risiko`;

export const getKejadianRisiko = async (
  tahun: number,
): Promise<TGetKejadianRisikoResponse> => {
  const fallbackData: TGetKejadianRisikoResponse =
    {} as TGetKejadianRisikoResponse;

  try {
    const user = await currentUser();

    if (!user) {
      fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
      return fallbackData;
    }

    const url = qs.stringifyUrl({
      url: KEJADIAN_RISIKO_API_URL,
      query: { tahun },
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

    return (await response.json()) as TGetKejadianRisikoResponse;
  } catch (error: any) {
    fallbackData.error = error.message || "Gagal terhubung ke server.";
    return fallbackData;
  }
};

export const getKejadianRisikoByRiskId = async (
  risk_id: string | undefined,
  tahun: number,
): Promise<TDetailKejadianRisiko> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized! Sesi berakhir.");

    const url = qs.stringifyUrl({
      url: `${KEJADIAN_RISIKO_API_URL}/${risk_id}`,
      query: { tahun },
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
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ API getChoosedRisks Error:", error);
    throw new Error(error.message || "Gagal terhubung ke server.");
  }
};

export const getChoosenRisiko = async (
  pageParam: number | unknown,
  limit: number,
  search: string,
): Promise<FetchRisksResponse> => {
  try {
    const user = await currentUser();

    const queryParams = new URLSearchParams({
      page: String(pageParam),
      limit: String(limit),
      search: search,
    });

    const response = await fetch(
      `${CONST.API_BASE_URL}/celah-pengendalian/risiko?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil daftar opsi risiko dari server");
    }

    return await response.json();
  } catch (error: any) {
    return error.message || "Gagal terhubung ke server.";
  }
};

// export const createUpdateKejadianRisiko = async (
//   id: string | undefined,
//   json: CreateKejadianRisikoValues,
// ) => {
//   const user = await currentUser();
//   if (!user) return { success: false, message: "Unauthorized!" };

//   const isEditMode = !!id && id.trim() !== "";
//   const method = isEditMode ? "PUT" : "POST";
//   const apiTargetUrl = isEditMode
//     ? `${KEJADIAN_RISIKO_API_URL}/update/${id}`
//     : `${KEJADIAN_RISIKO_API_URL}/add`;

//   try {
//     const payload = {
//       ...json,
//       detail_kejadian: {
//         ...json.detail_kejadian,
//         tanggal_kejadian: json.detail_kejadian?.tanggal_kejadian
//           ? dateFormatFns(json.detail_kejadian?.tanggal_kejadian)
//           : null,
//       },
//     };

//     const response = await fetch(apiTargetUrl, {
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${user?.token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     revalidatePath("/pencatatan-kejadian", "page");

//     const resData = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         message: resData.message || `Gagal memproses data di server.`,
//       };
//     }

//     return { success: true, data: resData };
//   } catch (error: any) {
//     console.error("❌ Error pada createUpdateKejadianRisiko:", error);
//     return {
//       success: false,
//       message: error.message || "Terjadi kesalahan koneksi ke server.",
//     };
//   }
// };

export const createUpdateKejadianRisiko = async (
  id: string | undefined,
  json: CreateKejadianRisikoValues,
) => {
  const user = await currentUser();
  if (!user) return { success: false, message: "Unauthorized!" };

  const isEditMode = !!id && id.trim() !== "";
  const method = isEditMode ? "PUT" : "POST";
  const apiTargetUrl = isEditMode
    ? `${KEJADIAN_RISIKO_API_URL}/update/${id}`
    : `${KEJADIAN_RISIKO_API_URL}/add`;

  try {
    const payload = {
      ...json,
      detail_kejadian: json.detail_kejadian?.tanggal_kejadian
        ? {
            ...json.detail_kejadian,
            tanggal_kejadian: dateFormatFns(
              json.detail_kejadian.tanggal_kejadian,
            ),
          }
        : undefined,
    };

    const response = await fetch(apiTargetUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    revalidatePath("/pencatatan-kejadian", "page");
    const resData = await response.json();
    if (!response.ok)
      return {
        success: false,
        message: resData.message || "Gagal memproses data.",
      };

    return { success: true, data: resData };
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan." };
  }
};

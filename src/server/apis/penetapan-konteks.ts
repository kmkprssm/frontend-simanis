"use server";

import qs from "query-string";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import { TKontekData } from "@/types/konteks-type";
import { KonteksValues } from "@/schemas/konteks-schema";
import { revalidatePath } from "next/cache";

const KONTEKS_API_URL = `${CONST.API_BASE_URL}/konteks`;

export const getKonteks = async (page: number, limit: number) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const url = qs.stringifyUrl({
    url: KONTEKS_API_URL,
    query: {
      page,
      limit,
    },
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  });

  const result = (await response.json()) as TKontekData;

  if (!result) {
    return null;
  }

  return {
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};

export const createUpdateKonteks = async (
  id: string | undefined,
  json: KonteksValues,
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const isEditMode = !!id && id.trim() !== "";

  const method = isEditMode ? "PUT" : "POST";
  const apiTargetUrl = isEditMode
    ? `${KONTEKS_API_URL}/${id}`
    : KONTEKS_API_URL;

  try {
    const payload = {
      ...json,
      dibuat_oleh: isEditMode ? json.dibuat_oleh || user.id : user.id,
    };

    const response = await fetch(apiTargetUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    });

    // Jalankan revalidate agar data di halaman /konteks langsung ter-refresh otomatis
    revalidatePath("/konteks", "page");

    // Jika response API backend tidak ok (misal 400 atau 500)
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
    console.error("Error pada createUpdateKonteks:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

export const deleteKonteks = async (id: string | undefined) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const response = await fetch(`${KONTEKS_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    revalidatePath("/konteks", "page");

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
    console.error("Error pada createUpdateKonteks:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

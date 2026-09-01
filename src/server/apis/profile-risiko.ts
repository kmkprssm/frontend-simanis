"use server";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import { InsertProfileRisikoValues } from "@/schemas/profile-risiko-schema";
import { TProfileRisikoResponse } from "@/types/profile-risiko-type";
import { revalidatePath } from "next/cache";

const PROFILE_RISIKO_API_URL = `${CONST.API_BASE_URL}/profile-risiko`;

export const getProfileRisiko = async (): Promise<TProfileRisikoResponse> => {
  const fallbackData: TProfileRisikoResponse = [];

  try {
    const user = await currentUser();
    if (!user) {
      fallbackData.error = "Unauthorized! Sesi Anda telah berakhir.";
      return fallbackData;
    }

    const response = await fetch(PROFILE_RISIKO_API_URL, {
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

    const result = (await response.json()) as TProfileRisikoResponse;
    return result || [];
  } catch (error: any) {
    fallbackData.error = error.message || "Gagal terhubung ke server.";
    return fallbackData;
  }
};

export const addToProfileRisiko = async (json: InsertProfileRisikoValues) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const payload = {
      ...json,
      owner_id: user.id,
    };

    const response = await fetch(`${PROFILE_RISIKO_API_URL}/add`, {
      method: "POST",
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
        message: errorData.message || `Gagal melakukan penambahan} data.`,
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Error pada createUpdateIdentifikasiResko:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
};

export const deleteProfileResiko = async (id: string | undefined) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  try {
    const response = await fetch(`${PROFILE_RISIKO_API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    revalidatePath("/dashboard", "page");
    revalidatePath("/penilaian-resiko", "page");

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

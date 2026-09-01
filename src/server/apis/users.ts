"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import { RegisterUserSchema, RegisterUserValues } from "@/schemas/users-schema";
import {
  TFetchUsersResponse,
  TUsersResponseWithoutMeta,
} from "@/types/user-type";

const USERS_API_URL = `${CONST.API_BASE_URL}/users`;
const AUTH_API_URL = `${CONST.API_BASE_URL}/auth`;

export const getUsersForFilter = async (
  pageParam: number,
  limit: number,
  search: string,
): Promise<TFetchUsersResponse> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized! Sesi berakhir.");

    const queryParams = new URLSearchParams({
      page: String(pageParam),
      limit: String(limit),
      search: search,
    });

    const response = await fetch(
      `${USERS_API_URL}/filter?${queryParams.toString()}`,
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
    console.error("❌ API getUsers Error:", error);
    throw new Error(error.message || "Gagal menghubungi server database.");
  }
};

export const getAllUsers = async (): Promise<TUsersResponseWithoutMeta> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized! Sesi berakhir.");

    const response = await fetch(`${USERS_API_URL}/all`, {
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
    console.error("❌ API getAllUsers Error:", error);
    throw new Error(error.message || "Gagal menghubungi server database.");
  }
};

export const registerUser = async (json: RegisterUserValues) => {
  try {
    const validatedFields = RegisterUserSchema.safeParse(json);

    if (!validatedFields.success) {
      const errorMessage = validatedFields.error.message || "Data tidak valid.";
      return { success: false, message: errorMessage };
    }

    const payload = validatedFields.data;

    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Gagal melakukan registrasi user baru.",
      };
    }

    const data = await response.json();

    revalidatePath("/master-user", "page");

    return {
      success: true,
      message: "Registrasi berhasil!",
      data,
    };
  } catch (error) {
    console.error("Error pada registerUser:", error);
    return {
      success: false,
      message: "Terjadi kesalahan koneksi ke server.",
    };
  }
};

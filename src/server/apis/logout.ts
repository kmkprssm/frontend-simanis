"use server";

import CONST from "@/lib/constants";
import { signOut } from "../auth";

export const logout = async () => {
  const response = await fetch(`${CONST.API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();

  if (result.success) {
    return await signOut();
  }
};

"use client";

import { useSession } from "next-auth/react";
import { isReadOnlyUser, canWrite } from "@/lib/permissions";

export const usePermission = () => {
  const { data: session } = useSession();
  const role = session?.user?.role as string | undefined;

  const isGuest = role === "GUEST";
  const isReadOnly = isReadOnlyUser(role);
  const canModify = canWrite(role);

  return {
    role,
    isGuest,
    isReadOnly,
    canModify,
  };
};

"use client";

import * as React from "react";
import { usePermission } from "@/hooks/use-permission";

interface PermissionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Pembungkus untuk menyembunyikan aksi Add/Update/Delete khusus bagi GUEST
 */
export const CanModifyGuard = ({
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const { canModify } = usePermission();

  if (!canModify) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

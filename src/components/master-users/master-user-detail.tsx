"use client";

import * as React from "react";
import { IconClock, IconShieldCheck, IconUser } from "@tabler/icons-react";

import { TMasterUser } from "@/types/user-type";
import { Badge } from "../ui/badge";

interface MasterUserDetailProps {
  data: TMasterUser;
}

export const MasterUserDetail = ({ data }: MasterUserDetailProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "default";
      case "GUEST":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Helper untuk format tanggal & waktu ke bahasa Indonesia
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Belum Pernah Login";

    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-4 p-4 text-sm">
      {/* Header Info */}
      <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
          <IconUser className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold">{data.name}</h3>
          <p className="text-muted-foreground text-xs">{data.email}</p>
        </div>
      </div>

      {/* Grid Informasi */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Status Online */}
        <div className="rounded-md border p-3">
          <span className="text-muted-foreground block text-xs">
            Status Aktivitas
          </span>
          <div className="mt-1 flex items-center gap-2 font-medium">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                data.is_online ? "animate-pulse bg-green-500" : "bg-slate-400"
              }`}
            />
            {data.is_online ? "Online" : "Offline"}
          </div>
        </div>

        {/* Role */}
        <div className="rounded-md border p-3">
          <span className="text-muted-foreground block text-xs">
            Role Pengguna
          </span>
          <div className="mt-1">
            <Badge variant={getRoleBadgeVariant(data.role)} className="gap-1">
              <IconShieldCheck className="h-3 w-3" />
              {data.role}
            </Badge>
          </div>
        </div>

        {/* Terakhir Login Info */}
        <div className="col-span-1 rounded-md border p-3 sm:col-span-2">
          <span className="text-muted-foreground block text-xs">
            Terakhir Login
          </span>
          <div className="mt-1.5 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
            <IconClock className="text-muted-foreground h-4 w-4" />
            <span>{formatDate(data.last_login || data.last_seen)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

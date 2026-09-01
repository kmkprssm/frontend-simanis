"use client";

import {
  IconAlertTriangle,
  IconTag,
  IconFlag,
  IconMessage2,
  IconFlame,
  IconSearch,
  IconShieldCheck,
  IconCalendar,
  IconClock,
  IconBuildingCommunity,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, dateFormat } from "@/lib/utils";
import { TIdentifikasiRisiko } from "@/types/identifikasi-risiko-type";
import { STATUS_VARIANTS } from "@/helpers/risk-helpers";

interface IdentifikasiRisikoDetailProps {
  data: TIdentifikasiRisiko;
}

export const IdentifikasiRisikoDetail = ({
  data,
}: IdentifikasiRisikoDetailProps) => {
  if (!data) {
    return (
      <p className="text-muted-foreground p-6 text-center text-sm">
        Data tidak ditemukan.
      </p>
    );
  }

  const currentStatus = STATUS_VARIANTS[data.status];

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6 text-sm">
      <div className="relative overflow-hidden rounded-xl border border-blue-500/10 bg-linear-to-br from-blue-500/5 to-indigo-500/5 p-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <IconAlertTriangle className="h-5 w-5" stroke={2} />
          </div>
          <h3 className="text-foreground text-base leading-snug font-bold">
            {data.nama_resiko}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="bg-muted/40 border-border/40 flex flex-col items-center justify-center rounded-xl border p-3 text-center shadow-xs">
          <div className="text-muted-foreground mb-2 inline-flex items-center gap-1.5 text-xs font-medium">
            <IconBuildingCommunity className="h-3.5 w-3.5" />
            Unit
          </div>
          <Badge
            variant="default"
            className="rounded-full bg-slate-200 px-3 py-0.5 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {data.created_by_name || "-"}
          </Badge>
        </div>

        <div className="bg-muted/40 border-border/40 flex flex-col items-center justify-center rounded-xl border p-3 text-center shadow-xs">
          <div className="text-muted-foreground mb-2 inline-flex items-center gap-1.5 text-xs font-medium">
            <IconTag className="h-3.5 w-3.5" />
            Kategori
          </div>
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-200 px-3 py-0.5 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {data.kategori_name || "-"}
          </Badge>
        </div>

        <div className="bg-muted/40 border-border/40 flex flex-col items-center justify-center rounded-xl border p-3 text-center shadow-xs">
          <div className="text-muted-foreground mb-2 inline-flex items-center gap-1.5 text-xs font-medium">
            <IconFlag className="h-3.5 w-3.5" />
            Status
          </div>

          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-0.5 font-bold shadow-2xs",
              currentStatus.variant,
            )}
          >
            <currentStatus.icon />
            {currentStatus.label}
          </Badge>
        </div>
      </div>

      {data.deskripsi && (
        <div className="border-border/50 bg-card space-y-2 rounded-xl border p-4 shadow-2xs">
          <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <IconMessage2 className="h-4 w-4" />
            Deskripsi Risiko
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed font-medium">
            {data.deskripsi}
          </p>
        </div>
      )}

      {data.consequences && (
        <div className="space-y-2 rounded-xl border border-red-500/10 bg-linear-to-br from-red-500/2 to-amber-500/2 p-4 shadow-2xs">
          <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
            <IconFlame className="h-4 w-4" />
            Dampak Utama (Consequences)
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed font-medium">
            {data.consequences}
          </p>
        </div>
      )}

      {data.root_cause && (
        <div className="space-y-2 rounded-xl border border-sky-500/10 bg-linear-to-br from-sky-500/2 to-indigo-500/2 p-4 shadow-2xs">
          <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
            <IconSearch className="h-4 w-4" />
            Penyebab Utama (Root Cause)
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed font-medium">
            {data.root_cause}
          </p>
        </div>
      )}

      {data.existing_controls && (
        <div className="space-y-2 rounded-xl border border-emerald-500/10 bg-linear-to-br from-emerald-500/2 to-teal-500/2 p-4 shadow-2xs">
          <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <IconShieldCheck className="h-4 w-4" />
            Pengendalian yang Ada (Existing Controls)
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed font-medium">
            {data.existing_controls}
          </p>
        </div>
      )}

      <div className="text-muted-foreground/70 pt-3 text-[11px]">
        <Separator className="mb-3 opacity-60" />
        <div className="flex items-center justify-between px-1">
          <div className="inline-flex items-center gap-1.5">
            <IconCalendar className="h-3.5 w-3.5" />
            <span>Dibuat:</span>
            <span className="text-muted-foreground font-semibold">
              {dateFormat(data.created_at) || "-"}
            </span>
          </div>
          {data.updated_at && (
            <div className="inline-flex items-center gap-1.5">
              <IconClock className="h-3.5 w-3.5" />
              <span>Diperbarui:</span>
              <span className="text-muted-foreground font-semibold">
                {dateFormat(data.updated_at) || "-"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

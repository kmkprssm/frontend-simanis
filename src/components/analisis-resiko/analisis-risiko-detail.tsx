"use client";

import {
  IconAlertTriangle,
  IconActivity,
  IconFlame,
  IconCalendar,
  IconHierarchy,
  IconInfoCircle,
} from "@tabler/icons-react";

import { TAnalisisRisiko } from "@/types/analisis-risiko-type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, dateFormat } from "@/lib/utils";
import {
  getRiskLevel,
  impactKeterangan,
  likelihoodKeterangan,
} from "@/helpers/risk-helpers";

interface AnalisisRisikoDetailProps {
  data: TAnalisisRisiko;
}

export const AnalisisRisikoDetail = ({ data }: AnalisisRisikoDetailProps) => {
  const { nama_resiko, kategori_name, pemilik_risiko, created_at } = data;

  const likelihood = data.likelihood
    ? (Number(data.likelihood) as keyof typeof likelihoodKeterangan)
    : 0;
  const impact = data.impact
    ? (Number(data.impact) as keyof typeof impactKeterangan)
    : 0;
  const score = likelihood && impact ? likelihood * impact : 0;

  const finalRisk = getRiskLevel(score);

  const currentLikelihoodData = likelihood
    ? likelihoodKeterangan[likelihood]
    : null;
  const currentImpactData = impact ? impactKeterangan[impact] : null;

  return (
    <>
      <div className="space-y-5 p-6 py-2">
        {/* 1. INFORMASI UTAMA & KATEGORI */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <h3 className="text-base leading-snug font-bold text-slate-900">
            {nama_resiko || "NAMA RISIKO BELUM TERDEFINISI"}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-xs"
            >
              Kategori: {kategori_name || "Umum"}
            </Badge>

            <div className="text-muted-foreground ml-1 flex items-center gap-1 text-xs">
              <IconHierarchy className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                Unit:{" "}
                <span className="font-semibold text-slate-700">
                  {pemilik_risiko || "Belum ada pemilik"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. DUA KOLOM KOMPONEN PENILAIAN DENGAN DESKRIPSI JAWABAN */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* BOX LIKELIHOOD + DESKRIPSI */}
          <div className="border-slate-150 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <IconActivity className="h-3 w-3 text-blue-500" /> Likelihood
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {currentLikelihoodData
                    ? currentLikelihoodData.label
                    : "Belum Dinilai"}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-base font-black text-blue-600 shadow-inner">
                {likelihood}
              </div>
            </div>
            {currentLikelihoodData && (
              <div className="flex gap-2 rounded-lg border border-blue-100/30 bg-blue-50/40 p-2.5 text-xs leading-normal text-slate-600">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <strong className="text-slate-700">
                    Kriteria Frekuensi:
                  </strong>
                  <p className="mt-0.5 text-slate-500">
                    {currentLikelihoodData.desc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* BOX IMPACT + DESKRIPSI */}
          <div className="border-slate-150 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <IconFlame className="h-3 w-3 text-orange-500" /> Impact
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {currentImpactData
                    ? currentImpactData.label
                    : "Belum Dinilai"}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-base font-black text-orange-600 shadow-inner">
                {impact}
              </div>
            </div>
            {currentImpactData && (
              <div className="flex gap-2 rounded-lg border border-orange-100/30 bg-orange-50/40 p-2.5 text-xs leading-normal text-slate-600">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <div>
                  <strong className="text-slate-700">Kriteria Dampak:</strong>
                  <p className="mt-0.5 text-slate-500">
                    {currentImpactData.desc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. CARD RINGKASAN SKOR TOTAL */}
        <Card
          className={cn(
            "w-full border bg-linear-to-br py-1 shadow-sm transition-all duration-300",
            finalRisk.bgGradient,
          )}
        >
          <CardContent className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div
                className={cn(
                  "shrink-0 rounded-lg border border-white bg-white/80 p-2 shadow-sm",
                  finalRisk.textClass,
                )}
              >
                <IconAlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Hasil Analisis Skor Akhir
                </h4>
                <p className="mt-0.5 text-xs text-slate-600">
                  Formula Perkalian:{" "}
                  <span className="font-semibold text-slate-800">
                    L ({likelihood})
                  </span>{" "}
                  ×{" "}
                  <span className="font-semibold text-slate-800">
                    I ({impact})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-5 rounded-xl border border-white/60 bg-white/50 px-4 py-2 shadow-inner sm:w-auto sm:justify-end">
              <div className="text-center">
                <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  Total Skor
                </span>
                <span
                  className={cn(
                    "block text-2xl font-black tracking-tight",
                    finalRisk.textClass,
                  )}
                >
                  {score}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-300/60" />
              <div className="text-center sm:text-left">
                <span className="mb-1 block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  Tingkat Risiko
                </span>
                <Badge
                  className={cn(
                    "border-none px-2.5 py-0.5 text-[11px] font-bold shadow-sm shadow-black/10",
                    finalRisk.badgeClass,
                  )}
                >
                  {finalRisk.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-slate-100" />

        {/* 4. FOOTER: METADATA & TANGGAL ANALISIS */}
        <div className="text-muted-foreground flex items-center justify-center gap-1 rounded border border-slate-100/60 bg-slate-50/50 py-1.5 text-[11px]">
          <IconCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>
            Waktu Analisis Risiko:{" "}
            <span className="font-medium text-slate-600">
              {created_at ? dateFormat(created_at) : "-"}
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

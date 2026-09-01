"use client";

import * as React from "react";
import { CountUp } from "@/components/count-up";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getProgressColor } from "@/helpers/perlakuan-risiko-helper";
import { TStatsRisikoWithMitigasi } from "@/types/perlakuan-risiko-type";

interface PerlakuanRisikoStatsProps {
  stats: TStatsRisikoWithMitigasi;
}

export const PerlakuanRisikoStats = ({ stats }: PerlakuanRisikoStatsProps) => {
  const {
    totalRisks,
    totalKontrol,
    totalAction,
    doneActions,
    overdueActions,
    activeRisks,
    closedRisks,
  } = stats;

  const progressPercent =
    totalRisks > 0 ? Math.round((doneActions / totalAction) * 100) : 0;

  return (
    <Card className="overflow-hidden border-slate-200 bg-white py-2 shadow-sm">
      <CardContent className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-6 text-center sm:text-left">
          {/* TOTAL RISIKO */}
          <div className="min-w-20">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total Risiko
            </p>
            <p className="mt-0.5 text-2xl font-bold text-zinc-900">
              <CountUp
                preserveValue
                start={0}
                end={totalRisks}
                duration={1.5}
              />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 sm:block"
          />

          {/* RISIKO AKTIF */}
          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Risiko Aktif
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${activeRisks > 0 ? "text-amber-500" : "text-zinc-400"}`}
            >
              <CountUp
                preserveValue
                start={0}
                end={activeRisks}
                duration={1.5}
              />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 sm:block"
          />

          {/* RISIKO DITUTUP */}
          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Risiko Ditutup
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${closedRisks > 0 ? "text-emerald-600" : "text-zinc-400"}`}
            >
              <CountUp
                preserveValue
                start={0}
                end={closedRisks}
                duration={1.5}
              />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 sm:block"
          />

          {/* AREA BADGE AGREGASI PENGENDALIAN & TINDAKAN */}
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/80 px-3.5 py-1 text-left">
            {/* TOTAL PENGENDALIAN */}
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                TOTAL PENGENDALIAN
              </span>
              <span className="text-sm font-bold text-slate-700">
                <CountUp
                  preserveValue
                  start={0}
                  end={totalKontrol}
                  duration={1.2}
                />
              </span>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* TOTAL TINDAKAN (ALL) */}
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                TOTAL TINDAKAN
              </span>
              <span className="text-sm font-bold text-blue-600">
                <CountUp
                  preserveValue
                  start={0}
                  end={totalAction}
                  duration={1.2}
                />
              </span>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* ✅ TINDAKAN SELESAI (DONE) */}
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                TINDAKAN SELESAI
              </span>
              <span
                className={`text-sm font-bold ${doneActions > 0 ? "text-emerald-600" : "text-slate-500"}`}
              >
                <CountUp
                  preserveValue
                  start={0}
                  end={doneActions}
                  duration={1.2}
                />
              </span>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* ✅ TINDAKAN OVERDUE (TERLAMBAT) */}
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                OVERDUE
              </span>
              <span
                className={`text-sm font-bold ${overdueActions > 0 ? "animate-pulse text-red-500" : "text-slate-500"}`}
              >
                <CountUp
                  preserveValue
                  start={0}
                  end={overdueActions}
                  duration={1.2}
                />
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR RATIO */}
        {totalRisks > 0 && (
          <div className="native-shine-effect w-full space-y-1.5 md:w-52">
            <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
              <span>Rasio Penyelesaian</span>
              <span className="font-semibold text-zinc-700">
                <CountUp
                  start={0}
                  end={progressPercent}
                  suffix="%"
                  preserveValue
                  duration={1.8}
                />
              </span>
            </div>

            <div className="relative overflow-hidden rounded-full">
              <Progress
                value={progressPercent}
                className={`h-2 w-full bg-zinc-100 transition-all duration-500 ${getProgressColor(progressPercent)}`}
              />
              <div className="pointer-events-none absolute inset-0 h-full w-1/2 skew-x-[-20deg] animate-[shine_2.5s_infinite_ease-in-out] bg-white/20" />
            </div>
          </div>
        )}
      </CardContent>

      <style jsx global>{`
        @keyframes shine {
          0% {
            left: -60%;
          }
          100% {
            left: 160%;
          }
        }
      `}</style>
    </Card>
  );
};

import { CountUp } from "@/components/count-up";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TEvaluasiRisikoStats } from "@/types/evaluasi-risiko-type";

interface EvaluasiRisikoStatsProps {
  stats: TEvaluasiRisikoStats;
}

export const EvaluasiRisikoStats = ({ stats }: EvaluasiRisikoStatsProps) => {
  const {
    totalEvaluated,
    pendingEvaluation,
    urgentCount,
    activeRisks,
    strategiCount,
  } = stats;

  const realEvaluatedUnique = Math.max(0, activeRisks - pendingEvaluation);

  const progressPercent =
    activeRisks > 0 ? Math.round((realEvaluatedUnique / activeRisks) * 100) : 0;

  const getProgressColor = (percent: number) => {
    if (percent <= 40)
      return "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-400";
    if (percent <= 80)
      return "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-400";
    return "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400";
  };

  return (
    <Card className="overflow-hidden border-slate-200 bg-white py-2 shadow-sm">
      <CardContent className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        {/* STATISTIK HORIZONTAL MINIMALIS */}
        <div className="flex flex-wrap items-center gap-6 text-center sm:text-left">
          {/* Total Risiko Aktif */}
          <div className="min-w-20">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Risiko Aktif
            </p>
            <p className="mt-0.5 text-2xl font-bold text-zinc-900">
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
            className="hidden h-9 bg-zinc-200 data-vertical:self-center sm:block"
          />

          {/* Sudah Dievaluasi */}
          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Dievaluasi
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${totalEvaluated > 0 ? "text-emerald-600" : "text-zinc-400"}`}
            >
              <CountUp
                preserveValue
                start={0}
                end={totalEvaluated}
                duration={1.5}
              />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 data-vertical:self-center sm:block"
          />

          {/* Belum Dievaluasi (Pending) */}
          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Belum Eval
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${pendingEvaluation > 0 ? "text-amber-500" : "text-zinc-400"}`}
            >
              <CountUp
                preserveValue
                start={0}
                end={pendingEvaluation}
                duration={1.5}
              />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 data-vertical:self-center sm:block"
          />

          {/* Urgent / Sangat Mendesak (Prioritas 1) */}
          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Mendesak (P1)
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${urgentCount > 0 ? "text-red-600" : "text-zinc-400"}`}
            >
              <CountUp
                preserveValue
                start={0}
                end={urgentCount}
                duration={1.5}
              />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 data-vertical:self-center sm:block"
          />

          {/* BREAKDOWN SEBARAN STRATEGI MITIGASI */}
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-1 text-left">
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                MITIGASI
              </span>
              <span className="text-xs font-bold text-amber-600">
                {strategiCount.TREAT}
              </span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                TRANSFER
              </span>
              <span className="text-xs font-bold text-red-500">
                {strategiCount.TRANSFER}
              </span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                HINDARI
              </span>
              <span className="text-xs font-bold text-slate-600">
                {strategiCount.AVOID}
              </span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <span className="block text-[10px] font-semibold text-slate-400">
                TERIMA
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {strategiCount.ACCEPT}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS CAKUPAN EVALUASI (SHINE EFFECT) */}
        {activeRisks > 0 && (
          <div className="native-shine-effect w-full space-y-1.5 md:w-52">
            <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
              <span>Cakupan Evaluasi</span>
              <span className="font-semibold text-zinc-700">
                <CountUp
                  start={0}
                  end={progressPercent}
                  decimals={0}
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
              {/* Efek Cahaya Menyapu Khas Tailwind */}
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

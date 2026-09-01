import { CountUp } from "@/components/count-up";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TAnalisisRisikoStats } from "@/types/analisis-risiko-type";

interface AnalisisRisikoStatsProps {
  data: TAnalisisRisikoStats;
}

export const AnalisisRisikoStats = ({ data }: AnalisisRisikoStatsProps) => {
  const { totalAnalisis, totalIdentifikasi, high, medium, low } = data;

  const coveragePercent =
    totalIdentifikasi > 0
      ? Math.round((totalAnalisis / totalIdentifikasi) * 100)
      : 0;

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
        <div className="flex flex-wrap items-center gap-6 text-center sm:text-left">
          <div className="min-w-20">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Teranalisis
            </p>
            <p className="mt-0.5 text-2xl font-bold text-zinc-900">
              <CountUp
                preserveValue
                start={0}
                end={totalAnalisis}
                duration={1.5}
              />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 sm:block"
          />

          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Tinggi (H)
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${high > 0 ? "text-red-600" : "text-zinc-400"}`}
            >
              <CountUp preserveValue start={0} end={high} duration={1.5} />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 sm:block"
          />

          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Sedang (M)
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${medium > 0 ? "text-amber-500" : "text-zinc-400"}`}
            >
              <CountUp preserveValue start={0} end={medium} duration={1.5} />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 sm:block"
          />

          <div className="min-w-15">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Rendah (L)
            </p>
            <p
              className={`mt-0.5 text-2xl font-bold ${low > 0 ? "text-green-600" : "text-zinc-400"}`}
            >
              <CountUp preserveValue start={0} end={low} duration={1.5} />
            </p>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-zinc-200 sm:block"
          />

          <div className="min-w-20">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total Risiko
            </p>
            <p className="mt-0.5 text-2xl font-bold text-blue-600">
              <CountUp
                preserveValue
                start={0}
                end={totalIdentifikasi}
                duration={1.5}
              />
            </p>
          </div>
        </div>

        {totalIdentifikasi > 0 && (
          <div className="native-shine-effect w-full space-y-1.5 md:w-52">
            <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
              <span>Cakupan Analisis</span>
              <span className="font-semibold text-zinc-700">
                <CountUp
                  start={0}
                  end={coveragePercent}
                  decimals={0}
                  suffix="%"
                  preserveValue
                  duration={1.8}
                />
              </span>
            </div>

            <div className="relative overflow-hidden rounded-full">
              <Progress
                value={coveragePercent}
                className={`h-2 w-full bg-zinc-100 transition-all duration-500 ${getProgressColor(coveragePercent)}`}
              />
              <div className="pointer-events-none absolute inset-0 h-full w-1/2 skew-x-[-20deg] animate-[shine_2s_infinite_ease-in-out] bg-white/20" />
            </div>
          </div>
        )}
      </CardContent>

      <style jsx global>{`
        @keyframes shine {
          0% {
            left: -50%;
          }
          100% {
            left: 150%;
          }
        }
      `}</style>
    </Card>
  );
};

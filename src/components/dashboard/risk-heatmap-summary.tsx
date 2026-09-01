"use client";

import { IconInfoCircle } from "@tabler/icons-react";

import { TRiskHeatmap } from "@/types/summary-type";
import { CustomTooltip } from "../custom-tooltip";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "@/helpers/risk-helpers";

interface RiskHeatmapSummaryProps {
  data: TRiskHeatmap[] | undefined;
}

const RISK_LEVEL_MAP: Record<string, string> = {
  LOW: "RENDAH",
  MEDIUM: "SEDANG",
  HIGH: "TINGGI",
  EXTREME: "EKSTRIM",
};

const getColor = (level: string | null) => {
  switch (level) {
    case "RENDAH":
      return "#4CAF50";
    case "SEDANG":
      return "#FFC107";
    case "TINGGI":
      return "#FF9800";
    case "EKSTRIM":
      return "#F44336";
    default:
      return "#e9ecef";
  }
};

export const RiskHeatmapSummary = ({ data }: RiskHeatmapSummaryProps) => {
  const getCellData = (likelihood: number, impact: number) => {
    const found = data?.find(
      (r) => r.likelihood === likelihood && r.impact === impact,
    );

    if (!found) return null;

    const localLevel = RISK_LEVEL_MAP[found.risk_level] || found.risk_level;

    return {
      ...found,
      risk_level: localLevel,
    };
  };

  const renderTooltipContent = (
    cellData: TRiskHeatmap | null,
    likelihood: number,
    impact: number,
  ) => {
    if (!cellData || !cellData.total) {
      return <div className="text-muted">Tidak ada risiko</div>;
    }

    const score = likelihood * impact;

    return (
      <div>
        <div>
          <strong>Posisi:</strong> Prob {likelihood}, Dampak {impact}
        </div>
        <div>
          <strong>Jumlah Risiko:</strong> {cellData.total}
        </div>
        <div>
          <strong>Tingkat:</strong> {getRiskLevel(score).label}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-center gap-4">
        {["RENDAH", "SEDANG", "TINGGI", "EKSTRIM"].map((level) => (
          <div key={level} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getColor(level) }}
            />
            <span className="text-md font-medium">{level}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#e9ecef]" />
          <span className="text-md font-medium">Tidak ada risiko</span>
        </div>
      </div>

      <div className="mb-2 flex w-full flex-col items-center gap-1">
        <div className="text-foreground text-center text-xs font-bold tracking-wider uppercase">
          Kemungkinan
        </div>
        <div className="flex w-full">
          <div className="flex flex-1">
            {[1, 2, 3, 4, 5].map((prob) => (
              <div
                key={prob}
                className="text-muted-foreground text-md flex-1 text-center font-semibold"
              >
                Prob {prob}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div
          className="text-foreground text-center text-xs font-bold tracking-wider uppercase"
          style={{
            writingMode: "vertical-lr",
            transform: "rotate(180deg)",
          }}
        >
          Dampak
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((impact) => (
            <div key={impact} className="mb-2 flex items-center">
              {/* LABEL DAMPAK */}
              <div
                style={{ width: 64 }}
                className="text-muted-foreground text-md flex items-center justify-center font-bold"
              >
                {impact}
              </div>

              <div className="flex flex-1 gap-2">
                {[1, 2, 3, 4, 5].map((likelihood) => {
                  const cellData = getCellData(likelihood, impact);
                  const hasRisks = cellData && cellData.total > 0;
                  const level = hasRisks ? cellData.risk_level : null;

                  return (
                    <div key={likelihood} className="flex-1">
                      <CustomTooltip
                        align="center"
                        side="top"
                        tooltipContent={renderTooltipContent(
                          cellData,
                          likelihood,
                          impact,
                        )}
                      >
                        <div
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                          style={{
                            backgroundColor: hasRisks
                              ? getColor(level)
                              : "#e9ecef",
                            transition: "transform 0.2s ease",
                          }}
                          className={cn(
                            "flex cursor-pointer items-center justify-center rounded-md border border-black/5 py-5 text-xl shadow-sm",
                            hasRisks
                              ? "font-bold text-white"
                              : "text-muted-foreground/60 font-normal",
                          )}
                        >
                          {hasRisks ? cellData.total : "-"}
                        </div>
                      </CustomTooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-muted-foreground mt-5 flex items-center justify-center gap-2 text-center text-sm">
        <IconInfoCircle stroke={2} />
        Arahkan kursor ke kotak untuk melihat detail
      </div>
    </>
  );
};

import { IconMapSearch } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RiskHeatmapSummary } from "./risk-heatmap-summary";
import { TRiskHeatmap } from "@/types/summary-type";

interface RiskHeatmapCardProps {
  data: TRiskHeatmap[] | undefined;
}

export const RiskHeatmapCard = ({ data }: RiskHeatmapCardProps) => {
  return (
    <div className="*:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconMapSearch stroke={2} /> Peta Risiko
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RiskHeatmapSummary data={data} />
        </CardContent>
        <CardFooter>
          Risiko aktif berdasarkan probabilitas dan dampak
        </CardFooter>
      </Card>
    </div>
  );
};

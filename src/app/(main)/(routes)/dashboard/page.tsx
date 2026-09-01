import { DataChartCategory } from "@/components/dashboard/data-chart-category";
import { DataGrid } from "@/components/dashboard/data-grid";
import { DataProfileRisiko } from "@/components/dashboard/data-profile-risiko";
import { RiskHeatmapCard } from "@/components/dashboard/risk-heatmap-card";
import { currentUser } from "@/lib/auth";
import { getRiskHeatmap, getSummary } from "@/server/apis/summary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan data manajemen risiko.",
};

export default async function Home() {
  const summaryData = await getSummary();
  const riskHeatmapData = await getRiskHeatmap();
  const user = await currentUser();

  return (
    <>
      <DataGrid data={summaryData?.metrics} user={user} />
      {user?.role !== "USER" && <DataProfileRisiko user={user} />}
      <RiskHeatmapCard data={riskHeatmapData?.data} />
      <DataChartCategory data={summaryData?.categories} />
    </>
  );
}

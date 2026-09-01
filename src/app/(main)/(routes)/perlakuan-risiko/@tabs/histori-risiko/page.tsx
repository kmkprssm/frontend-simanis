import { HistoriRisikoTab } from "@/components/perlakuan-risiko/tabs/histori-risiko";
import {
  getPerlakuanRisiko,
  getStatsRisikoWithMitigasi,
} from "@/server/apis/perlakuan-risiko";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perlakuan Risiko - Histori Risiko",
  description: "Ringkasan data manajemen risiko.",
};

const HistoriRisikoPage = async () => {
  const closedRisikoData = await getPerlakuanRisiko("history");
  const statsRisikoWithMitigasi = await getStatsRisikoWithMitigasi();
  const closedRiskCount = statsRisikoWithMitigasi.closedRisks || 0;

  return (
    <HistoriRisikoTab
      data={closedRisikoData}
      closeRiskCount={closedRiskCount}
    />
  );
};

export default HistoriRisikoPage;

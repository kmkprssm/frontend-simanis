import { AlertOverdue } from "@/components/perlakuan-risiko/perlakuan-risiko-overdue";
import { RisikoAktifTab } from "@/components/perlakuan-risiko/tabs/risiko-aktif/risiko-aktif-tab";
import {
  getPerlakuanRisiko,
  getStatsRisikoWithMitigasi,
} from "@/server/apis/perlakuan-risiko";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perlakuan Risiko - Risiko Aktif",
  description: "Ringkasan data manajemen risiko.",
};

const RisikiAktifPage = async () => {
  const activeRisikoData = await getPerlakuanRisiko("active");
  const statsRisikoWithMitigasi = await getStatsRisikoWithMitigasi();
  const dynamicOverdueCount = statsRisikoWithMitigasi.overdueActions || 0;
  const activeRiskCount = statsRisikoWithMitigasi.activeRisks || 0;

  const activeTab = "risiko-aktif";

  return (
    <>
      <AlertOverdue overdueCount={dynamicOverdueCount} activeTab={activeTab} />
      <RisikoAktifTab
        data={activeRisikoData}
        activeRiskCount={activeRiskCount}
      />
    </>
  );
};

export default RisikiAktifPage;

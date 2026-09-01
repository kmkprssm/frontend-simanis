import { PerlakuanRisikoHeader } from "@/components/perlakuan-risiko/perlakuan-risiko-header";
import { PerlakuanRisikoStats } from "@/components/perlakuan-risiko/perlakuan-risiko-stats";
import { PerlakuanRisikoTabs } from "@/components/perlakuan-risiko/perlakuan-risiko-tabs";
import { getStatsRisikoWithMitigasi } from "@/server/apis/perlakuan-risiko";

export default async function PerlakuanRisikoLayout({
  tabs,
}: {
  children: React.ReactNode;
  tabs: React.ReactNode;
}) {
  const statsRisikoWithMitigasi = await getStatsRisikoWithMitigasi();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <PerlakuanRisikoHeader />
        <PerlakuanRisikoStats stats={statsRisikoWithMitigasi} />
      </div>
      <PerlakuanRisikoTabs globalTabs={tabs} />
    </div>
  );
}

import { PemantauanTinjauanHeader } from "@/components/pemantauan-tinjauan/pemantauan-tinjauan-header";
import { PemantauanTinjauanTabs } from "@/components/pemantauan-tinjauan/pemantauan-tinjauan-tabs";

export default async function PemantauanTinjauanLayout({
  tabs,
}: {
  tabs: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <PemantauanTinjauanHeader />
      </div>
      <PemantauanTinjauanTabs globalTabs={tabs} />
    </div>
  );
}

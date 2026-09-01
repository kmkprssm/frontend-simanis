"use client";

import { useRouter } from "@bprogress/next/app";
import { usePathname } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PemantauanTinjauanTabsProps {
  globalTabs: React.ReactNode;
}

export const PemantauanTinjauanTabs = ({
  globalTabs,
}: PemantauanTinjauanTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = pathname.includes("/laporan-kejadian-risiko")
    ? "laporan-kejadian-risiko"
    : pathname.includes("/laporan")
      ? "laporan"
      : pathname.includes("/risiko-ditutup")
        ? "risiko-ditutup"
        : "risiko-aktif";

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="no-scrollbar flex h-auto w-full justify-start overflow-x-auto p-1 sm:inline-flex sm:h-10 sm:w-auto sm:justify-center">
        <TabsTrigger
          value="risiko-aktif"
          onClick={() =>
            router.push("/pemantauan-tinjauan/risiko-aktif", {
              showProgress: true,
            })
          }
          className="shrink-0 cursor-pointer px-4 py-1.5 text-xs whitespace-nowrap sm:text-sm"
        >
          Risiko Aktif
        </TabsTrigger>

        <TabsTrigger
          value="risiko-ditutup"
          onClick={() =>
            router.push("/pemantauan-tinjauan/risiko-ditutup", {
              showProgress: true,
            })
          }
          className="shrink-0 cursor-pointer px-4 py-1.5 text-xs whitespace-nowrap sm:text-sm"
        >
          Risiko Selesai
        </TabsTrigger>

        <TabsTrigger
          value="laporan"
          onClick={() =>
            router.push("/pemantauan-tinjauan/laporan", {
              showProgress: true,
            })
          }
          className="shrink-0 cursor-pointer px-4 py-1.5 text-xs whitespace-nowrap sm:text-sm"
        >
          Rekap Laporan
        </TabsTrigger>

        <TabsTrigger
          value="laporan-kejadian-risiko"
          onClick={() =>
            router.push("/pemantauan-tinjauan/laporan-kejadian-risiko", {
              showProgress: true,
            })
          }
          className="shrink-0 cursor-pointer px-4 py-1.5 text-xs whitespace-nowrap sm:text-sm"
        >
          Laporan Kejadian Risiko
        </TabsTrigger>
      </TabsList>

      <div className="mt-2">{globalTabs}</div>
    </Tabs>
  );
};

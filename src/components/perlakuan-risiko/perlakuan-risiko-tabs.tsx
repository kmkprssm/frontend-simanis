"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerlakuanRisikoTabsProps {
  globalTabs: React.ReactNode;
}

export const PerlakuanRisikoTabs = ({
  globalTabs,
}: PerlakuanRisikoTabsProps) => {
  const pathname = usePathname();

  const activeTab = pathname.includes("/histori-risiko")
    ? "histori-risiko"
    : "risiko-aktif";

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="risiko-aktif" asChild>
            <Link href="/perlakuan-risiko/risiko-aktif" className="w-full">
              Risiko Aktif
            </Link>
          </TabsTrigger>

          <TabsTrigger value="histori-risiko" asChild>
            <Link href="/perlakuan-risiko/histori-risiko" className="w-full">
              Risiko Selesai
            </Link>
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">{globalTabs}</div>
      </Tabs>
    </div>
  );
};

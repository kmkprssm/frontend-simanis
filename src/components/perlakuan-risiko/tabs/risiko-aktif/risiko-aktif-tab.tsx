"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";

interface RisikoAktifTabProps {
  data: TRisikoAktifMitigasiItem[];
  activeRiskCount: number;
}

export const RisikoAktifTab = ({
  data,
  activeRiskCount,
}: RisikoAktifTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Risiko Aktif Dengan Strategi Mitigasi</CardTitle>
        <CardDescription>
          {activeRiskCount} risiko memerlukan pengendalian dan tindakan mitigasi
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        <DataTable
          variant="general"
          columns={columns}
          data={data!}
          filterKey="nama_resiko"
          filterName="Risiko"
        />
      </CardContent>
    </Card>
  );
};

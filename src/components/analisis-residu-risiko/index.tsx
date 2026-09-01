"use client";

import { IconTrendingDown } from "@tabler/icons-react";
import { PageHeader } from "../page-header";
import { TAnalisisResiduRisiko } from "@/types/analisis-risiko-type";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";

interface AnalisisResiduRisikoProps {
  data: TAnalisisResiduRisiko[];
}

export const AnalisisResiduRisiko = ({ data }: AnalisisResiduRisikoProps) => {
  return (
    <>
      <PageHeader
        title="Analisis Residu Risiko"
        description="Lakukan analisis residu risiko untuk melihat seberapa efektif strategi mitigasi yang telah diterapkan oleh organisasi Anda"
        showAction={false}
        icon={IconTrendingDown}
      />

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={data!}
          filterKey="nama_resiko"
          filterName="Risiko"
          variant="general"
        />
      </div>
    </>
  );
};

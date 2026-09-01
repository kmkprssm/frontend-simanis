"use client";

import * as React from "react";
import { TIdentifikasiRisiko } from "@/types/identifikasi-risiko-type";
import { useSearchParams } from "next/navigation";
import { IconChartHistogram } from "@tabler/icons-react";

import {
  TAnalisisRisiko,
  TAnalisisRisikoStats,
} from "@/types/analisis-risiko-type";
import { DataTable } from "../ui/data-table";
import { getColumns } from "./columns";
import { AnalisisRisikoStats } from "./analisis-risiko-stats";
import { useModalStore } from "@/stores/modal-store";
import { PageHeader } from "../page-header";
import { Button } from "../ui/button";
import { ExtendedUser } from "@/next-auth";

interface AnalisisRisikoProps {
  data?: TAnalisisRisiko[];
  identifikasiRisikoData?: TIdentifikasiRisiko[];
  analisisRisikoStats: TAnalisisRisikoStats;
  user?: ExtendedUser;
}

export const AnalisisRisiko = ({
  data,
  identifikasiRisikoData,
  analisisRisikoStats,
  user,
}: AnalisisRisikoProps) => {
  const searchParams = useSearchParams();
  const { onOpen } = useModalStore();

  const columns = React.useMemo(() => getColumns(user), [user]);

  React.useEffect(() => {
    const openRiskId = searchParams.get("risk_id");

    if (openRiskId) {
      onOpen(
        "addEditAnalisisRisiko",
        {
          title: "Tambah Analisis Risiko",
          message: (
            <>
              Pilih risiko dan tentukan nilai skala kemungkinan dan skala
              dampaknya.
            </>
          ),
        },
        {
          id: openRiskId,
          analisisRisikoDatas: data,
        },
      );
    }
  }, [searchParams, onOpen, data]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Analisis Risiko"
        description=" Penilaian risiko inheren berdasarkan skala kemungkinan dan skala dampak"
        showAction={true}
        icon={IconChartHistogram}
        action={
          <>
            <Button
              variant={"secondary"}
              onClick={() =>
                onOpen(
                  "addEditAnalisisRisiko",
                  {
                    title: "Tambah Analisis Risiko",
                    message: (
                      <>
                        Pilih risiko dan tentukan nilai skala kemungkinan dan
                        skala dampaknya.
                      </>
                    ),
                  },
                  {
                    identifikasiRisikoData: identifikasiRisikoData,
                    analisisRisikoDatas: data,
                  },
                )
              }
            >
              Tambah Analisis Risiko
            </Button>
          </>
        }
      />
      <div className="space-y-6">
        <AnalisisRisikoStats data={analisisRisikoStats} />
        <DataTable
          columns={columns}
          data={data!}
          filterKey="nama_resiko"
          filterName="Risiko"
          variant="general"
        />
      </div>
    </div>
  );
};

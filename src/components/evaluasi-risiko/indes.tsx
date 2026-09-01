"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { IconChartPie2 } from "@tabler/icons-react";

import {
  TEvaluasiRisiko,
  TEvaluasiRisikoStats,
} from "@/types/evaluasi-risiko-type";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";
import { EvaluasiRisikoStats } from "./evaluasi-risiko-stats";
import { useModalStore } from "@/stores/modal-store";
import { PageHeader } from "../page-header";
import { Button } from "../ui/button";

interface EvaluasiRisikoProps {
  data?: TEvaluasiRisiko[];
  evaluasiRisikoStats: TEvaluasiRisikoStats;
}

export const EvaluasiRisiko = ({
  data,
  evaluasiRisikoStats,
}: EvaluasiRisikoProps) => {
  const searchParams = useSearchParams();
  const { onOpen } = useModalStore();

  useEffect(() => {
    const openRiskId = searchParams.get("open_risk_id");
    const action = searchParams.get("action");

    if (openRiskId && action === "new_evaluation") {
      onOpen(
        "addEditEvaluasiRisiko",
        {
          title: "Evaluasi Risiko Pasca Insiden",
          message:
            "Perbarui bobot kemungkinan, dampak, dan dokumen mitigasi pengendalian baru berdasarkan insiden bulan berjalan.",
        },
        {
          id: openRiskId,
        },
      );
    }
  }, [searchParams, onOpen]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Evaluasi Risiko"
        description="Penentuan strategi penanganan dan prioritas risiko. Evaluasi yang ditampilkan hanya 1 evaluasi aktif terakhir per risiko"
        showAction={true}
        icon={IconChartPie2}
        action={
          <>
            <Button
              variant={"secondary"}
              onClick={() =>
                onOpen(
                  "addEditEvaluasiRisiko",
                  {
                    title: "Tambah Evaluasi Resiko Baru",
                    message: <>Tambahkan evaluasi untuk risiko yang aktif.</>,
                  },
                  {
                    evaluasiRisikoDatas: data,
                  },
                )
              }
            >
              Tambah Evaluasi Risiko
            </Button>
          </>
        }
      />
      <div className="space-y-6">
        <EvaluasiRisikoStats stats={evaluasiRisikoStats} />
        <DataTable
          variant="general"
          columns={columns}
          data={data!}
          filterKey="nama_resiko"
          filterName="Risiko"
        />
      </div>
    </div>
  );
};

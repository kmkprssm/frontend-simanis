"use client";

import * as React from "react";

import { IconEdit, IconHistory } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import { TEvaluasiRisiko } from "@/types/evaluasi-risiko-type";
import { getEvaluasiRisikoByRiskId } from "@/server/apis/evaluasi-risiko";
import { Loader } from "../ui/loader";
import { EvaluasiRisikoHistory } from "./evaluasi-risiko-history";
import { CustomTooltip } from "../custom-tooltip";

interface CellActionsProps {
  data: TEvaluasiRisiko;
}

export const CellActions = ({ data }: CellActionsProps) => {
  const { onOpen } = useModalStore();

  const [loading, setLoading] = React.useState(false);

  const handleOpenHistory = async () => {
    setLoading(true);
    try {
      const response = await getEvaluasiRisikoByRiskId(data.risk_id);

      if ("error" in response && response.error) {
        toast.error(response.error);
        return;
      }

      onOpen(
        "detail",
        {
          title: "Riwayat Evaluasi Risiko",
          message:
            "Informasi lengkap mengenai analisis risiko dari risiko yang telah dipilih.",
          childrenDetail: <EvaluasiRisikoHistory data={response} />,
        },
        {
          riwayatEvaluasiRisikoData: response as TEvaluasiRisiko[],
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat riwayat historis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {data.status_risiko !== "Closed" && (
        <CustomTooltip
          align="center"
          side="top"
          tooltipContent={<>Edit Evaluasi Risiko</>}
        >
          <Button
            variant={"edit"}
            size={"icon"}
            onClick={() =>
              onOpen(
                "addEditEvaluasiRisiko",
                {
                  title: "Update Evaluasi Risiko",
                  message: (
                    <>
                      Perbarui evaluasi risiko jika ada perubahan strategi
                      maupun prioritas
                    </>
                  ),
                },
                {
                  evaluasiRisikoData: data,
                },
              )
            }
          >
            <IconEdit stroke={2} />{" "}
          </Button>
        </CustomTooltip>
      )}
      <Button
        variant="primary"
        size="sm"
        className="gap-1.5"
        disabled={loading}
        onClick={handleOpenHistory}
      >
        {loading ? <Loader /> : <IconHistory className="h-4 w-4" stroke={2} />}
        <span>Riwayat</span>
      </Button>
    </div>
  );
};

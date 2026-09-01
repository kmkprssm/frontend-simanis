"use client";

import * as React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExtendedUser } from "@/next-auth";
import { usePengendalian } from "@/hooks/usePengendalian";
import { PengendalianRisikoDetail } from "./pengendalian-risiko-detail";
import { SelectInfiniteRisikoForm } from "../select-infinite-risiko-form";
import { PageHeader } from "../page-header";
import { IconSettingsSearch } from "@tabler/icons-react";

interface PengendalianRisikoProps {
  totalTreatData: number;
  userSession?: ExtendedUser;
}

export const PengendalianRisiko = ({
  totalTreatData,
  userSession,
}: PengendalianRisikoProps) => {
  const [selectedRisiko, setSelectedRisiko] = React.useState<string>("");
  const token = userSession?.token as string;

  const {
    kontrol,
    summary,
    risikoDetail,
    loading,
    loadActions,
    calculatingId,
    calculatedIds,
    handleHitungEfektivitas,
    clearData,
  } = usePengendalian(selectedRisiko, token);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Efektivitas Pengendalian Risiko"
        description="Penilaian kontrol dan residual"
        showAction={false}
        icon={IconSettingsSearch}
      />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Risiko Aktif Dengan Strategi Mitigasi</CardTitle>
          <CardDescription>
            {totalTreatData} risiko memerlukan pengendalian
          </CardDescription>
          <CardAction>
            <SelectInfiniteRisikoForm
              mode="pengendalian_risiko"
              value={selectedRisiko}
              onChange={(newValue) => {
                setSelectedRisiko(newValue);
                if (!newValue) {
                  clearData();
                }
              }}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <PengendalianRisikoDetail
            selectedRisikoId={selectedRisiko}
            kontrol={kontrol}
            risikoDetail={risikoDetail}
            summary={summary}
            loading={loading}
            calculatingId={calculatingId}
            calculatedIds={calculatedIds}
            onHitung={handleHitungEfektivitas}
            loadActions={loadActions}
          />
        </CardContent>
      </Card>
    </div>
  );
};

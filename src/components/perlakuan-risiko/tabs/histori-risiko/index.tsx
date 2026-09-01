"use client";

import { IconInfoCircleFilled } from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { TRisikoAktifMitigasiItem } from "@/types/perlakuan-risiko-type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface HistoriRisikoTabProps {
  data: TRisikoAktifMitigasiItem[];
  closeRiskCount: number;
}

export const HistoriRisikoTab = ({
  data,
  closeRiskCount,
}: HistoriRisikoTabProps) => {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>Daftar Risiko yang Telah Ditutup</CardTitle>
        <CardDescription>
          <Alert
            variant="default"
            className="mb-4 animate-[pulseShadow_3s_infinite_ease-in-out] rounded-xl border-indigo-200 bg-indigo-50 text-indigo-900 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 rounded-lg border border-indigo-200 bg-indigo-100 p-1.5 text-indigo-600">
                <IconInfoCircleFilled className="h-5 w-5 animate-pulse" />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <AlertTitle className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-red-900">
                  Informasi Histori Risiko
                </AlertTitle>
                <AlertDescription className="text-xs leading-relaxed font-normal text-indigo-700">
                  Data pada tab ini adalah risiko yang telah{" "}
                  <strong>ditutup berdasarkan evaluasi nilai residual</strong>{" "}
                  di menu Pengendalian Risiko. Status penutupan risiko{" "}
                  <strong>tidak bergantung pada status action plan</strong>.{" "}
                  <br />
                  <strong>Mode Read Only:</strong> kontrol & Action plan tidak
                  dapat diubah karena risiko telah ditutup.
                </AlertDescription>
              </div>
            </div>

            <style jsx global>{`
              @keyframes pulseShadow {
                0% {
                  box-shadow: 0 1px 2px 0 rgba(220, 38, 38, 0.05);
                }
                50% {
                  box-shadow: 0 4px 12px 0 rgba(220, 38, 38, 0.12);
                  border-color: rgba(220, 38, 38, 0.3);
                }
                100% {
                  box-shadow: 0 1px 2px 0 rgba(220, 38, 38, 0.05);
                }
              }
            `}</style>
          </Alert>
        </CardDescription>
        <CardAction>
          <Badge variant={"secondary"}>
            {closeRiskCount} risiko telah ditutup berdasarkan evaluasi nilai
            residual
          </Badge>
        </CardAction>
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

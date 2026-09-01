"use client";

import {
  IconActivity,
  IconCircleCheck,
  IconCircleDot,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { getActionStatusInfo, getTipeBadgeColor } from "@/helpers/risk-helpers";
import { cn, dateFormat } from "@/lib/utils";
import { TDetailPemantauanRisiko } from "@/types/pemantauan-risiko-type";
import { Loader } from "@/components/ui/loader";

interface DetailMitigasiProps {
  data: TDetailPemantauanRisiko;
  loading: boolean;
}

export const DetailMitigasi = ({ data, loading }: DetailMitigasiProps) => {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 p-6 text-xs text-slate-500">
        <Loader /> <span>Memuat instrumen mitigasi...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4 p-6 py-3">
      <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
        Daftar Kontrol Pengendalian
      </h4>
      {data.list_kontrol?.length === 0 ? (
        <p className="rounded-xl border border-dashed py-4 text-center text-xs text-slate-400 italic">
          Belum ada struktur kontrol yang didefinisikan.
        </p>
      ) : (
        data.list_kontrol?.map((kontrol) => (
          <div
            key={kontrol.id}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  <h5 className="text-sm font-bold text-slate-800">
                    {kontrol.nama_kontrol}
                  </h5>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-md border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase shadow-2xs",
                      getTipeBadgeColor(kontrol.tipe),
                    )}
                  >
                    {kontrol.tipe}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Deskripsi:{" "}
                  <span className="font-medium">{kontrol.deskripsi}</span>
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-slate-50 text-[10px] font-medium"
              >
                {dateFormat(kontrol.created_at)}
              </Badge>
            </div>

            <div className="space-y-2 border-l-2 border-slate-100 pl-4">
              <p className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <IconActivity size={12} /> Tindakan Mitigasi:
              </p>
              {kontrol.actions?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Tidak ada sub-aksi aktivitas.
                </p>
              ) : (
                kontrol.actions?.map((action) => {
                  const statusInfo = getActionStatusInfo(
                    action.status,
                    action.target_date,
                  );
                  return (
                    <div
                      key={action.id}
                      className="flex items-start justify-between gap-4 rounded-lg bg-slate-50/60 p-2.5 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700">
                          {action.action_plan}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          PIC: {action.pic_name || "Internal Unit"}
                        </p>
                      </div>
                      <Badge
                        className={`text-[10px] ${
                          statusInfo.isClosed
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : statusInfo.isOnProgress
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {statusInfo.isClosed ? (
                          <IconCircleCheck size={12} className="mr-1 inline" />
                        ) : (
                          <IconCircleDot size={12} className="mr-1 inline" />
                        )}
                        {action.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

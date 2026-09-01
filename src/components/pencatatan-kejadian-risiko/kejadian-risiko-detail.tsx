"use client";

import * as React from "react";
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconEdit,
  IconHelpHexagon,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { dateFormat } from "@/lib/utils";
import {
  TDataBulan,
  TKejadianRisikoDetail,
  TGroupedKejadianData,
  TGroupedInsidenItem,
} from "@/types/pencatatan-kejadian-risiko-type";
import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";

interface KejadianRisikoDetailProps {
  dataBulanDetail: TDataBulan;
}

export const KejadianRisikoDetail = ({
  dataBulanDetail,
}: KejadianRisikoDetailProps) => {
  const { onOpen } = useModalStore();

  // 🌟 Strongly-typed useMemo Grouping Data
  const groupedData = React.useMemo<TGroupedKejadianData>(() => {
    if (!dataBulanDetail?.detail) return { insiden: {}, nihil: [] };

    const insidenGroups: Record<string, TGroupedInsidenItem> = {};
    const nihilList: TKejadianRisikoDetail[] = [];

    dataBulanDetail.detail.forEach((item: TKejadianRisikoDetail) => {
      if (item.is_nihil) {
        nihilList.push(item);
      } else {
        const currentRiskId = item.risk_id;
        if (!insidenGroups[currentRiskId]) {
          insidenGroups[currentRiskId] = {
            nama_resiko: item.nama_resiko,
            skor_risiko: item.skor_risiko,
            status_utama_risiko: item.status_utama_risiko,
            list_insiden: [],
          };
        }
        insidenGroups[currentRiskId].list_insiden.push(item);
      }
    });

    return { insiden: insidenGroups, nihil: nihilList };
  }, [dataBulanDetail]);

  if (!dataBulanDetail) return null;
  const { log_master } = dataBulanDetail;

  const hasNihilData = groupedData.nihil.length > 0;
  const hasInsidenData = Object.keys(groupedData.insiden).length > 0;

  return (
    <div className="space-y-5 p-6 py-2">
      {/* 🟢 SEKSYEN A: DAFTAR RISIKO YANG DINYATAKAN NIHIL */}
      {hasNihilData && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-1">
            <IconCircleCheck className="h-4 w-4 text-emerald-600" />
            <h5 className="text-xs font-bold tracking-wide text-emerald-800 uppercase">
              Risiko Terkonfirmasi Nihil / Aman
            </h5>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {groupedData.nihil.map((item: TKejadianRisikoDetail) => (
              <div
                key={item.kejadian_id}
                className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-3.5 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h6 className="leading-tight font-bold text-slate-800">
                      {item.nama_resiko}
                    </h6>
                    <p className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <IconInfoCircle size={12} className="text-emerald-600" />
                      Evaluasi Kendali:{" "}
                      <span className="text-slate-600 italic">
                        {item.keterangan_nihil || "Tidak ada catatan tambahan"}
                      </span>
                    </p>
                  </div>
                  <Badge className="border-emerald-200 bg-emerald-100/60 text-[10px] font-bold text-emerald-700 uppercase shadow-none">
                    Aman
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasInsidenData && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-1 pt-2">
            <IconAlertTriangle className="h-4 w-4 text-rose-500" />
            <h5 className="text-xs font-bold tracking-wide text-rose-800 uppercase">
              Daftar Insiden Kebobolan Risiko
            </h5>
          </div>

          {Object.values(groupedData.insiden).map(
            (group: TGroupedInsidenItem, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"
              >
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                  <div className="space-y-0.5">
                    <h4 className="text-sm leading-snug font-bold text-slate-900">
                      {group.nama_resiko}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Status Utama:{" "}
                      <span className="font-semibold text-blue-600">
                        {group.status_utama_risiko}
                      </span>
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 bg-rose-100 text-[10px] font-bold text-rose-700"
                  >
                    {group.list_insiden.length} Insiden
                  </Badge>
                </div>

                <div className="divide-y divide-slate-100">
                  {group.list_insiden.map((insiden: TKejadianRisikoDetail) => (
                    <div
                      key={insiden.kejadian_id}
                      className="space-y-2 p-4 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-dashed border-slate-100 pb-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <IconCalendarEvent className="h-4 w-4 text-slate-400" />
                          <span>
                            Tanggal Kejadian:{" "}
                            {dateFormat(new Date(insiden.tanggal_kejadian))}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 px-2 text-[11px] font-bold text-amber-600 hover:bg-amber-50"
                          onClick={() =>
                            onOpen(
                              "addEditKejadianRisiko",
                              {},
                              {
                                logMasterData: log_master,
                                dataBulanDetail: insiden,
                              },
                            )
                          }
                        >
                          <IconEdit className="h-3.5 w-3.5" /> Koreksi Data
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
                          <span className="mb-0.5 flex items-center gap-1 font-bold text-slate-800">
                            <IconHelpHexagon className="h-3.5 w-3.5 text-slate-500" />{" "}
                            Sebab Kejadian:
                          </span>
                          <p className="leading-relaxed whitespace-pre-wrap text-slate-600">
                            {insiden.sebab_saat_ini}
                          </p>
                        </div>
                        <div className="rounded-lg border border-rose-100/40 bg-rose-50/20 p-2.5">
                          <span className="mb-0.5 flex items-center gap-1 font-bold text-rose-950">
                            <IconAlertTriangle className="h-3.5 w-3.5 text-rose-500" />{" "}
                            Dampak Riil:
                          </span>
                          <p className="leading-relaxed whitespace-pre-wrap text-slate-600">
                            {insiden.dampak_riil}
                          </p>
                        </div>
                      </div>
                      {insiden.tindakan_lanjutan && (
                        <div className="mt-2 rounded-lg border border-blue-100/70 bg-blue-50/20 p-2.5">
                          <span className="mb-0.5 block font-bold text-blue-950">
                            Tindakan Lanjutan / Mitigasi Instan:
                          </span>
                          <p className="leading-relaxed whitespace-pre-wrap text-slate-600">
                            {insiden.tindakan_lanjutan}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {!hasNihilData && !hasInsidenData && (
        <div className="p-6 text-center text-sm font-medium text-slate-500">
          Belum ada rekaman laporan bulanan yang terisi.
        </div>
      )}
    </div>
  );
};

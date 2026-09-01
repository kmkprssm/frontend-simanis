"use client";

import {
  IconCalendarEvent,
  IconUser,
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";
import * as React from "react";

import { Loader } from "@/components/ui/loader";
import { getNamaBulanIndo } from "@/helpers/risk-helpers";
import { dateFormat } from "@/lib/utils";
import { TDetailKejadianRisiko } from "@/types/pemantauan-risiko-type";
import { Badge } from "@/components/ui/badge";
import { TKejadianRisikoDetailInCurrentMonth } from "@/types/pencatatan-kejadian-risiko-type";

interface DetailKejadianRisikoProps {
  data: TDetailKejadianRisiko;
  loading: boolean;
}

export const DetailKejadianRisiko = ({
  data,
  loading,
}: DetailKejadianRisikoProps) => {
  const { insidenList, nihilList } = React.useMemo(() => {
    if (!data?.detail) return { insidenList: [], nihilList: [] };

    return data.detail.reduce(
      (acc, item) => {
        if (item.is_nihil) {
          acc.nihilList.push(item);
        } else {
          acc.insidenList.push(item);
        }
        return acc;
      },
      {
        insidenList: [] as TKejadianRisikoDetailInCurrentMonth[],
        nihilList: [] as TKejadianRisikoDetailInCurrentMonth[],
      },
    );
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 p-6 text-xs text-slate-500">
        <Loader /> <span>Memetakan kejadian riil...</span>
      </div>
    );
  }

  if (!data || data.detail?.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 italic">
        Tidak ada rincian laporan kejadian atau nihil di tahun ini.
      </div>
    );
  }

  const hasNihilData = nihilList.length > 0;
  const hasInsidenData = insidenList.length > 0;

  return (
    <div className="space-y-5 p-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-700">
        <p>
          Periode Pantau: Tahun{" "}
          <strong className="font-bold">{data.tahun}</strong>
        </p>
        <p>
          Total Frekuensi Insiden:{" "}
          <strong className="text-sm font-extrabold text-rose-600">
            {data.jumlah_kejadian} Kali
          </strong>
        </p>
      </div>

      {hasNihilData && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-1">
            <IconCircleCheck className="h-4 w-4 text-emerald-600" />
            <h5 className="text-xs font-bold tracking-wide text-emerald-800 uppercase">
              Risiko Terkonfirmasi Nihil / Aman
            </h5>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {nihilList.map((item) => (
              <div
                key={item.kejadian_id}
                className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-3.5 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-emerald-100/60 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        Bulan {getNamaBulanIndo(item.bulan)}
                      </span>
                    </div>
                    <p className="flex items-start gap-1 pt-1 text-[11px] leading-relaxed font-medium text-slate-500">
                      <IconInfoCircle
                        size={13}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <span>
                        Evaluasi Kendali:{" "}
                        <span className="font-semibold text-slate-600 italic">
                          {item.keterangan_nihil ||
                            "Tidak ada catatan tambahan"}
                        </span>
                      </span>
                    </p>
                  </div>
                  <Badge className="shrink-0 border-emerald-200 bg-emerald-100/60 text-[10px] font-bold text-emerald-700 uppercase shadow-none">
                    Aman
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasInsidenData && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 px-1">
            <IconAlertTriangle className="h-4 w-4 text-rose-500" />
            <h5 className="text-xs font-bold tracking-wide text-rose-800 uppercase">
              Rincian Riwayat Insiden Kebobolan
            </h5>
          </div>

          <div className="space-y-3">
            {insidenList.map((insiden) => (
              <div
                key={insiden.kejadian_id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"
              >
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 px-4 py-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <IconCalendarEvent size={14} className="text-slate-400" />
                    <span>
                      Tanggal: {dateFormat(insiden.tanggal_kejadian)} (
                      {getNamaBulanIndo(insiden.bulan)})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <IconUser size={12} />
                    <span>
                      Pelapor:{" "}
                      <strong className="font-semibold text-slate-500">
                        {insiden.pelapor || "System"}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 p-3.5 text-xs md:grid-cols-2">
                  <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-2.5 leading-relaxed">
                    <span className="mb-0.5 block text-[11px] font-bold text-slate-800">
                      Sebab Kejadian Saat Ini:
                    </span>
                    <p className="text-[11px] whitespace-pre-wrap text-slate-600">
                      {insiden.sebab_saat_ini || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-rose-100/40 bg-rose-50/20 p-2.5 leading-relaxed">
                    <span className="mb-0.5 block text-[11px] font-bold text-rose-950">
                      Dampak Riil yang Terjadi:
                    </span>
                    <p className="text-[11px] whitespace-pre-wrap text-slate-600">
                      {insiden.dampak_riil || "-"}
                    </p>
                  </div>
                </div>

                {insiden.tindakan_lanjutan && (
                  <div className="mx-3.5 mb-3.5 rounded-lg border border-blue-100/70 bg-blue-50/20 p-2.5 text-[11px]">
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
      )}
    </div>
  );
};

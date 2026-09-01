"use client";

import React, { useState } from "react";
import {
  IconAlertTriangle,
  IconCheck,
  IconFileSpreadsheet,
  IconFileTypePdf,
  IconFolderOff,
  IconInfoCircle,
  IconLoader2,
  IconReportMedical,
} from "@tabler/icons-react";

import { useQueryKejadianRisiko } from "@/hooks/use-query-kejadian-risiko";
import { TDataBulan } from "@/types/pencatatan-kejadian-risiko-type";
import { getNamaBulanIndo } from "@/helpers/risk-helpers";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExtendedUser } from "@/next-auth";
import CONST from "@/lib/constants";
import { FilterTahunKejadianRisiko } from "@/components/filter-tahun-kejadian-risiko";

interface LaporanKejadianRisikoTabProps {
  session?: ExtendedUser;
}

export const LaporanKejadianRisikoTab = ({
  session,
}: LaporanKejadianRisikoTabProps) => {
  const [tahunFilter, setTahunFilter] = useState<number>(
    new Date().getFullYear(),
  );

  const [loadingPDF, setLoadingPDF] = React.useState<Record<number, boolean>>(
    {},
  );
  const [loadingExcel, setLoadingExcel] = React.useState<
    Record<number, boolean>
  >({});

  const { data, status, isFetching, refetch } = useQueryKejadianRisiko({
    tahun: tahunFilter,
  });

  const transformDataTahunan = (): TDataBulan[] => {
    const tahunKey = tahunFilter.toString();
    if (data && data[tahunKey]) {
      return Object.keys(data[tahunKey])
        .map((key) => data[tahunKey][parseInt(key)])
        .sort((a, b) => a.log_master.bulan - b.log_master.bulan);
    }

    return Array.from({ length: 12 }, (_, i) => ({
      log_master: {
        tahun: tahunFilter,
        bulan: i + 1,
        status_laporan: "BELUM_DIISI" as const,
        reported_by: null,
        reported_at: null,
        pelapor: null,
      },
      jumlah_kejadian: 0,
      detail: [],
    }));
  };

  const listBulanData = transformDataTahunan();
  const currentYear = new Date().getFullYear();
  const listTahunOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleDownloadPDF = async (bulan: number) => {
    setLoadingPDF((prev) => ({ ...prev, [bulan]: true }));
    try {
      const response = await fetch(
        `${CONST.API_BASE_URL}/reports/kejadian/pdf?tahun=${tahunFilter}&bulan=${bulan}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session?.token}` },
        },
      );

      if (!response.ok) throw new Error("Gagal mengunduh berkas PDF.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-kejadian-risiko-${tahunFilter}-${bulan}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Gagal mengunduh dokumen PDF: " + err.message);
    } finally {
      setLoadingPDF((prev) => ({ ...prev, [bulan]: false }));
    }
  };

  const handleDownloadExcel = async (bulan: number) => {
    setLoadingExcel((prev) => ({ ...prev, [bulan]: true }));
    try {
      const response = await fetch(
        `${CONST.API_BASE_URL}/reports/kejadian/excel?tahun=${tahunFilter}&bulan=${bulan}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session?.token}` },
        },
      );

      if (!response.ok) throw new Error("Gagal mengunduh berkas Excel.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-kejadian-risiko-${tahunFilter}-${bulan}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Gagal mengunduh dokumen Excel: " + err.message);
    } finally {
      setLoadingExcel((prev) => ({ ...prev, [bulan]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-800">
            Arsip Pelaporan Bulanan
          </h3>
          <p className="text-xs text-slate-500">
            Unduh berkas rekapitulasi kejadian riil organisasi per periode
            bulan.
          </p>
        </div>

        <FilterTahunKejadianRisiko
          tahunFilter={tahunFilter}
          setTahunFilter={setTahunFilter}
          listTahunOptions={listTahunOptions}
          refetch={refetch}
          isFetching={isFetching}
          loading={status === "pending"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listBulanData.map((item) => {
          const { bulan, status_laporan } = item.log_master;
          const { jumlah_kejadian, detail = [] } = item;
          const namaBulan = getNamaBulanIndo(bulan);

          const totalRisikoDiterbitkan = detail.length;
          const risikoNihilCount = detail.filter(
            (d) => d.is_nihil === true,
          ).length;
          const risikoTerjadiCount = totalRisikoDiterbitkan - risikoNihilCount;

          const isBelumDiisi = status_laporan === "BELUM_DIISI";

          const isNihilMutlak =
            !isBelumDiisi &&
            (status_laporan === "NIHIL" ||
              (risikoNihilCount > 0 &&
                risikoTerjadiCount === 0 &&
                jumlah_kejadian === 0));

          const isKombinasi =
            !isBelumDiisi &&
            !isNihilMutlak &&
            risikoNihilCount > 0 &&
            risikoTerjadiCount > 0;

          console.log({
            jumlah_kejadian,
            isKombinasi,
            isBelumDiisi,
            isNihilMutlak,
            risikoNihilCount,
            risikoTerjadiCount,
          });

          const isFullKejadian =
            !isBelumDiisi &&
            !isNihilMutlak &&
            status_laporan === "TERJADI_RISIKO" &&
            risikoNihilCount === 0;

          const canDownload = !isBelumDiisi;

          return (
            <Card
              key={bulan}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden border-slate-100 pt-2 pb-0 shadow-2xs transition-all duration-200 hover:border-slate-200/80 hover:shadow-xs",
                isNihilMutlak && "bg-slate-50/40",
                isFullKejadian && "border-rose-100 bg-rose-50/5",
                isKombinasi && "border-amber-100 bg-amber-50/5",
              )}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-blue-600">
                    {namaBulan}
                  </span>

                  {isBelumDiisi && (
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-400 shadow-none"
                    >
                      Belum Diisi
                    </Badge>
                  )}
                  {isNihilMutlak && (
                    <Badge className="border-emerald-100 bg-emerald-50 text-[10px] font-semibold text-emerald-700 shadow-none">
                      Nihil Laporan
                    </Badge>
                  )}
                  {isFullKejadian && (
                    <Badge className="border-rose-100 bg-rose-50 text-[10px] font-bold text-rose-700 shadow-none">
                      {jumlah_kejadian} Kejadian
                    </Badge>
                  )}
                  {isKombinasi && (
                    <Badge className="border-amber-100 bg-amber-50 text-[10px] font-bold text-amber-700 shadow-none">
                      Kombinasi ({jumlah_kejadian} Kasus)
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4 pt-2">
                <div
                  className={cn(
                    "shadow-3xs flex min-h-16 items-center rounded-lg border p-2.5 text-xs",
                    isBelumDiisi && "border-slate-100 bg-white",
                    isNihilMutlak && "border-emerald-100/50 bg-emerald-50/10",
                    isFullKejadian && "border-rose-100/60 bg-white",
                    isKombinasi && "border-amber-100/60 bg-white",
                  )}
                >
                  {isBelumDiisi && (
                    <p className="flex items-center gap-1.5 text-slate-400 italic">
                      <IconFolderOff
                        size={14}
                        className="shrink-0 text-slate-300"
                      />
                      Data laporan belum tersedia.
                    </p>
                  )}
                  {isNihilMutlak && (
                    <p className="flex items-center gap-1.5 leading-relaxed font-medium text-emerald-700">
                      <IconCheck
                        size={14}
                        className="shrink-0 text-emerald-500"
                      />
                      Seluruh master risiko aman (0 kasus kejadian).
                    </p>
                  )}
                  {isFullKejadian && (
                    <p className="flex items-start gap-1.5 leading-normal font-medium text-rose-950">
                      <IconAlertTriangle
                        size={14}
                        className="mt-0.5 shrink-0 text-rose-500"
                      />
                      Teridentifikasi {jumlah_kejadian} kejadian aktual pada
                      semua daftar risiko utama.
                    </p>
                  )}

                  {isKombinasi && (
                    <div className="space-y-1 font-medium text-slate-700">
                      <div className="flex items-center gap-1.5 text-amber-800">
                        <IconReportMedical
                          size={14}
                          className="shrink-0 text-amber-500"
                        />
                        <span>Ikhtisar Rekapitulasi:</span>
                      </div>
                      <p className="text-muted-foreground pl-5 text-[11px] leading-normal">
                        Terdapat{" "}
                        <strong className="text-rose-600">
                          {risikoTerjadiCount} Risiko Kejadian
                        </strong>{" "}
                        dan{" "}
                        <strong className="text-emerald-600">
                          {risikoNihilCount} Risiko Nihil
                        </strong>{" "}
                        pada bulan ini.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 p-3">
                {canDownload ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingPDF[bulan] || !session?.token}
                      onClick={() => handleDownloadPDF(bulan)}
                      className="shadow-3xs h-8 flex-1 border-slate-200 bg-white text-xs font-semibold text-red-700 hover:bg-red-50 hover:text-red-800"
                    >
                      {loadingPDF[bulan] ? (
                        <IconLoader2 size={13} className="animate-spin" />
                      ) : (
                        <>
                          <IconFileTypePdf size={14} />
                          <span>PDF</span>
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingExcel[bulan] || !session?.token}
                      onClick={() => handleDownloadExcel(bulan)}
                      className="shadow-3xs h-8 flex-1 border-slate-200 bg-white text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {loadingExcel[bulan] ? (
                        <IconLoader2 size={13} className="animate-spin" />
                      ) : (
                        <>
                          <IconFileSpreadsheet size={14} />
                          <span>Excel</span>
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex w-full items-center justify-center gap-1 py-1 text-[10px] font-medium text-slate-400 italic">
                    <IconInfoCircle size={12} className="text-slate-300" />
                    Dokumen cetak belum siap terbit
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

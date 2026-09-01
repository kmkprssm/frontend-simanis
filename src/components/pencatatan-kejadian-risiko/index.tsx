"use client";

import React, { useState } from "react";
import { IconSubtitlesEdit } from "@tabler/icons-react";

import { useQueryKejadianRisiko } from "@/hooks/use-query-kejadian-risiko";
import { columns } from "./columns";
import { TDataBulan } from "@/types/pencatatan-kejadian-risiko-type";

import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/ui/data-table";
import { TableSkeleton } from "../table-skeleton";

export const PencatatanKejadianRisiko = () => {
  const [tahunFilter, setTahunFilter] = useState<number>(
    new Date().getFullYear(),
  );
 
  const { data, status, isFetching, refetch, error } = useQueryKejadianRisiko({
    tahun: tahunFilter,
  });

  const transformDataTabel = (): TDataBulan[] => {
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

  const rowsDataForTable = transformDataTabel();
  const isLoading = status === "pending" || (isFetching && !data);

  const currentYear = new Date().getFullYear();
  const listTahunOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <>
      <PageHeader
        title="Pencatatan Kejadian Risiko"
        description="Catat setiap kejadian risiko yang terjadi ataupun tidak pada setiap bulan dan tahun berjalan"
        showAction={false}
        icon={IconSubtitlesEdit}
      />

      <div className="mt-6 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
        {error ? (
          <div className="p-6 text-center text-sm font-medium text-rose-500">
            Gagal memuat data dari server: {error.message}
          </div>
        ) : isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            variant="kejadian"
            columns={columns}
            data={rowsDataForTable}
            loading={isLoading}
            filterKey="status_laporan"
            filterName="Status"
            showFilterKejadian={true}
            listTahunOptions={listTahunOptions}
            isFetching={isFetching}
            refetch={refetch}
            tahunFilter={tahunFilter}
            setTahunFilter={setTahunFilter}
          />
        )}
      </div>
    </>
  );
};

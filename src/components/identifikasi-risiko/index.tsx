"use client";

import * as React from "react";
import { IconShieldCheck } from "@tabler/icons-react";

import {
  TIdentifikasiRisiko,
  TIdentifikasiRisikoStats,
} from "@/types/identifikasi-risiko-type";
import { DataTable } from "../ui/data-table";
import { getColumns } from "./columns";
import { ExtendedUser } from "@/next-auth";
import { TKategoriRisiko } from "@/types/kategori-risiko-type";
import { PageHeader } from "../page-header";
import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import { IdentifikasiRisikoStats } from "./identifikasi-risiko-stats";

interface IdentifikasiRisikoProps {
  data: TIdentifikasiRisiko[] | undefined;
  userSession?: ExtendedUser;
  kategoriRisikoData?: TKategoriRisiko[];
  identifikasiRisikoStats: TIdentifikasiRisikoStats;
}

export const IdentifikasiRisiko = ({
  data,
  userSession,
  kategoriRisikoData,
  identifikasiRisikoStats,
}: IdentifikasiRisikoProps) => {
  const [selectedUnit, setSelectedUnit] = React.useState<string>("");
  const [selectedKategori, setSelectedKategori] = React.useState<string>("");
  const { onOpen } = useModalStore();

  const isAdmin = userSession?.role === "ADMIN";

  const columns = React.useMemo(
    () => getColumns(kategoriRisikoData),
    [kategoriRisikoData],
  );

  const filteredData = React.useMemo(() => {
    return data?.filter((item) => {
      const matchesUnit =
        isAdmin && selectedUnit !== ""
          ? item.created_by_uuid === selectedUnit
          : true;

      const matchesKategori =
        selectedKategori !== ""
          ? item.kategori_name === selectedKategori
          : true;

      return matchesUnit && matchesKategori;
    });
  }, [data, selectedUnit, selectedKategori, isAdmin]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Identifikasi Risiko"
        description="Pendataan dan kategorisasi risiko organisasi"
        showAction={true}
        icon={IconShieldCheck}
        action={
          <>
            {" "}
            <Button
              variant={"secondary"}
              onClick={() =>
                onOpen(
                  "addEditIdentifikasiRisiko",
                  {
                    title: "Tambah Identifikasi Risiko",
                    message: (
                      <>
                        Tuliskan risiko secara jelas, singkat, dan dapat
                        ditindaklanjuti.
                      </>
                    ),
                  },
                  {
                    kategoriRisikoData: kategoriRisikoData,
                  },
                )
              }
            >
              Tambah Risiko
            </Button>
          </>
        }
      />
      <div className="space-y-6">
        <IdentifikasiRisikoStats stats={identifikasiRisikoStats} />
        <DataTable
          variant="identifikasi"
          columns={columns}
          data={filteredData!}
          filterKey="nama_resiko"
          filterName="Risiko"
          showFilter={true}
          pageSize={10}
          setSelectedUnit={setSelectedUnit}
          setSelectedKategori={setSelectedKategori}
          filteredData={filteredData}
          kategoriRisikoData={kategoriRisikoData}
          userSession={userSession}
          selectedUnit={selectedUnit}
          selectedKategori={selectedKategori}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

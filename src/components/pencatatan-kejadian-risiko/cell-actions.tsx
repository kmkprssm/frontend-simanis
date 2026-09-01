"use client";

import {
  IconEdit,
  IconEye,
  IconPlus,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modal-store";
import { TDataBulan } from "@/types/pencatatan-kejadian-risiko-type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { KejadianRisikoDetail } from "./kejadian-risiko-detail";
import { getNamaBulanIndo } from "@/helpers/risk-helpers";

interface CellActionsProps {
  rowData: TDataBulan;
}

export const CellActions = ({ rowData }: CellActionsProps) => {
  const { onOpen } = useModalStore();
  const { status_laporan, bulan, tahun } = rowData.log_master;
  const { jumlah_kejadian } = rowData;

  const namaBulan = getNamaBulanIndo(bulan);
  const sekarang = new Date();
  const tahunSekarang = sekarang.getFullYear();
  const bulanSekarang = sekarang.getMonth() + 1;

  const isBulanBerjalan = tahun === tahunSekarang && bulan === bulanSekarang;
  const isTahunBerjalan = tahun === tahunSekarang;
  const isExpired =
    tahun < tahunSekarang || (tahun === tahunSekarang && bulan < bulanSekarang);
  const isFuture =
    tahun > tahunSekarang || (tahun === tahunSekarang && bulan > bulanSekarang);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-2">
        {/* KONDISI 1: Belum Diisi */}
        {/* {status_laporan === "BELUM_DIISI" && (
          <>
            {isBulanBerjalan ? (
              <Button
                variant="default"
                size="sm"
                className="h-8 border-none bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                onClick={() =>
                  onOpen(
                    "konfirmasiStatusBulanan",
                    { title: "Apakah ada kejadian risiko di bulan ini?" },
                    { logMasterData: rowData.log_master },
                  )
                }
              >
                Isi Laporan Bulanan
              </Button>
            ) : isExpired ? (
              <span className="rounded border border-rose-100 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-500">
                Laporan Terkunci (Melewati Batas)
              </span>
            ) : (
              <span className="text-muted-foreground rounded border border-slate-100 bg-slate-50 px-2 py-1 text-xs font-medium italic">
                Belum saatnya mengisi laporan
              </span>
            )}
          </>
        )} */}

        {status_laporan === "BELUM_DIISI" && (
          <>
            {!isFuture && isTahunBerjalan ? (
              <Button
                variant="default"
                size="sm"
                className="h-8 border-none bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                onClick={() =>
                  onOpen(
                    "konfirmasiStatusBulanan",
                    { title: "Apakah ada kejadian risiko di bulan ini?" },
                    { logMasterData: rowData.log_master },
                  )
                }
              >
                Isi Laporan Bulanan
              </Button>
            ) : !isTahunBerjalan ? (
              <span className="rounded border border-rose-100 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-500">
                Laporan Terkunci (Melewati Batas)
              </span>
            ) : (
              <span className="text-muted-foreground rounded border border-slate-100 bg-slate-50 px-2 py-1 text-xs font-medium italic">
                Belum saatnya mengisi laporan
              </span>
            )}
          </>
        )}

        {/* KONDISI 2: Sudah diisi -> Tombol Lihat Detail (Aktif jika ada insiden atau Nihil) */}
        {status_laporan !== "BELUM_DIISI" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() =>
                  onOpen("detail", {
                    title: "Detail Kejadian Risiko",
                    message: (
                      <>
                        Periode:{" "}
                        <span className="font-semibold text-slate-700">
                          {namaBulan} {tahun}
                        </span>{" "}
                        ({jumlah_kejadian} Kejadian)
                      </>
                    ),
                    childrenDetail: (
                      <KejadianRisikoDetail dataBulanDetail={rowData} />
                    ),
                  })
                }
              >
                <IconEye className="h-4 w-4 text-slate-600" />
                <span className="ml-1.5 hidden sm:inline">Lihat Detail</span>
                {jumlah_kejadian > 0 && (
                  <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {jumlah_kejadian}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Lihat Log dan Riwayat Detil Kejadian
            </TooltipContent>
          </Tooltip>
        )}

        {/* KONDISI 3: Terjadi Risiko -> Tombol Tambah Kejadian Ekstra */}
        {(status_laporan === "TERJADI_RISIKO" ||
          status_laporan === "NIHIL") && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="sm"
                    // disabled={isExpired}
                    className="h-8 border-rose-200 bg-rose-50/40 px-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() =>
                      onOpen(
                        "addEditKejadianRisiko",
                        {},
                        { logMasterData: rowData.log_master },
                      )
                    }
                  >
                    <IconPlus className="h-4 w-4 text-rose-600" />
                    <span className="ml-1.5 hidden sm:inline">
                      Tambah Kejadian
                    </span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {/* {isExpired
                ? "Bulan laporan sudah terkunci"
                : "Laporkan kejadian risiko baru di bulan ini"} */}
                Laporkan kejadian risiko baru di bulan ini
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-emerald-200 bg-emerald-50/40 px-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    onClick={() =>
                      onOpen(
                        "konfirmasiStatusBulanan",
                        { forceViewMode: "INPUT_NIHIL" },
                        { logMasterData: rowData.log_master },
                      )
                    }
                  >
                    <IconShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="ml-1.5 hidden sm:inline">
                      Tambah Nihil Kejadian
                    </span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Validasi NIHIL kejadian untuk risiko lain di bulan ini
              </TooltipContent>
            </Tooltip>
          </>
        )}

        {/* KONDISI KOREKSI: Sudah Nihil/Terjadi tapi masih dalam bulan berjalan */}
        {/* {status_laporan !== "BELUM_DIISI" && !isExpired && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                // onClick={() => onOpen("konfirmasiStatusBulanan", { title: "Ubah Status Laporan Bulanan" }, { logMasterData: rowData.log_master })}
              >
                <IconEdit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ubah Status Laporan Bulanan</TooltipContent>
          </Tooltip>
        )} */}
      </div>
    </TooltipProvider>
  );
};

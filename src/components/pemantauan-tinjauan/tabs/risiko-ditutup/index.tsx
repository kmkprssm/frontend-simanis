"use client";

import * as React from "react";
import {
  IconClock,
  IconEye,
  IconTag,
  IconUser,
  IconArchive,
  IconSort09,
  IconSort90,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInfiniteRisks } from "@/hooks/use-infinite-risks";
import { dateFormat } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import {
  normalizeStrategi,
  STRATEGI_CONFIG,
  PRIORITAS_CONFIG,
  getRiskLevel,
} from "@/helpers/risk-helpers";
import { getDetailMonitoringRisiko } from "@/server/apis/risiko";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modal-store";
import { DetailMitigasi } from "../risiko-aktif/detail-mitigasi";

export const RisikoDitutupTab = () => {
  const [search, setSearch] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const { onOpen } = useModalStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
    error,
  } = useInfiniteRisks({
    type: "closed",
    search,
    limit: 6,
  });

  const risks = data?.pages.flatMap((page) => page?.risiko ?? []) ?? [];
  const totalRows = data?.pages[0]?.meta.totalRows ?? 0;
  const isInitialLoading = status === "pending" && risks.length === 0;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (
          firstEntry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          status !== "pending"
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, status]);

  const handleOpenDetailMitigasi = async (risk_id: string | undefined) => {
    setLoading(true);
    try {
      const response = await getDetailMonitoringRisiko(risk_id);

      if ("error" in response && response.error) {
        toast.error(response.error);
        return;
      }

      onOpen("detail", {
        title: "Rencana Mitigasi & Pengendalian Intern",
        message: "Pantau rincian kontrol dan sub-aksi aktivitas unit.",
        childrenDetail: <DetailMitigasi data={response} loading={loading} />,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat detail mitigasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <IconArchive className="h-5 w-5 text-slate-500" />
          <span>Arsip Risiko Tertutup</span>
        </CardTitle>
        <CardDescription>
          Riwayat penanganan manajemen risiko yang telah berhasil diselesaikan
          dan ditutup (Read-Only).
        </CardDescription>
        <CardAction>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari arsip risiko..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-500/10 focus:outline-none"
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {/* Error State */}
        {isError && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
            <p className="text-sm font-semibold">Gagal memuat arsip</p>
            <p className="mt-1 text-xs opacity-80">
              {error?.message ||
                "Terjadi kesalahan sistem saat menghubungi server."}
            </p>
          </div>
        )}

        {/* Empty State */}
        {risks.length === 0 && !isInitialLoading ? (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <IconArchive className="h-8 w-8 text-slate-400" />
            </div>
            <h5 className="text-lg font-semibold text-slate-700">
              Belum Ada Risiko Tertutup
            </h5>
            <p className="mt-1 text-sm text-slate-500">
              Seluruh data risiko organisasi Anda saat ini masih berada dalam
              proses penanganan aktif.
            </p>
          </div>
        ) : (
          /* Grid Cards Arsip */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {risks.map((risk) => {
              const strategiKey = normalizeStrategi(risk.strategi);
              const strategi = strategiKey
                ? STRATEGI_CONFIG[strategiKey]
                : null;
              const prioritas =
                PRIORITAS_CONFIG[
                  (risk.prioritas as keyof typeof PRIORITAS_CONFIG) || 3
                ];
              const riskLevel = getRiskLevel(risk.inherent_score || 0);

              return (
                <div
                  key={risk.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:border-slate-200/80 hover:shadow-md"
                >
                  {/* Atas Card: Konten Informasi */}
                  <div className="flex-1 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge className="border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">
                          {risk.status === "Closed" && "Ditutup"}
                        </Badge>
                        {risk.inherent_score > 0 && riskLevel && (
                          <Badge
                            className={`px-2.5 py-0.5 text-xs font-medium opacity-75 ${riskLevel.badgeClass}`}
                          >
                            {riskLevel.label}
                          </Badge>
                        )}
                      </div>

                      <span
                        className="flex items-center gap-1 text-xs text-slate-400"
                        title="Tanggal Risiko Ditutup"
                      >
                        <IconClock size={14} />
                        <span>Selesai: {dateFormat(risk.closed_at)}</span>
                      </span>
                    </div>

                    {/* Judul & Deskripsi Terpotong */}
                    <h6 className="mb-2 line-clamp-2 text-base font-bold text-slate-800 transition-colors group-hover:text-slate-600">
                      {risk.nama_resiko}
                    </h6>
                    <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-500">
                      {risk.deskripsi ||
                        "Tidak ada deskripsi rinci untuk arsip risiko ini."}
                    </p>

                    {/* Kotak Informasi Khusus Alasan Penutupan (Khas Risiko Ditutup) */}
                    <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Alasan Penutupan:
                      </span>
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-600 italic">
                        {risk.close_reason ||
                          "Risiko ditutup karena mitigasi telah selesai diimplementasikan secara penuh."}
                      </p>
                    </div>

                    {/* Metadata Kategori & Penanggung Jawab */}
                    <div className="space-y-2 border-t border-slate-50 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <IconTag
                          size={14}
                          className="shrink-0 text-slate-400"
                        />
                        <span className="truncate">
                          Kategori:{" "}
                          <strong className="font-medium text-slate-700">
                            {risk.kategori_name || "-"}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <IconUser
                          size={14}
                          className="shrink-0 text-slate-400"
                        />
                        <span className="truncate">
                          Unit:{" "}
                          <strong className="font-medium text-slate-700">
                            {risk.pemilik_risiko || "Belum ada pemilik"}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <IconSort09
                          size={14}
                          className="shrink-0 text-slate-400"
                        />
                        <span className="truncate">
                          Skor Inheren:{" "}
                          <strong
                            className={`font-bold ${riskLevel.textClass}`}
                          >
                            {risk.inherent_score || 0}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <IconSort90
                          size={14}
                          className="shrink-0 text-slate-400"
                        />
                        <span className="truncate">
                          Skor Residual:{" "}
                          <strong
                            className={`font-bold ${riskLevel.textClass}`}
                          >
                            {risk.score_after || 0}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bawah Card: Footer Khusus Read-Only */}
                  <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3">
                    {/* Tampilan Riwayat Pengaturan Awal Risiko */}
                    <div className="flex items-center justify-between gap-2">
                      {strategi && prioritas ? (
                        <>
                          <div
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${strategi.badgeClass}`}
                          >
                            <strategi.icon size={12} />
                            <span>{strategi.label}</span>
                          </div>
                          <div
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-medium ${prioritas.badgeClass}`}
                          >
                            <prioritas.icon size={12} />
                            <span>{prioritas.label}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Riwayat evaluasi kosong
                        </span>
                      )}
                    </div>

                    {/* Tombol Utama Tunggal: Hanya Lihat Detail */}
                    <div className="flex items-center justify-end border-t border-slate-200/40 pt-2">
                      <Button
                        onClick={() => handleOpenDetailMitigasi(risk.id)}
                        className="w-full bg-slate-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-700 active:bg-slate-800"
                      >
                        <IconEye size={14} />
                        <span>Lihat Detail Mitigasi</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Loading / End of Data Indicator */}
        <div ref={loaderRef} className="mt-4 flex w-full justify-center py-6">
          {(isInitialLoading || isFetchingNextPage) && (
            <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
              <Loader />
              <span>Memuat arsip risiko lama...</span>
            </div>
          )}
          {!hasNextPage && risks.length > 0 && (
            <p className="text-xs text-slate-400 italic">
              Menampilkan seluruh riwayat risiko tertutup ({totalRows} data
              arsip)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

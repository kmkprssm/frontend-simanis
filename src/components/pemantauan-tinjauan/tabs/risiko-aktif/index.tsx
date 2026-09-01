"use client";

import * as React from "react";
import { useRouter } from "@bprogress/next/app";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconClock,
  IconEye,
  IconInfoCircle,
  IconReplace,
  IconShieldCheck,
  IconSort09,
  IconSort90,
  IconTag,
  IconUser,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInfiniteRisks } from "@/hooks/use-infinite-risks";
import { dateFormat } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getRiskLevel,
  getStatusRisiko,
  normalizeStrategi,
  PRIORITAS_CONFIG,
  STRATEGI_CONFIG,
} from "@/helpers/risk-helpers";
import { getDetailMonitoringRisiko } from "@/server/apis/risiko";
import { toast } from "sonner";
import { getKejadianRisikoByRiskId } from "@/server/apis/pencatatan-kejadian-risiko";
import { useModalStore } from "@/stores/modal-store";
import { DetailMitigasi } from "./detail-mitigasi";
import { DetailKejadianRisiko } from "./detail-kejadian-risiko";
import { CanModifyGuard } from "@/components/auth/permission-guard";

export const RisikoAktifTab = () => {
  const [search, setSearch] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [loadingKejadian, setLoadingKejadian] = React.useState(false);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const currentYear = new Date().getFullYear();
  // const currentMonth = new Date().getMonth() + 1;
  const { onOpen } = useModalStore();

  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
    error,
  } = useInfiniteRisks({
    type: "active",
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

  const handleOpenDetailKejadianRisiko = async (
    risk_id: string | undefined,
  ) => {
    setLoadingKejadian(true);
    try {
      const response = await getKejadianRisikoByRiskId(risk_id, currentYear);

      if ("error" in response && response.error) {
        toast.error(response.error);
        return;
      }

      onOpen("detail", {
        title: "Detail Kejadian Riil Risiko Berjalan",
        message: "Daftar insiden aktual yang terjadi pada tahun berjalan.",
        childrenDetail: (
          <DetailKejadianRisiko data={response} loading={loadingKejadian} />
        ),
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat detail mitigasi.");
    } finally {
      setLoadingKejadian(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconShieldCheck className="h-5 w-5 text-slate-500" />
          Daftar Risiko Aktif
        </CardTitle>
        <CardDescription>
          Pantau progress implementasi dan mitigasi penanganan tingkat risiko
          organisasi.
        </CardDescription>
        <CardAction>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari risiko atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {isError && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
            <p className="text-sm font-semibold">Gagal memuat data</p>
            <p className="mt-1 text-xs opacity-80">
              {error?.message || "Terjadi kesalahan sistem."}
            </p>
          </div>
        )}

        {risks.length === 0 && !isInitialLoading ? (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <IconCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <h5 className="text-lg font-semibold text-slate-800">
              Tidak Ada Risiko Aktif
            </h5>
            <p className="mt-1 text-sm text-slate-500">
              Semua risiko telah berhasil ditangani, ditutup, atau berada dalam
              status non-aktif.
            </p>
          </div>
        ) : (
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
              const statusRisiko = getStatusRisiko(risk.status);

              return (
                <div
                  key={risk.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:border-slate-200/80 hover:shadow-md"
                >
                  {/* Atas Card */}
                  <div className="flex-1 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          className="px-2.5 py-0.5 text-xs font-medium"
                          variant={statusRisiko.badgeClass}
                        >
                          {statusRisiko.label}
                        </Badge>
                        {risk.inherent_score > 0 ? (
                          <Badge
                            className={`px-2.5 py-0.5 text-xs font-semibold ${riskLevel.badgeClass}`}
                          >
                            {riskLevel.label}
                          </Badge>
                        ) : (
                          <Badge
                            variant={"secondary"}
                            className="`px-2.5 py-0.5 text-xs italic"
                          >
                            Belum dinilai
                          </Badge>
                        )}
                      </div>

                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <IconClock size={14} />
                        {dateFormat(risk.updated_at)}
                      </span>
                    </div>

                    <h6 className="mb-2 line-clamp-2 text-base font-bold text-slate-800 transition-colors group-hover:text-amber-600">
                      {risk.nama_resiko}
                    </h6>
                    <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-500">
                      {risk.deskripsi ||
                        "Tidak ada deskripsi rinci untuk risiko ini."}
                    </p>

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

                  {/* Bawah Card */}
                  <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                    {/* Baris Meta: Badges Strategi & Prioritas jika sudah ada */}
                    <div className="flex items-center justify-between gap-2">
                      {strategi && prioritas ? (
                        <>
                          <div
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${strategi.badgeClass}`}
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
                        <span className="flex items-center gap-1 text-xs text-slate-400 italic">
                          <IconInfoCircle
                            size={14}
                            className="text-amber-500"
                          />
                          Belum dievaluasi strategi & prioritas
                        </span>
                      )}
                    </div>

                    {/* 🎯 Baris Utama: Tombol Aksi UX Dinamis berdasarkan Progres Data */}
                    <div className="flex items-center justify-end border-t border-slate-200/60 pt-2">
                      {/* KONDISI 1: Belum Dilakukan Penilaian */}
                      {!risk.inherent_score || risk.inherent_score === 0 ? (
                        <CanModifyGuard>
                          <Button
                            onClick={() =>
                              router.push(`/analisis-risiko?risk_id=${risk.id}`)
                            }
                            className="w-full border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-700 shadow-sm transition-all hover:bg-amber-100/80"
                          >
                            <IconAlertCircle size={14} />
                            Lakukan Analisis Risiko
                          </Button>
                        </CanModifyGuard>
                      ) : // KONDISI 2: Sudah Dinilai tapi Belum Dievaluasi (Strategi / Prioritas kosong)
                      !risk.strategi || !risk.prioritas ? (
                        <CanModifyGuard>
                          <Button
                            onClick={() =>
                              router.push(
                                `/evaluasi-risiko?open_risk_id=${risk.id}&action=new_evaluation`,
                              )
                            }
                            className="w-full border-blue-200 bg-blue-50 px-3 py-2 text-center text-xs font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-100/80"
                          >
                            <IconReplace size={14} />
                            Isi Evaluasi Risiko
                          </Button>
                        </CanModifyGuard>
                      ) : (
                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                          <Button
                            onClick={() => handleOpenDetailMitigasi(risk.id)}
                            className="w-full bg-slate-800 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-700"
                            key={risk.id}
                          >
                            <IconEye className="h-4 w-4" stroke={2} />
                            <span>Detail Mitigasi</span>
                          </Button>

                          {risk.total_kejadian_berjalan > 0 ? (
                            <Button
                              onClick={() =>
                                handleOpenDetailKejadianRisiko(risk.id)
                              }
                              className="animate-fadeIn w-full border-rose-200 bg-rose-50 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                            >
                              <IconAlertTriangle
                                size={14}
                                className="animate-pulse text-rose-600"
                              />
                              <span>Lihat Kejadian</span>
                            </Button>
                          ) : (
                            <span className="bg-muted flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-slate-100 py-2 text-xs font-medium text-slate-400 opacity-60">
                              <IconCheck
                                size={14}
                                className="text-emerald-500"
                              />{" "}
                              Nihil Kejadian
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Target Detektor Bottom & Loading Indicator */}
        <div ref={loaderRef} className="mt-4 flex w-full justify-center py-6">
          {(isInitialLoading || isFetchingNextPage) && (
            <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
              <Loader />
              <span>Memuat data risiko selanjutnya...</span>
            </div>
          )}
          {!hasNextPage && risks.length > 0 && (
            <p className="text-xs text-slate-400 italic">
              Menampilkan semua data risiko aktif ({totalRows} data)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

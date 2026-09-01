"use client";

import * as React from "react";
import { TRisikoDetail, TSummary } from "@/hooks/usePengendalian";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconShield,
  IconAlertCircle,
  IconCalculator,
  IconEye,
  IconLockOpen,
  IconLoader2,
  IconCheck,
  IconInfoCircleFilled,
  IconLock,
  IconAlertTriangle,
  IconHelpCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal-store";
import { TindakanDetail } from "./tindakan-detail";
import {
  TKontrolRisiko,
  TRencanaAksiRisiko,
} from "@/types/perlakuan-risiko-type";
import { Alert, AlertTitle } from "../ui/alert";
import { getRiskLevel, getStatusRisiko } from "@/helpers/risk-helpers";

interface PengendalianRisikoDetailProps {
  selectedRisikoId: string;
  kontrol: TKontrolRisiko[];
  summary: TSummary | null;
  risikoDetail: TRisikoDetail | null;
  loading: boolean;
  calculatingId: string | null;
  calculatedIds: string[];
  onHitung: (id: string) => void;
  loadActions: (kontrolId: string) => Promise<TRencanaAksiRisiko[]>;
}

export function PengendalianRisikoDetail({
  selectedRisikoId,
  kontrol,
  summary,
  risikoDetail,
  loading,
  calculatingId,
  calculatedIds,
  onHitung,
  loadActions,
}: PengendalianRisikoDetailProps) {
  const { onOpen } = useModalStore();
  const [loadingActionId, setLoadingActionId] = React.useState<string | null>(
    null,
  );

  const adaTindakanBelumSelesai = React.useMemo(() => {
    if (!kontrol || kontrol.length === 0) return false;
    return kontrol.some(
      (k) => k.total_action > 0 && k.closed_action < k.total_action,
    );
  }, [kontrol]);

  const getTipeBadge = (tipe: string) => {
    switch (tipe?.toUpperCase()) {
      case "PREVENTIVE":
        return (
          <Badge className="border-none bg-emerald-500/10 text-emerald-600 shadow-none hover:bg-emerald-500/20">
            Preventive
          </Badge>
        );
      case "DETECTIVE":
        return (
          <Badge className="border-none bg-sky-500/10 text-sky-600 shadow-none hover:bg-sky-500/20">
            Detective
          </Badge>
        );
      case "CORRECTIVE":
        return (
          <Badge className="border-none bg-amber-500/10 text-amber-600 shadow-none hover:bg-amber-500/20">
            Corrective
          </Badge>
        );
      default:
        return <Badge variant="secondary">Kontrol</Badge>;
    }
  };

  const handleViewActions = async (
    kontrolId: string,
    singleKontrol: TKontrolRisiko,
    getTipeBadgeColor: (tipe: string) => void,
  ) => {
    setLoadingActionId(kontrolId);
    try {
      const freshActions = await loadActions(kontrolId);

      onOpen(
        "detail",
        {
          title: "Daftar Tindakan Yang Telah Dilakukan",
          message:
            "Detail informasi tentang tindakan yang telah dilaksanakan pada pengendalian terkait.",
          childrenDetail: (
            <TindakanDetail
              actions={freshActions}
              kontrol={singleKontrol}
              getTipeBadgeColor={getTipeBadgeColor}
            />
          ),
        },
        {},
      );
    } catch (error) {
      console.error("Gagal membuka tindakan:", error);
    } finally {
      setLoadingActionId(null);
    }
  };

  const getResidualInfo = (score: number | null) => {
    if (score === null || score === undefined) {
      return {
        label: "Belum Dinilai",
        color:
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200",
      };
    }
    if (score >= 15)
      return {
        label: "Sangat Tinggi",
        color: "bg-rose-100 text-rose-700 border-rose-200",
      };
    if (score >= 10)
      return {
        label: "Tinggi",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      };
    if (score >= 5)
      return {
        label: "Sedang",
        color: "bg-amber-100 text-amber-700 border-amber-200",
      };
    return {
      label: "Rendah",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  };

  // Aturan Kelayakan Penutupan Risiko (Residual <= 5 & Avg Efektivitas >= 70)
  const isAlreadyClosed = risikoDetail?.status === "Closed";
  const canCloseRisk =
    summary?.is_assessed &&
    summary?.avg >= 70 &&
    summary?.residual_score !== null &&
    summary?.residual_score <= 5;

  // 1. STATE BELUM PILIH RISIKO
  if (!selectedRisikoId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-slate-50/50 p-12 text-center dark:bg-slate-900/20">
        <IconAlertCircle className="text-muted-foreground/60 mb-3 h-10 w-10 animate-pulse" />
        <h4 className="text-foreground text-base font-semibold">
          Belum Ada Risiko Dipilih
        </h4>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          Silakan pilih salah satu risiko treat pada drop-down di atas untuk
          melihat data kontrol dan analisis mitigasi.
        </p>
      </div>
    );
  }

  // 2. STATE SEDANG LOADING DATA
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader2 className="text-primary mr-2 h-6 w-6 animate-spin" />
        <span className="text-muted-foreground text-xs font-medium">
          Memuat data pengendalian risiko...
        </span>
      </div>
    );
  }

  const riskConfig = getRiskLevel(risikoDetail?.score as number);
  const statusRisiko = getStatusRisiko(risikoDetail?.status as string);

  return (
    <div className="space-y-6">
      {summary && (
        <Card className="border-sky-100 bg-sky-50/30 py-3 shadow-none dark:border-sky-900/30 dark:bg-sky-950/10">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-400">
                <IconCalculator className="h-4 w-4" />
                Efektivitas Kontrol Total
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {summary.avg.toFixed(2)}%
              </span>
            </div>

            <Progress
              value={summary.avg}
              className={cn(
                "h-2 bg-sky-100",
                summary.avg >= 70
                  ? "[&>div]:bg-emerald-500"
                  : summary.avg >= 50
                    ? "[&>div]:bg-amber-500"
                    : "[&>div]:bg-rose-500",
              )}
            />

            <div className="flex items-center justify-between border-t border-sky-100 pt-3 text-xs dark:border-sky-900/50">
              <span className="text-muted-foreground">
                Skor Residual Risiko (Input Manual):
              </span>

              <Badge
                className={cn(
                  "px-2.5 py-0.5 font-bold shadow-none",
                  getResidualInfo(summary.residual_score).color,
                )}
              >
                {summary.is_assessed && summary.residual_score !== null ? (
                  <>
                    {summary.residual_score.toFixed(2)} —{" "}
                    {getResidualInfo(summary.residual_score).label}
                  </>
                ) : (
                  <>{getResidualInfo(null).label}</>
                )}
              </Badge>
            </div>

            {summary.total_kejadian !== null && summary.total_kejadian > 0 && (
              <div className="space-y-2">
                <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs text-rose-800">
                  <IconAlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-rose-600"
                  />
                  <div className="space-y-1">
                    <p className="font-bold">Perhatian Risiko Lapangan</p>
                    <p className="leading-relaxed text-rose-700/90">
                      Terdapat{" "}
                      <strong>{summary.total_kejadian} kejadian risiko</strong>{" "}
                      bulan ini. Sistem mendeteksi adanya kebocoran kontrol dan
                      memberikan penalti efektivitas.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-[11px] text-slate-600">
                  <IconHelpCircle
                    size={14}
                    className="shrink-0 text-slate-500"
                  />
                  <span>
                    <strong>Tips Pemulihan:</strong> Kurangi beban penalti
                    dengan menambahkan kebijakan
                    <strong> Kontrol Mitigasi Baru</strong>. Saat ini Anda
                    memiliki {kontrol.length} kontrol aktif.
                  </span>
                </div>
              </div>
            )}

            {!summary.is_assessed && (
              <p className="pt-1 text-center text-[11px] text-amber-600 italic dark:text-amber-400">
                *Silakan lakukan penilaian risiko (Likelihood & Impact) terlebih
                dahulu agar skor akhir terhitung.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {risikoDetail && (
        <div className="mb-4 grid grid-cols-1 gap-4 rounded-xl border bg-slate-50/50 p-4 text-xs shadow-inner sm:grid-cols-2 md:grid-cols-5 dark:bg-slate-900/40">
          <div className="space-y-0.5">
            <span className="text-muted-foreground block font-medium">
              Nama Risiko
            </span>
            <strong
              className="text-foreground block truncate text-sm"
              title={risikoDetail.nama_resiko}
            >
              {risikoDetail.nama_resiko}
            </strong>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground block font-medium">
              Strategi Mitigasi
            </span>
            <Badge
              variant="outline"
              className="mt-0.5 border-amber-500 bg-amber-500/5 font-bold tracking-wide text-amber-600 shadow-none"
            >
              <IconShield className="h-3.5 w-3.5 shrink-0" />
              Mitigasi
            </Badge>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground block font-medium">
              Skor (Analisis)
            </span>
            <div className={`text-sm font-bold ${riskConfig.textClass}`}>
              {risikoDetail.score || 0}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground block font-medium">
              Level Risiko
            </span>
            <Badge
              className={`border-none px-3 py-1 text-xs font-bold shadow-sm ${riskConfig.badgeClass}`}
            >
              {riskConfig.label}
            </Badge>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground block font-medium">
              Status Risiko
            </span>
            <Badge
              className={cn(
                "mt-0.5 border px-2.5 py-0.5 text-xs font-bold shadow-none",
                statusRisiko.badgeClass,
              )}
              variant="outline"
            >
              <span className="flex items-center gap-1">
                ● {statusRisiko.label}
              </span>
            </Badge>
          </div>
        </div>
      )}

      {/* 4. DAFTAR KONTROL */}
      <div className="space-y-3">
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Daftar Kontrol Mitigasi
          </h3>
          {adaTindakanBelumSelesai && (
            <Alert
              variant="default"
              className="rounded-xl border-indigo-200 bg-indigo-50 text-indigo-900 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="mt-0.5 shrink-0 rounded-lg border border-indigo-200 bg-indigo-100 p-1.5 text-indigo-600">
                  <IconInfoCircleFilled className="h-5 w-5 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <AlertTitle className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-indigo-950">
                    Harap selesaikan dulu tindakan pengendalian risiko terkait
                    untuk dapat menghitung efektivitasnya
                  </AlertTitle>
                </div>
              </div>
            </Alert>
          )}
        </div>

        {kontrol.length === 0 ? (
          <div className="text-muted-foreground rounded-xl border bg-slate-50/20 py-8 text-center text-xs">
            Belum ada kebijakan kontrol yang terdaftar untuk risiko ini.
          </div>
        ) : (
          kontrol.map((k) => {
            const siapDihitung =
              k.total_action === 0 || k.closed_action === k.total_action;
            const sudahDihitung =
              calculatedIds.includes(k.id) || k.is_calculated === true;

            return (
              <Card
                key={k.id}
                className="py-3 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5">
                      <IconShield className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <div className="space-y-0.5">
                        <h4 className="text-foreground line-clamp-1 text-xs font-semibold">
                          {k.nama_kontrol}
                        </h4>
                        <p className="text-muted-foreground line-clamp-1 text-[11px]">
                          {k.deskripsi || "Tidak ada deskripsi"}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {getTipeBadge(k.tipe)}
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {k.effectiveness || 0}%
                      </span>
                    </div>
                  </div>

                  <Progress
                    value={k.effectiveness ?? 0}
                    className={cn(
                      "h-1.5",
                      k.effectiveness >= 80
                        ? "[&>div]:bg-emerald-500"
                        : k.effectiveness >= 50
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-rose-500",
                    )}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-muted-foreground text-[10px]">
                      Progress Action:{" "}
                      <span className="text-foreground font-semibold">
                        {k.closed_action}/{k.total_action} Closed
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 px-2.5 text-[11px] shadow-none"
                        onClick={() => handleViewActions(k.id, k, getTipeBadge)}
                        disabled={loadingActionId === k.id}
                      >
                        {loadingActionId === k.id ? (
                          <>
                            <IconLoader2 className="text-primary h-3.5 w-3.5 animate-spin" />
                            Memuat...
                          </>
                        ) : (
                          <>
                            <IconEye className="h-3.5 w-3.5" />
                            Lihat Action
                          </>
                        )}
                      </Button>

                      {siapDihitung ? (
                        <Button
                          size="sm"
                          variant={sudahDihitung ? "secondary" : "default"}
                          className="h-7 gap-1 px-2.5 text-[11px] shadow-none"
                          onClick={() => onHitung(k.id)}
                          disabled={calculatingId === k.id || sudahDihitung}
                        >
                          {calculatingId === k.id ? (
                            <>
                              <IconLoader2 className="h-3 w-3 animate-spin" />
                              Menghitung...
                            </>
                          ) : sudahDihitung ? (
                            <>
                              <IconCheck className="h-3 w-3 text-emerald-600" />
                              Dihitung
                            </>
                          ) : (
                            "Hitung Efektivitas"
                          )}
                        </Button>
                      ) : (
                        // Tampilan Tombol Terkunci Jika Ada Tindakan Yang Belum Selesai
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          className="h-7 cursor-not-allowed bg-slate-100 px-2.5 text-[11px] text-slate-400 shadow-none dark:bg-slate-800 dark:text-slate-500"
                          title="Selesaikan semua progress rencana aksi terlebih dahulu"
                        >
                          Aksi Belum Selesai
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* 5. DOCK BUTTON UNTUK ACTION CLOSE RISK */}
      {summary && (
        <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-3.5 dark:bg-slate-900/50">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-[11px] font-medium">
              Status Kelayakan Penutupan:
            </span>
            <span
              className={`text-[11px] font-bold ${canCloseRisk ? "text-emerald-600" : "text-rose-500"}`}
            >
              {canCloseRisk
                ? "✓ Memenuhi syarat mitigasi aman"
                : "⚠️ Belum memenuhi standar aman (Residual harus di bawah analisis awal)"}
            </span>
          </div>

          {canCloseRisk && (
            <Button
              variant={isAlreadyClosed ? "secondary" : "default"}
              className={cn(
                "h-9 gap-1.5 text-xs text-white shadow-sm transition-all",
                isAlreadyClosed
                  ? "cursor-not-allowed bg-slate-100 text-slate-400 hover:bg-slate-100 dark:bg-slate-800"
                  : "bg-emerald-600 hover:bg-emerald-700",
              )}
              onClick={() => {
                if (isAlreadyClosed) return;
                onOpen(
                  "closeRisk",
                  {
                    title: "Konfirmasi Penutupan Risiko",
                    message: (
                      <>
                        Tutup risiko dan tandai bahwa risiko tersebut telah
                        selesai.
                      </>
                    ),
                  },
                  {
                    id: selectedRisikoId,
                    summaryData: summary,
                    pengendalianRisikoDetail: risikoDetail,
                  },
                );
              }}
              disabled={isAlreadyClosed}
            >
              {isAlreadyClosed ? (
                <>
                  <IconLock className="h-3.5 w-3.5 text-slate-400" />
                  Risiko Ditutup
                </>
              ) : (
                <>
                  <IconLockOpen className="h-3.5 w-3.5" />
                  Tutup Risiko
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import {
  IconFileTypePdf,
  IconFileSpreadsheet,
  IconCloudDownload,
  IconLoader2,
  IconSearch,
  IconShieldExclamation,
  IconChecklist,
  IconShieldCheck,
  IconChartBar,
  IconUserCheck,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExtendedUser } from "@/next-auth";
import CONST from "@/lib/constants";

interface LaporanTabProps {
  session?: ExtendedUser;
}

interface LoadingState {
  identifikasi_pdf: boolean;
  identifikasi_excel: boolean;
  analisis_pdf: boolean;
  analisis_excel: boolean;
  evaluasi_pdf: boolean;
  evaluasi_excel: boolean;
  perlakuan_pdf: boolean;
  perlakuan_excel: boolean;
  residu_pdf: boolean;
  residu_excel: boolean;
  profile_pdf: boolean;
  profile_excel: boolean;
}

export const LaporanTab = ({ session }: LaporanTabProps) => {
  const [downloadingPDF, setDownloadingPDF] = React.useState<boolean>(false);
  const [downloadingExcel, setDownloadingExcel] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<LoadingState>({
    identifikasi_pdf: false,
    identifikasi_excel: false,
    analisis_pdf: false,
    analisis_excel: false,
    evaluasi_pdf: false,
    evaluasi_excel: false,
    perlakuan_pdf: false,
    perlakuan_excel: false,
    residu_pdf: false,
    residu_excel: false,
    profile_pdf: false,
    profile_excel: false,
  });

  // Handler Download PDF Report
  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const response = await fetch(`${CONST.API_BASE_URL}/reports/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });

      if (!response.ok)
        throw new Error("Gagal mengunduh berkas PDF dari server.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-executive-risiko-${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("❌ Gagal generate PDF:", err);
      alert("Gagal mengunduh dokumen PDF: " + err.message);
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Handler Download Excel Report
  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const response = await fetch(`${CONST.API_BASE_URL}/reports/excel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });

      if (!response.ok)
        throw new Error("Gagal mengunduh berkas Excel dari server.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-detail-risiko-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("❌ Gagal generate Excel:", err);
      alert("Gagal mengunduh dokumen Excel: " + err.message);
    } finally {
      setDownloadingExcel(false);
    }
  };

  // Fungsi helper global untuk mengelola request stream download berkas
  const handleDownloadReport = async (
    format: "pdf" | "excel",
    type:
      | "identifikasi"
      | "analisis"
      | "evaluasi"
      | "perlakuan"
      | "residu"
      | "profile",
  ) => {
    const actionKey = `${type}_${format}` as keyof LoadingState;

    setLoading((prev) => ({ ...prev, [actionKey]: true }));

    try {
      const response = await fetch(
        `${CONST.API_BASE_URL}/reports/risk-report?download=${format}&type=${type}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Gagal menyusun dokumen ${format.toUpperCase()} untuk modul ${type}.`,
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const fileExt = format === "excel" ? "xlsx" : "pdf";
      const timestamp = new Date().toISOString().split("T")[0];
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-${type}-risiko-${timestamp}.${fileExt}`,
      );
      document.body.appendChild(link);

      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(`❌ Gagal mengunduh laporan ${type} (${format}):`, err);
      alert(`Gagal mengunduh berkas: ${err.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* RENDER GRID BERISI 3 CARD UTAMA MODUL */}
      <div className="space-y-4">
        <div className="text-xl font-bold">
          Rekap Laporan Setiap Proses Manajemen Risiko
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ========================================================== */}
          {/* CARD 1: MODUL IDENTIFIKASI RISIKO */}
          {/* ========================================================== */}
          <Card className="flex flex-col justify-between gap-4 border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <IconSearch size={28} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Identifikasi Risiko
              </CardTitle>
              <CardDescription className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">
                Daftar risiko yang telah diidentifikasi berdasarkan setiap unit
                yang bertanggung jawab.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-2">
              {/* Tombol Cetak PDF */}
              <Button
                onClick={() => handleDownloadReport("pdf", "identifikasi")}
                disabled={loading.identifikasi_pdf || !session?.token}
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-red-200 py-5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                {loading.identifikasi_pdf ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Menyusun PDF...</span>
                  </>
                ) : (
                  <>
                    <IconFileTypePdf size={16} />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
              {/* Tombol Spreadsheet Excel */}
              <Button
                onClick={() => handleDownloadReport("excel", "identifikasi")}
                disabled={loading.identifikasi_excel || !session?.token}
                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                {loading.identifikasi_excel ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses Cell...</span>
                  </>
                ) : (
                  <>
                    <IconFileSpreadsheet size={16} />
                    <span>Download Excel</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ========================================================== */}
          {/* CARD 2: MODUL ANALISIS / PENILAIAN RISIKO */}
          {/* ========================================================== */}
          <Card className="flex flex-col justify-between gap-4 border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <IconShieldExclamation size={28} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Analisis Risiko
              </CardTitle>
              <CardDescription className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">
                Matriks hasil analisis tingkat bahaya risiko berdasarkan nilai{" "}
                <em>Likelihood</em> (kemungkinan) dan <em>Impact</em> (dampak).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-2">
              {/* Tombol Cetak PDF */}
              <Button
                onClick={() => handleDownloadReport("pdf", "analisis")}
                disabled={loading.analisis_pdf || !session?.token}
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-red-200 py-5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                {loading.analisis_pdf ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Menganalisis Skor...</span>
                  </>
                ) : (
                  <>
                    <IconFileTypePdf size={16} />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
              {/* Tombol Spreadsheet Excel */}
              <Button
                onClick={() => handleDownloadReport("excel", "analisis")}
                disabled={loading.analisis_excel || !session?.token}
                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                {loading.analisis_excel ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Mewarnai Baris...</span>
                  </>
                ) : (
                  <>
                    <IconFileSpreadsheet size={16} />
                    <span>Download Excel</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ========================================================== */}
          {/* CARD 3: MODUL EVALUASI & MITIGASI RISIKO */}
          {/* ========================================================== */}
          <Card className="flex flex-col justify-between gap-4 border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <IconChecklist size={28} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Evaluasi Risiko
              </CardTitle>
              <CardDescription className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">
                Laporan strategi rencana penanganan, skala prioritas mitigasi,
                dan berkas justifikasi ketetapan tindak lanjut pengendalian.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-2">
              {/* Tombol Cetak PDF */}
              <Button
                onClick={() => handleDownloadReport("pdf", "evaluasi")}
                disabled={loading.evaluasi_pdf || !session?.token}
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-red-200 py-5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                {loading.evaluasi_pdf ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Menyusun Dokumen...</span>
                  </>
                ) : (
                  <>
                    <IconFileTypePdf size={16} />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
              {/* Tombol Spreadsheet Excel */}
              <Button
                onClick={() => handleDownloadReport("excel", "evaluasi")}
                disabled={loading.evaluasi_excel || !session?.token}
                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                {loading.evaluasi_excel ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Mengekspor Cell...</span>
                  </>
                ) : (
                  <>
                    <IconFileSpreadsheet size={16} />
                    <span>Download Excel</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ========================================================== */}
          {/* CARD 4: MODUL PERLAKUAN RISIKO */}
          {/* ========================================================== */}
          <Card className="flex flex-col justify-between gap-4 border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <IconShieldCheck size={28} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Perlakuan Risiko
              </CardTitle>
              <CardDescription className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">
                Laporan pemantauan struktur kontrol pengendalian, daftar
                tindakan mitigasi, progress pengerjaan, dan status
                keterlambatan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-2">
              {/* Tombol Cetak PDF */}
              <Button
                onClick={() => handleDownloadReport("pdf", "perlakuan")}
                disabled={loading.perlakuan_pdf || !session?.token}
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-red-200 py-5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                {loading.perlakuan_pdf ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Menyusun Dokumen...</span>
                  </>
                ) : (
                  <>
                    <IconFileTypePdf size={16} />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
              {/* Tombol Spreadsheet Excel */}
              <Button
                onClick={() => handleDownloadReport("excel", "perlakuan")}
                disabled={loading.perlakuan_excel || !session?.token}
                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                {loading.perlakuan_excel ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Mengekspor Cell...</span>
                  </>
                ) : (
                  <>
                    <IconFileSpreadsheet size={16} />
                    <span>Download Excel</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ========================================================== */}
          {/* CARD 5: MODUL ANALISIS RESIDU RISIKO */}
          {/* ========================================================== */}
          <Card className="flex flex-col justify-between gap-4 border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <IconChartBar size={28} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Analisis Residu
              </CardTitle>
              <CardDescription className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">
                Laporan evaluasi tingkat penurunan risiko (before vs after),
                histori insiden riil, dan profil risiko pasca mitigasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-2">
              <Button
                onClick={() => handleDownloadReport("pdf", "residu")}
                disabled={loading.residu_pdf || !session?.token}
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-red-200 py-5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                {loading.residu_pdf ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Menyusun Dokumen...</span>
                  </>
                ) : (
                  <>
                    <IconFileTypePdf size={16} />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleDownloadReport("excel", "residu")}
                disabled={loading.residu_excel || !session?.token}
                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                {loading.residu_excel ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Mengekspor Cell...</span>
                  </>
                ) : (
                  <>
                    <IconFileSpreadsheet size={16} />
                    <span>Download Excel</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ========================================================== */}
          {/* CARD 6: MODUL PROFILE RISIKO */}
          {/* ========================================================== */}
          {session?.role !== "USER" && (
            <Card className="flex flex-col justify-between gap-4 border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="p-6 pb-4 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <IconUserCheck size={28} />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Profil Risiko
                </CardTitle>
                <CardDescription className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">
                  Laporan register profil risiko utama organisasi, pemilik
                  risiko, skor inherent, serta struktur kontrol dan tindakan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-6 pt-2">
                <Button
                  onClick={() => handleDownloadReport("pdf", "profile")}
                  disabled={loading.profile_pdf || !session?.token}
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 border-red-200 py-5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  {loading.profile_pdf ? (
                    <>
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      <span>Menyusun Dokumen...</span>
                    </>
                  ) : (
                    <>
                      <IconFileTypePdf size={16} />
                      <span>Download PDF</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleDownloadReport("excel", "profile")}
                  disabled={loading.profile_excel || !session?.token}
                  className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  {loading.profile_excel ? (
                    <>
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      <span>Mengekspor Cell...</span>
                    </>
                  ) : (
                    <>
                      <IconFileSpreadsheet size={16} />
                      <span>Download Excel</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* 1. SEKSI DOWNLOAD CARDS */}
      <div className="space-y-4">
        <div className="text-xl font-bold">Rekap Laporan Keseluruhan</div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card PDF */}
          <Card className="border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <IconFileTypePdf size={32} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Laporan Format PDF
              </CardTitle>
              <CardDescription className="mx-auto max-w-xs text-xs leading-relaxed text-slate-500">
                Dapatkan berkas ringkasan eksekutif formal lengkap dengan
                visualisasi grafik *Bar Chart* kategori risiko untuk arsip
                cetak.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF || !session?.token}
                variant="destructive"
                className="flex w-full items-center justify-center gap-2 py-6 text-sm font-semibold shadow-sm"
              >
                {downloadingPDF ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Menyusun Dokumen PDF...</span>
                  </>
                ) : (
                  <>
                    <IconCloudDownload size={18} />
                    <span>Download PDF Report</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Card Excel */}
          <Card className="border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <IconFileSpreadsheet size={32} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Laporan Format Excel
              </CardTitle>
              <CardDescription className="mx-auto max-w-xs text-xs leading-relaxed text-slate-500">
                Dapatkan struktur data sel tabular matriks komplit beserta
                pemilik kasus dan perhitungan residu risiko real-time untuk
                audit data.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button
                onClick={handleDownloadExcel}
                disabled={downloadingExcel || !session?.token}
                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-6 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 active:bg-emerald-700"
              >
                {downloadingExcel ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses Spreadsheet...</span>
                  </>
                ) : (
                  <>
                    <IconCloudDownload size={18} />
                    <span>Download Excel Report</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

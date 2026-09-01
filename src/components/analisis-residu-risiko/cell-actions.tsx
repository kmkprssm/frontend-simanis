"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import {
  IconAlertCircle,
  IconReplace,
  IconChartBar,
  IconLock,
  IconClipboardCheck,
} from "@tabler/icons-react";
import { TAnalisisResiduRisiko } from "@/types/analisis-risiko-type";

interface CellActionsProps {
  rowData: TAnalisisResiduRisiko;
}

export const CellActions = ({ rowData }: CellActionsProps) => {
  const router = useRouter();
  const { onOpen } = useModalStore();

  // KONDISI 0: Proteksi jika Status Risiko sudah ditutup (Closed)
  if (rowData.status === "Closed") {
    return (
      <Button
        disabled
        className="w-full gap-1.5 border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400 shadow-none"
      >
        <IconLock size={14} />
        Risiko Telah Selesai
      </Button>
    );
  }

  // KONDISI 1: Belum Dilakukan Penilaian Inherent/Before sama sekali
  if (!rowData.inherent_score || rowData.inherent_score === 0) {
    return (
      <Button
        onClick={() =>
          router.push(`/analisis-risiko?risk_id=${rowData.risk_id}`)
        }
        className="w-full gap-1.5 border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-none hover:bg-amber-100/80"
      >
        <IconAlertCircle size={14} />
        Lakukan Analisis Risiko
      </Button>
    );
  }

  // KONDISI 2: Sudah Dinilai awal tapi Belum Dievaluasi (Strategi / Prioritas di log aktif kosong)
  if (!rowData.strategi || !rowData.prioritas) {
    return (
      <Button
        onClick={() =>
          router.push(
            `/evaluasi-risiko?open_risk_id=${rowData.risk_id}&action=new_evaluation`,
          )
        }
        className="w-full gap-1.5 border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-none hover:bg-blue-100/80"
      >
        <IconReplace size={14} />
        Isi Evaluasi Risiko
      </Button>
    );
  }

  if (rowData.risiko_terlaporkan_tahun_ini === 0) {
    return (
      <Button
        onClick={() => router.push("/pencatatan-kejadian-risiko")}
        className="w-full max-w-45 gap-1.5 border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-none hover:bg-slate-100"
      >
        <IconClipboardCheck size={14} className="text-slate-400" />
        Isi Kejadian Risiko Dulu
      </Button>
    );
  }

  // KONDISI 4: Sudah pernah melapor minimal 1 bulan di tahun ini -> LANGSUNG BISA ANALISIS RESIDU
  return (
    <Button
      onClick={() =>
        onOpen(
          "addEditAnalisisResidu",
          {
            title: rowData.score_after
              ? "Perbarui Analisis Residu"
              : "Isi Analisis Residu",
            message: rowData.pernah_terjadi
              ? "⚠️ Risiko ini tercatat pernah mengalami kejadian pada tahun berjalan. Harap sesuaikan skala after secara objektif."
              : "Berikan evaluasi terhadap tingkat penurunan skala risiko setelah dilakukan tindakan pengendalian.",
          },
          {
            residuData: rowData,
          },
        )
      }
      className={`w-full gap-1.5 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all ${
        rowData.score_after
          ? "bg-slate-700 hover:bg-slate-600"
          : "bg-emerald-600 hover:bg-emerald-500 hover:shadow"
      }`}
    >
      <IconChartBar size={14} />
      {rowData.score_after ? "Ubah Skala After" : "Analisis Residu"}
    </Button>
  );
};

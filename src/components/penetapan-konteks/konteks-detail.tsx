import { TKonteks } from "@/types/konteks-type";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { METODE_LABEL, METODE_VARIANT } from "@/helpers/risk-helpers";

interface KonteksDetailProps {
  data?: TKonteks;
}

export const KonteksDetail = ({ data }: KonteksDetailProps) => {
  if (!data) {
    return (
      <p className="text-muted-foreground p-4 text-center text-sm">
        Data tidak ditemukan.
      </p>
    );
  }

  return (
    <div className="space-y-6 p-6 text-sm">
      {/* KELOMPOK 1: INFORMASI UMUM */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Informasi Umum
        </h4>
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Unit Kerja
            </span>
            <p className="text-foreground font-semibold">{data.unit_kerja}</p>
          </div>
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Periode
            </span>
            <p className="text-foreground font-semibold">{data.periode}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Sasaran Strategis
            </span>
            <p className="text-foreground bg-muted/40 border-border/50 rounded-lg border p-3 leading-relaxed font-medium">
              {data.sasaran_strategis}
            </p>
          </div>
        </div>
      </div>

      {/* KELOMPOK 2: ANALISIS LINGKUNGAN (PESTLE & INTERNAL) */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Analisis Lingkungan
        </h4>
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Politik & Ekonomi
            </span>
            <p className="text-foreground font-medium">
              {data.politik_ekonomi}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Sosial & Teknologi
            </span>
            <p className="text-foreground font-medium">
              {data.sosial_teknologi}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Hukum & Regulasi
            </span>
            <p className="text-foreground font-medium">{data.hukum_regulasi}</p>
          </div>
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Lingkungan Fisik
            </span>
            <p className="text-foreground font-medium">{data.lingkungan}</p>
          </div>
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Kapabilitas SDM
            </span>
            <p className="text-foreground font-medium">
              {data.kapabilitas_sumber_daya}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Struktur & Budaya
            </span>
            <p className="text-foreground font-medium">
              {data.struktur_budaya}
            </p>
          </div>
        </div>
      </div>

      {/* KELOMPOK 3: PARAMETER KRITERIA RISIKO */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Kriteria & Parameter
        </h4>
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <span className="text-muted-foreground mb-1 block text-xs">
              Metode Evaluasi
            </span>
            <Badge
              variant={METODE_VARIANT[data.metode_evaluasi] || "secondary"}
              className="px-2.5 py-0.5"
            >
              {METODE_LABEL[data.metode_evaluasi] || data.metode_evaluasi}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground mb-1 block text-xs">
              Selera Risiko
            </span>
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/5 px-2.5 py-0.5 font-semibold text-amber-600"
            >
              {data.selera_resiko}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground mb-0.5 block text-xs">
              Ambang Dampak
            </span>
            <p className="font-bold text-emerald-600 dark:text-emerald-500">
              Rp {Number(data.ambang_dampak_rp || 0).toLocaleString("id-ID")}
            </p>
          </div>
          <div className="sm:col-span-3">
            <span className="text-muted-foreground mb-1 block text-xs">
              Status Aktivasi
            </span>
            <Badge
              variant={data.status ? "default" : "destructive"}
              className="px-3 py-0.5"
            >
              {data.status ? "Aktif" : "Non-Aktif"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

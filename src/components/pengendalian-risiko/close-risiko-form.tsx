import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  IconAlertTriangle,
  IconCalculator,
  IconShieldHeart,
  IconHospital,
} from "@tabler/icons-react";

import {
  CloseRisikoSchema,
  CloseRisikoValues,
} from "@/schemas/pengendalian-risiko-schema";
import { Badge } from "@/components/ui/badge";
import { TRisikoDetail, TSummary } from "@/hooks/usePengendalian";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "../ui/loading-button";
import { DialogClose, DialogFooter } from "../ui/dialog";

interface CloseRisikoFormProps {
  summary?: TSummary;
  risikoDetail?: TRisikoDetail | null;
  onSubmit: (values: CloseRisikoValues) => void;
}

export const CloseRisikoForm = ({
  onSubmit,
  risikoDetail,
  summary,
}: CloseRisikoFormProps) => {
  const form = useForm<CloseRisikoValues>({
    resolver: zodResolver(CloseRisikoSchema),
    defaultValues: {
      close_reason: "",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const currentReasonLength = watch("close_reason")?.trim().length || 0;

  const getResidualInfo = (score: number | null) => {
    if (score === null || score === undefined) {
      return {
        label: "Belum Dinilai",
        color:
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200",
      };
    }

    // Logika pembagian zonasi ISO 31000 (Skala 1 - 25) Anda di bawah ini
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

  return (
    <>
      <div className="flex-1 space-y-6 p-6 py-2">
        {summary && risikoDetail && (
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-950/20">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Nama Risiko / Isu
              </span>
              <h4 className="text-xs leading-relaxed font-bold text-slate-800 dark:text-slate-200">
                {risikoDetail?.nama_resiko || "Memuat deskripsi risiko..."}
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-dashed border-slate-200 pt-2 dark:border-slate-800">
              {summary.is_assessed && summary.residual_score !== null && (
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                    <IconShieldHeart className="h-3 w-3 text-slate-400" />{" "}
                    Residual Risk
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {summary?.residual_score !== null
                      ? summary?.residual_score.toFixed(2)
                      : "0.00"}
                  </div>
                  <Badge
                    className={`border px-1.5 py-0 text-[10px] font-medium shadow-none ${getResidualInfo(summary?.residual_score || 0).color}`}
                    variant="outline"
                  >
                    {getResidualInfo(summary?.residual_score || 0).label}
                  </Badge>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                  <IconCalculator className="h-3 w-3 text-slate-400" />{" "}
                  Efektivitas
                </span>
                <div className="text-sm font-bold text-sky-600 dark:text-sky-400">
                  {summary && summary?.avg ? summary?.avg.toFixed(2) : "0.00"}%
                </div>
                <Badge
                  className="border-sky-200 bg-sky-50 px-1.5 py-0 text-[10px] font-medium text-sky-700 shadow-none dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-400"
                  variant="outline"
                >
                  {summary && summary?.avg >= 70 ? "Optimal" : "Kurang"}
                </Badge>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                  <IconHospital className="h-3 w-3 text-slate-400" /> Unit
                </span>
                <div className="text-truncate max-w-22.5 pt-0.5 font-mono text-xs font-semibold text-slate-500">
                  {risikoDetail?.pemilik_risiko || "Belum ada pemilik"}
                </div>
              </div>
            </div>
          </div>
        )}
        <form
          id="form-close-risiko"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="close_reason"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="close_reason"
                    className="text-xs font-bold text-slate-700 after:ml-1 after:text-red-500 after:content-['*']"
                  >
                    Alasan Penutupan RIsiko{" "}
                    <span className="ml-2 font-medium text-zinc-600">
                      (Minimal 10 karakter)
                    </span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="close_reason"
                    placeholder="Contoh: Risiko telah dimitigasi dengan efektif, residual risk rendah (≤5), dan dapat diterima oleh organisasi sebagai risiko yang diizinkan."
                    className="min-h-25 border-slate-200 text-sm focus-visible:ring-1"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <span
                    className={`text-[10px] font-medium ${currentReasonLength >= 10 ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    Karakter: {currentReasonLength}
                  </span>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 dark:border-amber-900/30 dark:bg-amber-950/10">
          <div className="flex items-start gap-2.5">
            <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                PERINGATAN SISTEM MUTASI
              </h5>
              <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-500/80">
                Risiko yang sudah ditutup akan <strong>dikunci permanen</strong>{" "}
                dan datanya otomatis dipindahkan ke matriks dashboard pemantauan
                internal manajemen risiko. Tindakan ini membutuhkan konfirmasi
                validasi organisasi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="bg-background sticky bottom-0 flex w-full items-center gap-2 rounded-b-4xl border-t p-4 sm:justify-end">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Batal
          </Button>
        </DialogClose>
        <LoadingButton
          type="submit"
          form="form-close-risiko"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={
            isSubmitting || !isDirty || !isValid || currentReasonLength < 10
          }
          className="gap-1.5 px-4"
        >
          {"Tutup Risiko"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
};

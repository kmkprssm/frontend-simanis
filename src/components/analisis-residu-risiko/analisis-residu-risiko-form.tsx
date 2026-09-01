"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  IconActivity,
  IconAlertTriangle,
  IconFlame,
  IconInfoCircle,
  IconShieldCheck,
  IconShieldExclamation,
} from "@tabler/icons-react";

import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
} from "../ui/field";
import { LoadingButton } from "../ui/loading-button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import {
  getRiskLevel,
  impactKeterangan,
  likelihoodKeterangan,
  PRIORITAS_CONFIG,
} from "@/helpers/risk-helpers";
import { TAnalisisResiduRisiko } from "@/types/analisis-risiko-type";
import {
  InsertAnalisisResiduRisikoSchema,
  InsertAnalisisResiduRisikoValues,
} from "@/schemas/analisis-risiko-schema";
import { createUpdateAnalisisResiduRisiko } from "@/server/apis/analisis-risiko";

interface AnalisisResiduRisikoFormProps {
  rawResiduData?: TAnalisisResiduRisiko;
  defaultValues?: Partial<InsertAnalisisResiduRisikoValues>;
  onSubmitSuccess(): void;
}

export const AnalisisResiduRisikoForm = ({
  rawResiduData,
  defaultValues,
  onSubmitSuccess,
}: AnalisisResiduRisikoFormProps) => {
  const isEditMode = !!rawResiduData?.score_after;

  const form = useForm<InsertAnalisisResiduRisikoValues>({
    resolver: zodResolver(InsertAnalisisResiduRisikoSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const watchLikelihood = useWatch({ control, name: "likelihood" });
  const watchImpact = useWatch({ control, name: "impact" });

  const numL = watchLikelihood ? Number(watchLikelihood) : 0;
  const numI = watchImpact ? Number(watchImpact) : 0;
  const calculatedScore = numL * numI;

  React.useEffect(() => {
    if (numL && numI) {
      setValue("score", String(calculatedScore), {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      setValue("score", "", { shouldValidate: false });
    }
  }, [numL, numI, calculatedScore, setValue]);

  const finalRisk = getRiskLevel(calculatedScore);
  const beforeRiskLevel = getRiskLevel(rawResiduData?.inherent_score || 0);
  const prioritasKey =
    rawResiduData?.prioritas !== undefined
      ? Number(rawResiduData?.prioritas)
      : null;
  const cfg = PRIORITAS_CONFIG[prioritasKey as keyof typeof PRIORITAS_CONFIG];
  const Icon = cfg.icon;

  const onSubmitForm = async (values: InsertAnalisisResiduRisikoValues) => {
    try {
      const response = await createUpdateAnalisisResiduRisiko(values);
      if (response.success) {
        toast.success("Berhasil!", { description: response.message });
        onSubmitSuccess();
      } else {
        toast.error("Gagal menyimpan!", { description: response.message });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error!", {
        description: "Terjadi gangguan sistem koneksi jaringan.",
      });
    }
  };

  return (
    <>
      <form
        id="form-analisis-residu"
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-4 p-6 py-2"
      >
        <FieldGroup>
          {/* ================= CARD PROFIL UTAMA RISIKO (LOCKED & READONLY) ================= */}
          <Card className="w-full border-slate-200 bg-slate-50/50 py-2 shadow-none">
            <CardHeader className="rounded-t-xl border-b border-slate-100 bg-white p-4">
              <CardTitle className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Informasi Risiko Terpilih
              </CardTitle>
              <h2 className="text-sm leading-snug font-bold text-slate-800">
                {rawResiduData?.nama_resiko}
              </h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 rounded-b-xl bg-white p-4 text-xs">
              <div>
                <span className="mb-0.5 block text-slate-400">
                  Strategi Penanganan:
                </span>
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50/50 text-[11px] font-semibold text-blue-700"
                >
                  {rawResiduData?.strategi || "Treat"}
                </Badge>
              </div>
              <div>
                <span className="mb-0.5 block text-slate-400">
                  Prioritas Evaluasi:
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-xs",
                    cfg.badgeClass,
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{cfg.label}</span>
                </Badge>
              </div>

              {/* TINGKAT RISIKO BEFORE (Mencakup Skor kemungkinan & dampak) */}
              <div className="border-t border-slate-50 pt-2">
                <span className="mb-1 block text-slate-400">
                  Tingkat Risiko Sebelum (Before):
                </span>
                <div className="flex flex-col gap-1 font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-bold text-white",
                        beforeRiskLevel.badgeClass,
                      )}
                    >
                      Skor {rawResiduData?.inherent_score} (
                      {beforeRiskLevel.label})
                    </span>
                  </div>
                  <span className="inline-block w-max rounded bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    Kemungkinan:{" "}
                    <strong>{rawResiduData?.likelihood_before || 0}</strong> ×
                    Dampak:{" "}
                    <strong>{rawResiduData?.impact_before || 0}</strong>{" "}
                  </span>
                </div>
              </div>

              {/* KONDISI INSIDEN (Mencakup Total Kejadian Risiko) */}
              <div className="border-t border-slate-50 pt-2">
                <span className="mb-1 block text-slate-400">
                  Kondisi Insiden Periode Ini:
                </span>
                {rawResiduData?.pernah_terjadi ? (
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 font-bold text-rose-600">
                      <IconShieldExclamation
                        size={14}
                        className="animate-pulse"
                      />{" "}
                      Ada Kejadian Risiko
                    </span>
                    <span className="inline-block rounded bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                      Total: {rawResiduData?.total_kejadian || 0} Kali Insiden
                    </span>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <IconShieldCheck size={14} /> Nihil / Aman
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ================= BOX BANNER EDUKASI INFORMASI PENGISIAN ================= */}
          {rawResiduData?.pernah_terjadi ? (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs text-rose-800">
              <IconAlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-rose-600"
              />
              <div className="space-y-1">
                <p className="font-bold">Pemberitahuan Kejadian Aktif</p>
                <p className="leading-relaxed text-rose-700/90">
                  Risiko ini **mengalami kejadian/insiden** pada bulan berjalan.
                  Pengendalian saat ini terbukti jebol. Harap lakukan penaksiran
                  ulang skala dampak dan kemungkinan berdasarkan realita
                  kerugian nyata yang telah timbul.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs text-blue-800">
              <IconInfoCircle
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />
              <div className="space-y-1">
                <p className="font-bold">Petunjuk Nilai Residu</p>
                <p className="leading-relaxed text-blue-700/90">
                  Tidak ada kejadian untuk risiko ini. Jika efektivitas kendali
                  internal dirasa masih prima dan sama dengan awal, Anda dapat
                  menetapkan skala residu **setara dengan nilai analisis sebelum
                  (*before*)**.
                </p>
              </div>
            </div>
          )}

          {/* ================= INPUT SELECTION FORM (LIKELIHOOD & IMPACT) ================= */}
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <FieldLegend className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Form Penilaian Residu (After)
              </FieldLegend>
              <FieldDescription>
                Pilih nilai skala kemungkinan dan skala dampak residu dari
                risiko yang terpilih
              </FieldDescription>
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                {/* SKALA KEMUNGKINAN */}
                <Controller
                  name="likelihood"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <IconActivity className="h-5 w-5 text-blue-500" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">
                            Skala Kemungkinan
                          </h3>
                          <p className="text-muted-foreground text-[11px]">
                            Likelihood terjadinya suatu kejadian risiko
                          </p>
                        </div>
                      </div>
                      <RadioGroup
                        value={field.value ? String(field.value) : ""}
                        onValueChange={field.onChange}
                        className="space-y-2.5"
                      >
                        {([1, 2, 3, 4, 5] as const).map((v) => {
                          const cfg = likelihoodKeterangan[v];
                          const isChecked = String(field.value) === String(v);
                          return (
                            <label
                              key={v}
                              className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 transition-all duration-200 hover:bg-slate-50",
                                isChecked
                                  ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20"
                                  : "border-slate-100",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold",
                                  cfg.color,
                                )}
                              >
                                {v}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block text-xs font-bold text-slate-800">
                                  {cfg.label}
                                </span>
                                <p className="mt-0.5 text-[11px] leading-normal text-slate-500">
                                  {cfg.desc}
                                </p>
                              </div>
                              <RadioGroupItem
                                value={String(v)}
                                className="scale-85"
                              />
                            </label>
                          );
                        })}
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  )}
                />

                {/* SKALA DAMPAK */}
                <Controller
                  name="impact"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <IconFlame className="h-5 w-5 text-orange-500" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">
                            Skala Dampak
                          </h3>
                          <p className="text-muted-foreground text-[11px]">
                            Impact kerugian yang ditimbulkan risiko
                          </p>
                        </div>
                      </div>
                      <RadioGroup
                        value={field.value ? String(field.value) : ""}
                        onValueChange={field.onChange}
                        className="space-y-2.5"
                      >
                        {([1, 2, 3, 4, 5] as const).map((v) => {
                          const cfg = impactKeterangan[v];
                          const isChecked = String(field.value) === String(v);
                          return (
                            <label
                              key={v}
                              className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 transition-all duration-200 hover:bg-slate-50",
                                isChecked
                                  ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20"
                                  : "border-slate-100",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold",
                                  cfg.color,
                                )}
                              >
                                {v}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block text-xs font-bold text-slate-800">
                                  {cfg.label}
                                </span>
                                <p className="mt-0.5 text-[11px] leading-normal text-slate-500">
                                  {cfg.desc}
                                </p>
                              </div>
                              <RadioGroupItem
                                value={String(v)}
                                className="scale-85"
                              />
                            </label>
                          );
                        })}
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* MATRIKS SKOR AKHIR */}
            {numL > 0 && numI > 0 ? (
              <Card
                className={cn(
                  "w-full border bg-linear-to-br py-2.5 shadow-xs transition-all",
                  finalRisk.bgGradient,
                )}
              >
                <CardContent className="flex flex-col items-center justify-between gap-2 p-4 py-2 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "rounded-lg border border-white bg-white/80 p-1.5 shadow-xs",
                        finalRisk.textClass,
                      )}
                    >
                      <IconAlertTriangle size={18} className="animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Hasil Kalkulasi Residu Akhir
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Kalkulasi otomatis dari skor:{" "}
                        <span className="font-semibold text-slate-800">
                          Likelihood ({numL})
                        </span>{" "}
                        ×{" "}
                        <span className="font-semibold text-slate-800">
                          Impact ({numI})
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center gap-6 rounded-xl border border-white/60 bg-white/50 px-5 py-2.5 shadow-inner sm:w-auto sm:justify-end">
                    <div className="text-center">
                      <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                        Total Skor
                      </span>
                      <span
                        className={cn(
                          "block text-3xl font-black tracking-tight",
                          finalRisk.textClass,
                        )}
                      >
                        {calculatedScore}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-300/60" />
                    <div className="text-center sm:text-left">
                      <span className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                        Tingkat Risiko
                      </span>
                      <Badge
                        className={cn(
                          "border-none px-3 py-0.5 text-xs font-bold shadow-sm shadow-black/10",
                          finalRisk.badgeClass,
                        )}
                      >
                        {finalRisk.label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs font-medium text-slate-400">
                💡 Silakan tentukan nilai Likelihood dan Impact di atas untuk
                melihat ringkasan skor matriks risiko.
              </div>
            )}
          </div>
        </FieldGroup>
      </form>

      {/* FOOTER ACTION BUTTONS */}
      <DialogFooter className="bg-background sticky bottom-0 flex w-full items-center gap-2 rounded-b-lg border-t p-4 sm:justify-end">
        <DialogClose asChild>
          <Button variant="outline" size="lg" type="button">
            Batal
          </Button>
        </DialogClose>
        <LoadingButton
          type="submit"
          form="form-analisis-residu"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty || !isValid}
        >
          {isSubmitting
            ? "Menyimpan..."
            : isEditMode
              ? "Simpan Perubahan"
              : "Simpan Analisis Residu"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
};

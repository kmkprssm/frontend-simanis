"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  IconActivity,
  IconAlertTriangle,
  IconCheck,
  IconFlame,
  IconBulb,
} from "@tabler/icons-react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "../ui/field";
import { LoadingButton } from "../ui/loading-button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { TAnalisisRisiko } from "@/types/analisis-risiko-type";
import {
  AnalisisRisikoSchema,
  AnalisisRisikoValues,
} from "@/schemas/analisis-risiko-schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  getRiskLevel,
  impactKeterangan,
  likelihoodKeterangan,
} from "@/helpers/risk-helpers";
import { SelectInfiniteRisikoForm } from "../select-infinite-risiko-form";
import { createUpdateAnalisisRisiko } from "@/server/apis/analisis-risiko";

interface AnalisisRisikoFormProps {
  id?: string;
  defaultValues?: TAnalisisRisiko;
  onSubmmitSuccess: () => void;
}

export const AnalisisRisikoForm = ({
  id,
  defaultValues,
  onSubmmitSuccess,
}: AnalisisRisikoFormProps) => {
  const [riskCounters, setRiskCounters] = React.useState({
    sudah: 0,
    belum: 0,
    total: 0,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentAnalisisId = defaultValues?.id;
  const isEditMode = !!currentAnalisisId;

  const initialFormValues = React.useMemo<Partial<AnalisisRisikoValues>>(() => {
    if (defaultValues) {
      return {
        risk_id: defaultValues.risk_id || "",
        impact:
          defaultValues.impact !== undefined
            ? String(defaultValues.impact)
            : "",
        likelihood:
          defaultValues.likelihood !== undefined
            ? String(defaultValues.likelihood)
            : "",
        score:
          defaultValues.score !== undefined ? String(defaultValues.score) : "",
      };
    }

    return {
      risk_id: id || "",
      impact: "",
      likelihood: "",
      score: "",
    };
  }, [defaultValues, id]);

  const form = useForm<AnalisisRisikoValues>({
    resolver: zodResolver(AnalisisRisikoSchema),
    defaultValues: initialFormValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const watchRiskId = useWatch({ control, name: "risk_id" });
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
      setValue("score", "", {
        shouldValidate: false,
        shouldDirty: isEditMode ? true : false,
      });
    }
  }, [numL, numI, calculatedScore, setValue, isEditMode]);

  const finalRisk = getRiskLevel(calculatedScore);

  const handleSubmitForm = async (values: AnalisisRisikoValues) => {
    const result = await createUpdateAnalisisRisiko(
      isEditMode ? currentAnalisisId : undefined,
      values,
    );

    if (result.success) {
      toast.success(
        isEditMode
          ? "Analisis resiko berhasil diperbarui!"
          : "Analisis resiko berhasil ditambahkan!",
        {
          position: "top-right",
        },
      );
      onSubmmitSuccess();

      const params = new URLSearchParams(searchParams.toString());

      if (!isEditMode) {
        params.delete("risk_id");
      }

      const newParamsStr = params.toString();
      const targetUrl = newParamsStr ? `${pathname}?${newParamsStr}` : pathname;

      router.replace(targetUrl, { scroll: false });
    } else {
      toast.error(result?.message || "Terjadi kesalahan.");
    }
  };

  return (
    <>
      <form
        id="form-analisis-resiko"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-4 p-6 py-2"
      >
        <FieldGroup>
          {/* CARD INFORMASI / PANDUAN BANNER */}
          <Card className="w-full gap-4 overflow-hidden border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-slate-200 bg-white p-3">
                <div className="absolute top-1/2 left-0 flex h-[calc(100%+2px)] w-10 -translate-y-1/2 items-center justify-center border-l-4 border-blue-500 bg-blue-500/5 text-blue-600">
                  <IconBulb className="animate-pulse" stroke={2} />
                </div>
                <div className="flex w-full flex-col gap-2 pl-9">
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Panduan Analisis Risiko
                  </CardTitle>
                  <p className="text-muted-foreground text-xs">
                    Pilih salah satu daftar risiko aktif di bawah untuk
                    dianalisis matriksnya.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Controller
                name="risk_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="risk_id"
                      className="mb-1.5 text-xs font-semibold text-slate-700"
                    >
                      Judul Risiko yang Dinilai
                    </FieldLabel>
                    {isEditMode ? (
                      <Button
                        id="risk_id"
                        type="button"
                        variant="outline"
                        className="h-10 w-full cursor-not-allowed justify-between border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 opacity-90 shadow-sm"
                        disabled
                      >
                        <span className="truncate">
                          {defaultValues?.nama_resiko ||
                            "Memuat data risiko..."}
                        </span>
                        <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                          Terkunci
                        </span>
                      </Button>
                    ) : (
                      <SelectInfiniteRisikoForm
                        mode="analisis_inherent"
                        value={field.value}
                        onChange={(id) => {
                          setValue("risk_id", id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        onCounterUpdate={setRiskCounters}
                      />
                    )}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardContent>
            <CardFooter className="pt-2">
              {isEditMode ? (
                <span className="text-xs font-medium text-slate-500">
                  Risiko sudah terpilih dan tidak bisa diganti dalam mode ubah.
                </span>
              ) : (
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs font-medium text-slate-500">
                    {riskCounters.belum} risiko belum dianalisis
                  </span>

                  {riskCounters.total > 0 && riskCounters.belum === 0 && (
                    <Badge className="gap-1 border-none bg-emerald-500 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-600">
                      <IconCheck size={12} /> Semua Selesai
                    </Badge>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>

          <div className="w-full space-y-6">
            <div className="space-y-2">
              <FieldLegend>Penilian Risiko</FieldLegend>
              <FieldDescription>
                Pilih nilai skala kemungkinan dan skala dampak dari risiko yang
                dipilih
              </FieldDescription>
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                {/* KOLOM KIRI: SKALA KEMUNGKINAN (LIKELIHOOD) */}
                <Controller
                  name="likelihood"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold shadow-sm",
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
                                className="mt-0.5 shrink-0"
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

                {/* KOLOM KANAN: SKALA DAMPAK (IMPACT) */}
                <Controller
                  name="impact"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold shadow-sm",
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
                                className="mt-0.5 shrink-0"
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

            {/* CARD HASIL KALKULASI AKHIR (HANYA MUNCUL JIKA KEDUANYA SUDAH DIPILIH) */}
            {numL > 0 && numI > 0 ? (
              <Card
                className={cn(
                  "w-full border bg-linear-to-br py-3 shadow-sm transition-all duration-300",
                  finalRisk.bgGradient,
                )}
              >
                <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div
                      className={cn(
                        "shrink-0 rounded-lg border border-white bg-white/80 p-2 shadow-sm",
                        finalRisk.textClass,
                      )}
                    >
                      <IconAlertTriangle className="h-6 w-6 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Hasil Analisis Risiko Matriks
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
      <DialogFooter className="bg-background sticky bottom-0 flex w-full items-center gap-2 rounded-b-4xl border-t p-4 sm:justify-end">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Batal
          </Button>
        </DialogClose>
        <LoadingButton
          type="submit"
          form="form-analisis-resiko"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            !isValid ||
            !isDirty ||
            !watchRiskId ||
            watchRiskId.trim() === "" ||
            numL === 0 ||
            numI === 0
          }
        >
          {isSubmitting
            ? "Menyimpan..."
            : defaultValues
              ? "Simpan Perubahan"
              : "Tambah Analisis Resiko"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
};

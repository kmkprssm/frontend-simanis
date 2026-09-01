"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBulb } from "@tabler/icons-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { LoadingButton } from "../ui/loading-button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { TEvaluasiRisiko } from "@/types/evaluasi-risiko-type";
import {
  EvaluasiRisikoSchema,
  EvaluasiRisikoValues,
} from "@/schemas/evaluasi-risiko-schema";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { SelectInfiniteRisikoForm } from "../select-infinite-risiko-form";
import { createUpdateEvaluasiRisiko } from "@/server/apis/evaluasi-risiko";

const STRATEGI_OPTIONS = [
  { id: "TREAT", name: "Mitigasi (TREAT)" },
  { id: "TRANSFER", name: "Transfer (TRANSFER)" },
  { id: "AVOID", name: "Hindari (AVOID)" },
  { id: "ACCEPT", name: "Terima (ACCEPT)" },
] as const;

const PRIORITAS_OPTIONS = [
  { id: "1", name: "Sangat Mendesak" },
  { id: "2", name: "Penting" },
  { id: "3", name: "Sedang" },
  { id: "4", name: "Monitoring" },
] as const;

interface EvaluasiRisikoFormProps {
  id?: string;
  defaultValues?: TEvaluasiRisiko;
  onSuccessSubmit: () => void;
}

export const EvaluasiRisikoForm = ({
  id,
  defaultValues,
  onSuccessSubmit,
}: EvaluasiRisikoFormProps) => {
  const [counters, setCounters] = React.useState({
    sudah: 0,
    belum: 0,
    total: 0,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentEvaluasiId = defaultValues?.id;
  const isEditMode = !!currentEvaluasiId;

  const initialFormValues = React.useMemo<Partial<EvaluasiRisikoValues>>(() => {
    if (defaultValues) {
      return {
        risk_id: defaultValues.risk_id || "",
        strategi:
          defaultValues.strategi !== undefined
            ? String(defaultValues.strategi)
            : "",
        prioritas:
          defaultValues.prioritas !== undefined
            ? String(defaultValues.prioritas)
            : "",
        justifikasi:
          defaultValues.justifikasi !== undefined
            ? defaultValues.justifikasi
            : "",
        is_active:
          defaultValues.is_active !== undefined
            ? defaultValues.is_active
            : true,
      };
    }

    return {
      risk_id: id || "",
      strategi: "",
      prioritas: "",
      justifikasi: "",
      is_active: true,
    };
  }, [defaultValues, id]);

  const form = useForm<EvaluasiRisikoValues>({
    resolver: zodResolver(EvaluasiRisikoSchema),
    defaultValues: initialFormValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const watchRiskId = useWatch({ control, name: "risk_id" });

  React.useEffect(() => {
    if (id && !isEditMode) {
      setValue("risk_id", id, { shouldValidate: true, shouldDirty: true });
    }
  }, [id, isEditMode, setValue]);

  const handleSubmitForm = async (values: EvaluasiRisikoValues) => {
    try {
      const result = await createUpdateEvaluasiRisiko(
        isEditMode ? currentEvaluasiId : undefined,
        values,
      );

      if (result.success) {
        toast.success(
          isEditMode
            ? "Evaluasi risiko berhasil diperbarui!"
            : "Evaluasi risiko berhasil ditambahkan!",
          { position: "top-right" },
        );

        onSuccessSubmit();

        const params = new URLSearchParams(searchParams.toString());

        if (!isEditMode) {
          params.delete("open_risk_id");
          params.delete("action");
        }

        const newParamsStr = params.toString();
        const targetUrl = newParamsStr
          ? `${pathname}?${newParamsStr}`
          : pathname;

        router.replace(targetUrl, { scroll: false });
      } else {
        toast.error(result?.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      toast.error("Terjadi masalah internal pada koneksi server.");
    }
  };

  return (
    <>
      <form
        id="form-evaluasi-risiko"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-4 p-6 py-2"
      >
        <FieldGroup>
          {/* CARD INFORMASI / PANDUAN BANNER */}
          <div className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-zinc-200 bg-white p-3">
            <div className="absolute top-1/2 left-0 flex h-[calc(100%+2px)] w-10 -translate-y-1/2 items-center justify-center border-l-4 border-blue-500 bg-blue-500/5 text-blue-600">
              <IconBulb className="animate-pulse" stroke={2} />
            </div>
            <div className="flex w-full flex-col gap-2 pl-9">
              <CardTitle className="text-sm font-bold text-zinc-800">
                Panduan Analisis Risiko
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Pilih salah satu daftar risiko aktif di bawah untuk dianalisis
                matriksnya.
              </p>
            </div>
          </div>
          <Card className="w-full overflow-hidden border-zinc-200 bg-white pb-0 shadow-sm">
            <CardContent>
              <Controller
                name="risk_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <label className="mb-1.5 block text-xs font-bold text-zinc-700">
                      Pilih Risiko Aktif yang akan Dievaluasi{" "}
                      <span className="text-red-500">*</span>
                    </label>
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
                        value={field.value}
                        onChange={(val) =>
                          setValue("risk_id", val, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        onCounterUpdate={setCounters}
                        mode="evaluasi_risiko"
                      />
                    )}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardContent>

            {/* FOOTER INFORMASI COUNTER (Data real-time, akurat langsung dari database) */}
            <CardFooter className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/60 p-3 text-xs text-zinc-500">
              <div className="flex items-center gap-1 text-zinc-400">
                <IconAlertCircle className="h-3.5 w-3.5" />
                <span>
                  Tersedia:{" "}
                  <span className="font-bold text-zinc-700">
                    {counters.total}
                  </span>{" "}
                  risiko aktif
                </span>
              </div>

              {counters.total > 0 && (
                <div className="text-[11px] font-medium">
                  <span className="text-amber-600">
                    {counters.belum} Belum Dievaluasi
                  </span>
                  <span className="mx-1.5 text-zinc-300">•</span>
                  <span className="text-emerald-600">
                    {counters.sudah} Sudah Dievaluasi
                  </span>
                </div>
              )}
            </CardFooter>
          </Card>
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground text-sm font-semibold">
              Keputusan Evaluasi
            </span>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="strategi"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="strategi"
                      className="block text-xs font-semibold text-zinc-700 after:ml-1 after:text-red-500 after:content-['*']"
                    >
                      Strategi Penanganan
                    </FieldLabel>

                    <Select
                      name={field.name}
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger
                        id="strategi"
                        aria-invalid={fieldState.invalid}
                        className="h-10 w-full border-zinc-200 bg-white"
                      >
                        <SelectValue placeholder="-- Pilih Strategi --" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {STRATEGI_OPTIONS.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="prioritas"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="prioritas"
                      className="block text-xs font-semibold text-zinc-700 after:ml-1 after:text-red-500 after:content-['*']"
                    >
                      Prioritas Penanganan
                    </FieldLabel>

                    <Select
                      name={field.name}
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger
                        id="prioritas"
                        aria-invalid={fieldState.invalid}
                        className="h-10 w-full border-zinc-200 bg-white"
                      >
                        <SelectValue placeholder="-- Pilih Prioritas --" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {PRIORITAS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="justifikasi"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="justifikasi"
                    className="block text-xs font-semibold text-zinc-700 after:ml-1 after:text-red-500 after:content-['*']"
                  >
                    Justifikasi & Catatan Evaluasi
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id="justifikasi"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan alasan atau catatan justifikasi hasil evaluasi risiko kerja..."
                    autoComplete="off"
                    className="min-h-22.5 border-zinc-200 bg-white text-sm focus-visible:ring-1"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
          form="form-evaluasi-risiko"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            !isValid ||
            !isDirty ||
            !watchRiskId ||
            watchRiskId.trim() === ""
          }
        >
          {isSubmitting ? "Menyimpan..." : "Tambah Evaluasi Risiko"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
};

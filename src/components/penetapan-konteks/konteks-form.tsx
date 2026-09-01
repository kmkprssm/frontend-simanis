"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { KonteksSchema, KonteksValues } from "@/schemas/konteks-schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { LoadingButton } from "../ui/loading-button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { TKonteks } from "@/types/konteks-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createUpdateKonteks } from "@/server/apis/penetapan-konteks";

interface KonteksFormProps {
  defaultValues?: TKonteks;
  onSubmitSuccess: () => void;
}

const METODE_EVALUASI_OPTIONS = [
  { value: "QUALITATIVE", label: "Kualitatif" },
  { value: "SEMI_QUANTITATIVE", label: "Semi Kuantitatif" },
  { value: "QUANTITATIVE", label: "Kuantitatif" },
];

const SELERA_RESIKO_OPTIONS = [
  "Sangat Rendah",
  "Rendah",
  "Sedang",
  "Tinggi",
  "Sangat Tinggi",
];

export const KonteksForm = ({
  defaultValues,
  onSubmitSuccess,
}: KonteksFormProps) => {
  const currentKonteksId = defaultValues?.id;
  const editData = !!currentKonteksId;

  const initialFormValues = React.useMemo<Partial<KonteksValues>>(() => {
    if (!defaultValues) return {};

    return {
      unit_kerja: defaultValues.unit_kerja,
      periode: defaultValues.periode,
      sasaran_strategis: defaultValues.sasaran_strategis,
      politik_ekonomi: defaultValues.politik_ekonomi,
      sosial_teknologi: defaultValues.sosial_teknologi,
      hukum_regulasi: defaultValues.hukum_regulasi,
      lingkungan: defaultValues.lingkungan,
      kapabilitas_sumber_daya: defaultValues.kapabilitas_sumber_daya,
      struktur_budaya: defaultValues.struktur_budaya,
      metode_evaluasi: defaultValues.metode_evaluasi,
      selera_resiko: defaultValues.selera_resiko,
      ambang_dampak_rp:
        defaultValues.ambang_dampak_rp !== undefined
          ? String(defaultValues.ambang_dampak_rp)
          : "",
    };
  }, [defaultValues]);

  const form = useForm<KonteksValues>({
    resolver: zodResolver(KonteksSchema),
    defaultValues: initialFormValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const handleSubmitForm = async (values: KonteksValues) => {
    const result = await createUpdateKonteks(currentKonteksId, values);

    if (!result.success) {
      toast.error(result?.message || "Terjadi kesalahan.");
    } else {
      toast.success(
        editData
          ? "Konteks berhasil diperbarui!"
          : "Konteks berhasil ditambahkan!",
        {
          position: "top-right",
        },
      );
      onSubmitSuccess();
    }
  };

  return (
    <>
      <form
        id="form-konteks"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-4 p-6 py-2"
      >
        <FieldGroup>
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground text-sm font-semibold">
              Informasi Umum
            </span>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* INPUT UNIT KERJA */}
              <Controller
                name="unit_kerja"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="unit_kerja"
                      className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                    >
                      Unit Kerja
                    </FieldLabel>
                    <Input
                      {...field}
                      id="unit_kerja"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: IT Department"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* INPUT PERIODE */}
              <Controller
                name="periode"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="periode">Periode</FieldLabel>
                    <Input
                      {...field}
                      id="periode"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: 2024 Q1"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* INPUT SASARAN STRATEGIS */}
            <Controller
              name="sasaran_strategis"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sasaran_strategis">
                    Sasaran Strategis
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="sasaran_strategis"
                    aria-invalid={fieldState.invalid}
                    placeholder="Deskripsi sasaran strategis organisasi..."
                    autoComplete="off"
                    className="min-h-30"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground text-sm font-semibold">
              Konteks Eksternal
            </span>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* INPUT Politik & Ekonomi */}
              <Controller
                name="politik_ekonomi"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="politik_ekonomi"
                      className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                    >
                      Politik & Ekonomi
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="politik_ekonomi"
                      className="min-h-30"
                      aria-invalid={fieldState.invalid}
                      placeholder="Analisis politik dan ekonomi.."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* INPUT Sosial & Teknologi */}
              <Controller
                name="sosial_teknologi"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sosial_teknologi">
                      Sosial & Teknologi
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="sosial_teknologi"
                      className="min-h-30"
                      aria-invalid={fieldState.invalid}
                      placeholder="Analisis sosial dan teknologi.."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* INPUT Hukum & Regulasi */}
              <Controller
                name="hukum_regulasi"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="hukum_regulasi">
                      Hukum & Regulasi
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="hukum_regulasi"
                      className="min-h-30"
                      aria-invalid={fieldState.invalid}
                      placeholder="Analisis hukum dan regulasi..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* INPUT Lingkungan */}
              <Controller
                name="lingkungan"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lingkungan">Lingkungan</FieldLabel>
                    <Textarea
                      {...field}
                      id="lingkungan"
                      className="min-h-30"
                      aria-invalid={fieldState.invalid}
                      placeholder="Analisis lingkungan..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground text-sm font-semibold">
              Konteks Internal
            </span>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* INPUT Kapabilitas SDM */}
              <Controller
                name="kapabilitas_sumber_daya"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="kapabilitas_sumber_daya"
                      className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                    >
                      Kapabilitas SDM
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="kapabilitas_sumber_daya"
                      className="min-h-30"
                      aria-invalid={fieldState.invalid}
                      placeholder="Analisis kapabilitas SDM.."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* INPUT Struktur & Budaya */}
              <Controller
                name="struktur_budaya"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="struktur_budaya">
                      Struktur & Budaya
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="struktur_budaya"
                      className="min-h-30"
                      aria-invalid={fieldState.invalid}
                      placeholder="Analisis struktur dan budaya organisasi.."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground text-sm font-semibold">
              Parameter Risiko
            </span>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* INPUT Metode Evaluasi */}
              <Controller
                name="metode_evaluasi"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="metode_evaluasi"
                      className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                    >
                      Metode Evaluasi
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Pilih metode" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {METODE_EVALUASI_OPTIONS.map((metode) => (
                          <SelectItem key={metode.value} value={metode.value}>
                            {metode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              {/* INPUT Metode Evaluasi */}
              <Controller
                name="selera_resiko"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="selera_resiko"
                      className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                    >
                      Metode Evaluasi
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Pilih selera" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {SELERA_RESIKO_OPTIONS.map((selera) => (
                          <SelectItem key={selera} value={selera}>
                            {selera}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              {/* INPUT Ambang Dampak (Rp) */}
              <Controller
                name="ambang_dampak_rp"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ambang_dampak_rp">
                      Ambang Dampak (Rp)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="ambang_dampak_rp"
                      type="number"
                      min={0}
                      aria-invalid={fieldState.invalid}
                      placeholder="50000000"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </FieldGroup>
      </form>
      <DialogFooter className="bg-background sticky bottom-0 flex gap-2 rounded-b-lg border-t p-4 sm:justify-end">
        <DialogClose asChild>
          <Button variant="outline" type="button" size={"lg"}>
            Batal
          </Button>
        </DialogClose>
        <LoadingButton
          type="submit"
          form="form-konteks"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty || !isValid}
        >
          {isSubmitting
            ? "Menyimpan..."
            : defaultValues
              ? "Simpan Perubahan"
              : "Tambah Konteks"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
};

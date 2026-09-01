"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { LoadingButton } from "../ui/loading-button";
import { Input } from "../ui/input";
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
import { TIdentifikasiRisiko } from "@/types/identifikasi-risiko-type";
import {
  InsertIdentifikasiRisikoSchema,
  InsertIdentifikasiRisikoValues,
} from "@/schemas/identifikasi-risiko-schema";
import { TKategoriRisiko } from "@/types/kategori-risiko-type";
import { createUpdateIdentifikasiRisiko } from "@/server/apis/identifikasi-risiko";

interface IdentifikasiRisikoFormProps {
  defaultValues?: TIdentifikasiRisiko;
  kategoriRisiko?: TKategoriRisiko[];
  onSubmitSuccess: () => void;
}

export const IdentifikasiRisikoForm = ({
  defaultValues,
  kategoriRisiko,
  onSubmitSuccess,
}: IdentifikasiRisikoFormProps) => {
  const currentRiskId = defaultValues?.id;
  const editData = !!currentRiskId;

  const initialFormValues = React.useMemo<
    Partial<InsertIdentifikasiRisikoValues>
  >(() => {
    if (!defaultValues) return {};

    return {
      nama_resiko: defaultValues.nama_resiko,
      deskripsi: defaultValues.deskripsi,
      root_cause: defaultValues.root_cause,
      consequences: defaultValues.consequences,
      existing_controls: defaultValues.existing_controls,
      kategori_id:
        defaultValues.kategori_id != null
          ? String(defaultValues.kategori_id)
          : "",
    };
  }, [defaultValues]);

  const form = useForm<InsertIdentifikasiRisikoValues>({
    resolver: zodResolver(InsertIdentifikasiRisikoSchema),
    defaultValues: initialFormValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const handleSubmitForm = async (values: InsertIdentifikasiRisikoValues) => {
    const transformedValues = {
      ...values,
      nama_resiko: values.nama_resiko?.toUpperCase(),
      deskripsi: values.deskripsi?.toUpperCase(),
      root_cause: values.root_cause?.toUpperCase(),
      consequences: values.consequences?.toUpperCase(),
      existing_controls: values.existing_controls?.toUpperCase(),
    };
    const result = await createUpdateIdentifikasiRisiko(
      currentRiskId,
      transformedValues,
    );

    if (!result.success) {
      toast.error(result?.message || "Terjadi kesalahan.");
    } else {
      toast.success(
        editData
          ? "Identifikasi risiko berhasil diperbarui!"
          : "Identifikasi risiko berhasil ditambahkan!",
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
        id="form-identifikasi-risiko"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-4 p-6 py-2"
      >
        <FieldGroup>
          {/* INPUT JUDUL RESIKO */}
          <Controller
            name="nama_resiko"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="nama_resiko"
                  className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Judul Risiko
                </FieldLabel>
                <Input
                  {...field}
                  id="nama_resiko"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan judul risiko..."
                  autoComplete="off"
                  className="uppercase"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* INPUT Kategori Resiko */}
          <Controller
            name="kategori_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="kategori_id"
                  className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Kategori Risiko
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <Select
                  name={field.name}
                  value={
                    field.value !== undefined && field.value !== null
                      ? String(field.value)
                      : ""
                  }
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger
                    id="kategori_id"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Pilih kategori risiko" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {kategoriRisiko &&
                      kategoriRisiko.map((kategori) => (
                        <SelectItem
                          key={kategori.id}
                          value={String(kategori.id)}
                        >
                          {kategori.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          {/* INPUT Deskripsi Resiko */}
          <Controller
            name="deskripsi"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="deskripsi"
                  className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Deskripsi Risiko
                </FieldLabel>
                <Textarea
                  {...field}
                  id="deskripsi"
                  aria-invalid={fieldState.invalid}
                  placeholder="Jelaskan risiko secara singkat..."
                  autoComplete="off"
                  className="min-h-30 uppercase"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* INPUT Penyebab Resiko */}
          <Controller
            name="root_cause"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="root_cause"
                  className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Penyebab
                </FieldLabel>
                <Textarea
                  {...field}
                  id="root_cause"
                  aria-invalid={fieldState.invalid}
                  placeholder="Penyebab utama risiko..."
                  autoComplete="off"
                  className="min-h-30 uppercase"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* INPUT Dampak Resiko */}
          <Controller
            name="consequences"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="consequences"
                  className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Dampak
                </FieldLabel>
                <Textarea
                  {...field}
                  id="consequences"
                  aria-invalid={fieldState.invalid}
                  placeholder="Jelaskan dampak yang mungkin terjadi..."
                  autoComplete="off"
                  className="min-h-30 uppercase"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* INPUT Pengendalian Resiko */}
          <Controller
            name="existing_controls"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="existing_controls"
                  className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Pengendalian yang Sudah Ada
                </FieldLabel>
                <Textarea
                  {...field}
                  id="existing_controls"
                  aria-invalid={fieldState.invalid}
                  placeholder="Pengendalian yang sudah diterapkan..."
                  autoComplete="off"
                  className="min-h-30 uppercase"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <DialogFooter className="bg-background sticky bottom-0 flex w-full items-center gap-2 rounded-b-lg border-t p-4 sm:justify-end">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Batal
          </Button>
        </DialogClose>
        <LoadingButton
          type="submit"
          form="form-identifikasi-risiko"
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
              : "Tambah Risiko"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
};

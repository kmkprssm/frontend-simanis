"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "../ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CreatePengendalianRisikoSchema,
  CreatePengendalianRisikoValues,
} from "@/schemas/perlakuan-risiko-schema";
import { TKontrolRisikoWithActions } from "@/types/perlakuan-risiko-type";

interface PengendalianRisikoFormProps {
  riskId: string;
  editData: TKontrolRisikoWithActions | null;
  onCancel: () => void;
  onSubmitSuccess: (values: CreatePengendalianRisikoValues) => Promise<void>;
}

const TIPE_KONTROL_OPTIONS = [
  {
    value: "PREVENTIVE",
    label: "Preventif (Mencegah)",
    color: "text-blue-600",
  },
  {
    value: "DETECTIVE",
    label: "Detektif (Mendeteksi)",
    color: "text-amber-600",
  },
  {
    value: "CORRECTIVE",
    label: "Korektif (Memperbaiki)",
    color: "text-orange-600",
  },
];

export const PengendalianRisikoForm = ({
  riskId,
  editData,
  onCancel,
  onSubmitSuccess,
}: PengendalianRisikoFormProps) => {
  const initialValues = React.useMemo<
    Partial<CreatePengendalianRisikoValues>
  >(() => {
    if (!editData)
      return { risk_id: riskId, nama_kontrol: "", tipe: "", deskripsi: "" };
    return {
      risk_id: riskId,
      nama_kontrol: editData.nama_kontrol,
      tipe: editData.tipe,
      deskripsi: editData.deskripsi || "",
    };
  }, [editData, riskId]);

  const form = useForm<CreatePengendalianRisikoValues>({
    resolver: zodResolver(CreatePengendalianRisikoSchema),
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  return (
    <div className="space-y-4 p-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 gap-1 text-slate-500 hover:text-slate-800"
        onClick={onCancel}
      >
        <IconArrowLeft className="h-4 w-4" /> Kembali ke Daftar
      </Button>

      <form
        id="form-pengendalian-risiko"
        onSubmit={handleSubmit(onSubmitSuccess)}
        className="space-y-4"
      >
        <FieldGroup>
          {/* INPUT NAMA KONTROL */}
          <Controller
            name="nama_kontrol"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="nama_kontrol"
                  className="text-xs font-bold text-slate-700 after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Nama Kontrol Pengendalian
                </FieldLabel>
                <Input
                  {...field}
                  id="nama_kontrol"
                  placeholder="Contoh: Pemasangan CCTV di area farmasi"
                  className="h-10 border-slate-200 text-sm"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* INPUT TIPE KONTROL */}
          <Controller
            name="tipe"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="tipe"
                  className="text-xs font-bold text-slate-700 after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Tipe Pengendalian
                </FieldLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="tipe"
                    className="h-10 border-slate-200 bg-white text-sm"
                  >
                    <SelectValue placeholder="Pilih Tipe Kontrol" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPE_KONTROL_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-xs"
                      >
                        <span className={cn("font-medium", opt.color)}>
                          {opt.label}
                        </span>
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

          {/* INPUT DESKRIPSI KONTROL */}
          <Controller
            name="deskripsi"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="deskripsi"
                  className="text-xs font-bold text-slate-700 after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Deskripsi Prosedur Kontrol
                </FieldLabel>
                <Textarea
                  {...field}
                  id="deskripsi"
                  placeholder="Jelaskan bagaimana kontrol ini bekerja, frekuensi, dan penanggung jawab teknisnya..."
                  className="min-h-25 border-slate-200 text-sm focus-visible:ring-1"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button variant="outline" type="button" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <LoadingButton
          type="submit"
          form="form-pengendalian-risiko"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty || !isValid}
          className="gap-1.5 px-4"
        >
          {editData ? "Simpan Perubahan" : "Simpan Kontrol"}
        </LoadingButton>
      </div>
    </div>
  );
};

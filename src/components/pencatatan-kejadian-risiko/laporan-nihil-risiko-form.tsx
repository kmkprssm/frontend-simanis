"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconShieldCheck } from "@tabler/icons-react";

import { createUpdateKejadianRisiko } from "@/server/apis/pencatatan-kejadian-risiko";
import {
  CreateKejadianRisikoSchema,
  CreateKejadianRisikoValues,
} from "@/schemas/pencatatan-kejadian-risiko-schema";
import { TLogRisikoBulanan } from "@/types/pencatatan-kejadian-risiko-type";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { SelectInfiniteRisikoForm } from "../select-infinite-risiko-form";

interface FormLaporanNihilRisikoProps {
  logMaster: TLogRisikoBulanan;
  onSuccess: () => void;
}

export const FormLaporanNihilRisiko = ({
  logMaster,
  onSuccess,
}: FormLaporanNihilRisikoProps) => {
  const form = useForm<CreateKejadianRisikoValues>({
    resolver: zodResolver(CreateKejadianRisikoSchema),
    defaultValues: {
      tahun: logMaster.tahun,
      bulan: logMaster.bulan,
      status_laporan: "NIHIL",
      list_detail_nihil: {
        risk_id: "",
        keterangan_nihil: "",
      },
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmitForm = async (values: CreateKejadianRisikoValues) => {
    const payload = { ...values, status_laporan: "NIHIL" as const };
    const response = await createUpdateKejadianRisiko(undefined, payload);

    if (response.success) {
      toast.success("Seluruh risiko periode ini berhasil divalidasi NIHIL.");
      onSuccess();
    } else {
      toast.error(response.message || "Gagal memproses laporan nihil.");
    }
  };

  return (
    <form
      id="form-nihil-kejadian"
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-4"
    >
      <Controller
        name="list_detail_nihil.risk_id"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
              Pilih Risiko Aktif
            </FieldLabel>
            <SelectInfiniteRisikoForm
              mode="nihil_kejadian"
              bulan={logMaster.bulan}
              tahun={logMaster.tahun}
              value={field.value}
              onChange={(id) => {
                setValue("list_detail_nihil.risk_id", id, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="list_detail_nihil.keterangan_nihil"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
              Alasan Tidak Ada Kejadian
            </FieldLabel>
            <Textarea
              {...field}
              placeholder="Contoh: Kontrol internal berjalan optimal, pemeliharaan berkala sukses dilakukan..."
              className="min-h-20 border-slate-200 text-sm focus-visible:ring-1"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex justify-end pt-2">
        <LoadingButton
          type="submit"
          form="form-nihil-kejadian"
          size="lg"
          variant="default"
          className="w-full px-6 text-xs font-semibold sm:w-auto"
          loadingType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isValid}
        >
          <IconShieldCheck className="mr-1.5 h-4 w-4" /> Simpan Laporan Nihil
        </LoadingButton>
      </div>
    </form>
  );
};

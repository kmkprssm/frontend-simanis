"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconUpload,
  IconInfoCircle,
  IconCalendar,
  IconArrowLeft,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  CompleteTindakanRisikoSchema,
  CompleteTindakanValues,
} from "@/schemas/perlakuan-risiko-schema";
import { TRencanaAksiRisiko } from "@/types/perlakuan-risiko-type";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, dateFormat } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

interface CompleteTindakanRisikoForm {
  actionData: TRencanaAksiRisiko | null;
  onCancel: () => void;
  onSubmitSuccess: (values: CompleteTindakanValues) => Promise<void>;
}

export const CompleteTindakanRisikoForm = ({
  actionData,
  onCancel,
  onSubmitSuccess,
}: CompleteTindakanRisikoForm) => {
  const [open, setOpen] = React.useState(false);

  const initialValues = React.useMemo<Partial<CompleteTindakanValues>>(() => {
    return {
      kontrol_id: actionData?.kontrol_id || "",
      action_plan: actionData?.action_plan || "",
      pic_name: actionData?.pic_name || "",
      target_date: actionData?.target_date
        ? new Date(actionData.target_date)
        : undefined,
      created_by_uuid: actionData?.created_by_uuid || undefined,
      status: "Closed",
      realisasi_date: actionData?.realisasi_date
        ? new Date(actionData.realisasi_date)
        : undefined,
      bukti_mitigasi: actionData?.bukti_mitigasi || "",
    };
  }, [actionData]);

  const form = useForm<CompleteTindakanValues>({
    resolver: zodResolver(CompleteTindakanRisikoSchema),
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 gap-1 text-slate-500"
        onClick={onCancel}
      >
        <IconArrowLeft className="h-4 w-4" /> Kembali
      </Button>
      <div className="flex gap-2 rounded-lg border border-sky-100 bg-sky-50 p-3 text-xs text-sky-800">
        <IconInfoCircle className="h-4 w-4 shrink-0 text-sky-600" />
        <p>
          Pastikan rencana tindakan: <strong>{actionData?.action_plan}</strong>{" "}
          sudah benar-benar direalisasikan di lapangan sebelum mengunci status
          menjadi Selesai.
        </p>
      </div>

      <form
        id="form-complete"
        onSubmit={handleSubmit(onSubmitSuccess)}
        className="space-y-4"
      >
        <Controller
          name="realisasi_date"
          control={control}
          render={({ field, fieldState }) => {
            const selectedDate = field.value
              ? new Date(field.value)
              : undefined;

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
                  Tanggal Realisasi
                </FieldLabel>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-10 w-full justify-start gap-2 border-slate-200 bg-white px-3 text-left text-sm font-normal shadow-2xs",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <IconCalendar className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {selectedDate ? (
                          dateFormat(selectedDate)
                        ) : (
                          <span>-- Pilih Tanggal Realisasi --</span>
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="bukti_mitigasi"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
                Link Bukti (G-Drive / Dokumen)
              </FieldLabel>
              <Input
                {...field}
                type="url"
                placeholder="https://..."
                className="h-10 text-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="lg" onClick={onCancel}>
          Batal
        </Button>
        <LoadingButton
          type="submit"
          form="form-complete"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty || !isValid}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <IconUpload className="mr-1.5 h-4 w-4" />
          {actionData?.status === "Closed"
            ? "Simpan Perubahan"
            : "Konfirmasi Selesai"}
        </LoadingButton>
      </div>
    </div>
  );
};

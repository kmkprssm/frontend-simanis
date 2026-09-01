"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft, IconCalendar } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  CreateTindakanRisikoSchema,
  CreateTindakanValues,
} from "@/schemas/perlakuan-risiko-schema";
import { TRencanaAksiRisiko } from "@/types/perlakuan-risiko-type";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, dateFormat } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

interface TindakanRisikoFormProps {
  kontrolId: string;
  editData: TRencanaAksiRisiko | null;
  onCancel: () => void;
  onSubmitSuccess: (values: CreateTindakanValues) => Promise<void>;
}

export const TindakanRisikoForm = ({
  kontrolId,
  editData,
  onCancel,
  onSubmitSuccess,
}: TindakanRisikoFormProps) => {
  const [open, setOpen] = React.useState(false);

  const initialValues = React.useMemo<Partial<CreateTindakanValues>>(() => {
    if (!editData) {
      return {
        kontrol_id: kontrolId,
        action_plan: "",
        pic_name: "",
        target_date: undefined,
        status: "Open",
      };
    }
    return {
      kontrol_id: kontrolId,
      action_plan: editData.action_plan,
      pic_name: editData.pic_name,
      target_date: editData.target_date
        ? new Date(editData.target_date)
        : undefined,
      status: editData.status || "Open",
    };
  }, [editData, kontrolId]);

  const form = useForm<CreateTindakanValues>({
    resolver: zodResolver(CreateTindakanRisikoSchema),
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
      <form
        id="form-action"
        onSubmit={handleSubmit(onSubmitSuccess)}
        className="space-y-4"
      >
        <Controller
          name="action_plan"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="action_plan"
                className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']"
              >
                Uraian Rencana Tindakan
              </FieldLabel>
              <Textarea
                {...field}
                id="action_plan"
                placeholder="Tindakan yang akan dilakukan..."
                className="min-h-25 border-slate-200 text-sm focus-visible:ring-1"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="pic_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="pic_name"
                  className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']"
                >
                  Nama PIC
                </FieldLabel>
                <Input
                  {...field}
                  id="pic_name"
                  placeholder="Contoh: John Doe"
                  className="h-10 text-sm"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="target_date"
            control={control}
            render={({ field, fieldState }) => {
              const selectedDate = field.value
                ? new Date(field.value)
                : undefined;

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
                    Target Selesai (Deadline)
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
                            <span>-- Pilih Tanggal Batas Waktu --</span>
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
                        disabled={{ before: new Date() }}
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
        </div>
      </form>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="lg" onClick={onCancel}>
          Batal
        </Button>
        <LoadingButton
          type="submit"
          form="form-action"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty || !isValid}
        >
          {editData ? "Simpan Perubahan" : "Simpan Tindakan"}
        </LoadingButton>
      </div>
    </div>
  );
};

"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertCircle, IconCalendar } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, dateFormat } from "@/lib/utils";

import {
  TKejadianRisikoDetail,
  TLogRisikoBulanan,
} from "@/types/pencatatan-kejadian-risiko-type";
import {
  CreateKejadianRisikoSchema,
  CreateKejadianRisikoValues,
} from "@/schemas/pencatatan-kejadian-risiko-schema";
import { createUpdateKejadianRisiko } from "@/server/apis/pencatatan-kejadian-risiko";
// import { useModalStore } from "@/stores/modal-store";
import { SelectInfiniteRisikoForm } from "../select-infinite-risiko-form";
import { TRisikoChoosed } from "@/types/risiko-type";

interface DetailKejadianRisikoFormProps {
  logMaster: TLogRisikoBulanan;
  defaultValues?: TKejadianRisikoDetail;
  onSuccessSubmit: () => void;
}

export const DetailKejadianRisikoForm = ({
  logMaster,
  defaultValues,
  onSuccessSubmit,
}: DetailKejadianRisikoFormProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedRiskInfo, setSelectedRiskInfo] =
    React.useState<TRisikoChoosed | null>(null);
  const [currentCalendarMonth, setCurrentCalendarMonth] = React.useState<Date>(
    () => new Date(logMaster.tahun, logMaster.bulan - 1, 1),
  );

  // const { onOpen } = useModalStore();

  const currentDetailKejadianId = defaultValues?.kejadian_id;
  const isEditMode = !!currentDetailKejadianId;

  const initialFormValues = React.useMemo<
    Partial<CreateKejadianRisikoValues>
  >(() => {
    if (defaultValues) {
      return {
        tahun: logMaster.tahun,
        bulan: logMaster.bulan,
        status_laporan: "TERJADI_RISIKO",
        detail_kejadian: {
          risk_id: defaultValues.risk_id,
          tanggal_kejadian: defaultValues.tanggal_kejadian
            ? new Date(defaultValues.tanggal_kejadian)
            : new Date(),
          sebab_saat_ini: defaultValues.sebab_saat_ini || "",
          dampak_riil: defaultValues.dampak_riil || "",
          tindakan_lanjutan: defaultValues.tindakan_lanjutan || "",
        },
      };
    }
    return {
      tahun: logMaster.tahun,
      bulan: logMaster.bulan,
      status_laporan: "TERJADI_RISIKO",
      detail_kejadian: {
        risk_id: "",
        tanggal_kejadian: new Date() || undefined,
        sebab_saat_ini: "",
        dampak_riil: "",
        tindakan_lanjutan: "",
      },
    };
  }, [defaultValues, logMaster]);

  const form = useForm<CreateKejadianRisikoValues>({
    resolver: zodResolver(CreateKejadianRisikoSchema),
    defaultValues: initialFormValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const watchRiskId = useWatch({ control, name: "detail_kejadian.risk_id" });

  const onExecuteSubmit = async (values: CreateKejadianRisikoValues) => {
    try {
      const response = await createUpdateKejadianRisiko(
        isEditMode ? defaultValues.kejadian_id : undefined,
        values,
      );

      if (response.success) {
        // const inputtedRiskId = values.detail_kejadian?.risk_id;
        toast.success(
          isEditMode
            ? "Catatan kejadian risiko berhasil diperbarui"
            : "Kejadian risiko berhasil ditambahkan",
        );
        onSuccessSubmit();
        onSuccessSubmit();

        // setTimeout(() => {
        //   onOpen(
        //     "redirectSavedKejadianRisiko",
        //     {
        //       title: "Catatan Insiden Berhasil Disimpan!",
        //       message:
        //         "Risiko induk otomatis berstatus Re-open. Sesuai regulasi BPKP, Anda wajib melakukan evaluasi matriks ulang terhadap risiko ini.",
        //     },
        //     {
        //       id: inputtedRiskId,
        //     },
        //   );
        // }, 300);
      } else {
        toast.error(response.message || "Gagal memproses data kejadian.");
      }
    } catch (error) {
      toast.error("Terjadi masalah internal pada koneksi server.");
    }
  };

  const isSelectedRiskClosed = React.useMemo(() => {
    if (!selectedRiskInfo) return false;
    const status = selectedRiskInfo.status.toUpperCase();
    return status === "CLOSE" || status === "CLOSED";
  }, [selectedRiskInfo]);

  return (
    <form
      id="form-kejadian-detail"
      onSubmit={handleSubmit(onExecuteSubmit)}
      className="space-y-4"
    >
      <Controller
        name="detail_kejadian.risk_id"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
              Pilih Risiko Terkait
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
                  {defaultValues?.nama_resiko || "Memuat data risiko..."}
                </span>
                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                  Terkunci
                </span>
              </Button>
            ) : (
              <SelectInfiniteRisikoForm
                mode="pencatatan_kejadian"
                value={field.value}
                onChange={(id, obj) => {
                  setValue("detail_kejadian.risk_id", id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setSelectedRiskInfo(obj || null);
                }}
              />
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {isSelectedRiskClosed && !isEditMode && (
        <div className="animate-fadeIn flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50/60 p-3 text-xs text-slate-700">
          <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-800">
              Informasi Pembukaan Siklus
            </span>
            <p className="leading-normal text-slate-600">
              Risiko ini berstatus{" "}
              <span className="font-bold text-slate-500">Ditutup (Close)</span>.
              Setelah laporan ini disimpan, sistem secara otomatis akan mengubah
              status utamanya menjadi{" "}
              <span className="font-bold text-blue-600">Re-open</span> agar Anda
              dapat menambahkan dokumen pengendalian baru di menu Perlakuan
              Risiko.
            </p>
          </div>
        </div>
      )}

      {/* 1. INPUT FIELD: TANGGAL KEJADIAN */}
      <Controller
        name="detail_kejadian.tanggal_kejadian"
        control={control}
        render={({ field, fieldState }) => {
          const rawDate = field.value ? new Date(field.value) : undefined;

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
                Tanggal Kejadian Konkret
              </FieldLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 w-full justify-start gap-2 border-slate-200 bg-white px-3 text-left text-sm font-normal shadow-2xs",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <IconCalendar className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {rawDate ? (
                        dateFormat(rawDate)
                      ) : (
                        <span>-- Pilih Tanggal Kejadian --</span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={rawDate}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    key={`${logMaster.tahun}-${logMaster.bulan}`}
                    defaultMonth={
                      new Date(logMaster.tahun, logMaster.bulan - 1, 1)
                    }
                    month={currentCalendarMonth}
                    onMonthChange={setCurrentCalendarMonth}
                    disabled={(date) => {
                      if (!date) return true;
                      const hariIni = new Date();
                      hariIni.setHours(0, 0, 0, 0);
                      const isFutureDate = date > hariIni;
                      const isOutsideMonthOrYear =
                        date.getMonth() + 1 !== logMaster.bulan ||
                        date.getFullYear() !== logMaster.tahun;

                      return isFutureDate || isOutsideMonthOrYear;
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      {/* 2. INPUT FIELD: PENYEBAB SAAT INI */}
      <Controller
        name="detail_kejadian.sebab_saat_ini"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
              Penyebab Saat Ini (Akar Masalah Lapangan)
            </FieldLabel>
            <Textarea
              {...field}
              placeholder="Uraikan detail penyebab mengapa sistem/pengendalian internal bisa terbobol..."
              className="min-h-20 border-slate-200 text-sm focus-visible:ring-1"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* 3. INPUT FIELD: DAMPAK RIIL */}
      <Controller
        name="detail_kejadian.dampak_riil"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
              Dampak Riil (Kerugian Nyata Saat Insiden)
            </FieldLabel>
            <Textarea
              {...field}
              placeholder="Sebutkan kerugian konkret saat itu (misal: pelayanan macet 30 menit, data korup, dsb)..."
              className="min-h-20 border-slate-200 text-sm focus-visible:ring-1"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* 4. INPUT FIELD: TINDAKAN LANJUTAN */}
      <Controller
        name="detail_kejadian.tindakan_lanjutan"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xs font-bold after:ml-1 after:text-red-500 after:content-['*']">
              Tindakan Lanjutan Kejadian
            </FieldLabel>
            <Textarea
              {...field}
              placeholder="Sebutkan tindakan lanjutan dari kejadian risiko ini"
              className="min-h-20 border-slate-200 text-sm focus-visible:ring-1"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex justify-end pt-2">
        <LoadingButton
          type="submit"
          form="form-kejadian-detail"
          size="lg"
          variant="default"
          className="w-full px-6 text-xs font-semibold sm:w-auto"
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
          {isEditMode ? "Simpan Perubahan Kejadian" : "Simpan Detail Kejadian"}
        </LoadingButton>
      </div>
    </form>
  );
};

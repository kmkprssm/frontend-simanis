"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  IconCheck,
  IconSelector,
  IconLoader2,
  IconHistory,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { useInfiniteChoosedRisks } from "@/hooks/use-infinite-choosed-risks";
import { TRisikoChoosed } from "@/types/risiko-type";
import { getStatusRisiko } from "@/helpers/risk-helpers";

type TSelectMode =
  | "analisis_inherent"
  | "evaluasi_risiko"
  | "pencatatan_kejadian"
  | "pengendalian_risiko"
  | "nihil_kejadian";

interface SelectInfiniteRisikoFormProps {
  mode: TSelectMode;
  value?: string;
  onChange: (riskId: string, selectedObj?: TRisikoChoosed) => void;
  onCounterUpdate?: (counters: {
    sudah: number;
    belum: number;
    total: number;
    aktif: number;
    tertutup: number;
  }) => void;
  bulan?: number;
  tahun?: number;
}

export function SelectInfiniteRisikoForm({
  mode,
  value,
  onChange,
  onCounterUpdate,
  bulan,
  tahun,
}: SelectInfiniteRisikoFormProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const apiTypeParam = React.useMemo(() => {
    if (mode === "pencatatan_kejadian") return "all";
    if (mode === "pengendalian_risiko") return "all";
    if (mode === "nihil_kejadian") return "active";
    return "active";
  }, [mode]);

  const apiStrategiParam = React.useMemo(() => {
    if (mode === "pengendalian_risiko") return "TREAT";
    return "";
  }, [mode]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteChoosedRisks({
      type: apiTypeParam,
      strategi: apiStrategiParam,
      search: debouncedSearch,
      limit: 10,
      mode: mode,
      bulan: mode === "nihil_kejadian" ? bulan : undefined,
      tahun: mode === "nihil_kejadian" ? tahun : undefined,
    });

  const flatRisikoList = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.risiko || []);
  }, [data]);

  const metaCounter = data?.pages[0]?.meta;

  // Trigger effect counter update jika dibutuhkan oleh form master
  React.useEffect(() => {
    if (metaCounter && onCounterUpdate) {
      if (mode === "evaluasi_risiko") {
        onCounterUpdate({
          sudah: metaCounter.totalSudahEvaluasi || 0,
          belum: metaCounter.totalBelumEvaluasi || 0,
          total: metaCounter.totalRows || 0,
          aktif: metaCounter.totalAktif || 0,
          tertutup: metaCounter.totalTidakAktif || 0,
        });
      } else if (mode === "analisis_inherent") {
        // 🌟 Sinkronisasi Counter khusus Analisis Risiko Inherent
        onCounterUpdate({
          sudah: metaCounter.totalSudahAnalisis || 0,
          belum: metaCounter.totalBelumAnalisis || 0,
          total: metaCounter.totalRows || 0,
          aktif: metaCounter.totalAktif || 0,
          tertutup: metaCounter.totalTidakAktif || 0,
        });
      }
    }
  }, [metaCounter, onCounterUpdate, mode]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 12 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const selectedRisiko = flatRisikoList.find((r) => r.risk_id === value);

  // Dynamic Placeholder Button Teks
  const getPlaceholderText = () => {
    if (
      mode === "analisis_inherent" &&
      metaCounter &&
      metaCounter.totalBelumAnalisis === 0
    ) {
      return "🎉 Semua risiko sudah dianalisis!";
    }
    if (mode === "pencatatan_kejadian")
      return "-- Pilih Risiko yang Terjadi --";
    if (mode === "pengendalian_risiko") return "Semua Risiko (Filter Treat)";
    return "-- Pilih Risiko Aktif --";
  };

  const isDropdownDisabled =
    mode === "analisis_inherent" &&
    metaCounter &&
    metaCounter.totalBelumAnalisis === 0 &&
    !value;

  return (
    <div className="w-full space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "h-10 w-full justify-between border-slate-200 bg-white text-sm font-normal shadow-xs",
              !value && "text-muted-foreground",
              isDropdownDisabled && "cursor-not-allowed bg-slate-50 opacity-75",
              mode === "pengendalian_risiko" && "w-64",
            )}
            disabled={isDropdownDisabled}
          >
            <span className="truncate text-left">
              {value && selectedRisiko
                ? `${selectedRisiko.nama_resiko}`
                : getPlaceholderText()}
            </span>
            <IconSelector className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command filter={() => 1}>
            <CommandInput
              placeholder="Cari judul risiko induk..."
              value={search}
              onValueChange={setSearch}
              className="text-sm"
            />
            <CommandList
              ref={scrollRef}
              onScroll={handleScroll}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="no-scrollbar max-h-60 overflow-y-auto p-1"
            >
              {isLoading ? (
                <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-xs">
                  <IconLoader2 className="h-4 w-4 animate-spin text-blue-600" />{" "}
                  Memuat data...
                </div>
              ) : flatRisikoList.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center text-xs">
                  Risiko tidak ditemukan.
                </div>
              ) : (
                <CommandGroup>
                  {/* Opsi khusus 'Semua Risiko' hanya untuk mode pengendalian risiko */}
                  {mode === "pengendalian_risiko" && search.trim() === "" && (
                    <CommandItem
                      value="all_resiko"
                      onSelect={() => {
                        onChange("");
                        setOpen(false);
                      }}
                      className="flex cursor-pointer justify-center border-b border-slate-100 bg-slate-50/50 py-2 text-center text-xs font-medium text-slate-500 hover:bg-slate-100"
                    >
                      --- Tampilkan Semua Risiko (Treat) ---
                    </CommandItem>
                  )}

                  {flatRisikoList.map((risikoItem) => {
                    const isChecked = value === risikoItem.risk_id;
                    const status = getStatusRisiko(risikoItem.status);

                    return (
                      <CommandItem
                        key={risikoItem.risk_id}
                        value={risikoItem.risk_id}
                        onSelect={() => {
                          onChange(risikoItem.risk_id, risikoItem);
                          setOpen(false);
                          setSearch("");
                        }}
                        className="flex cursor-pointer items-start justify-between gap-2 py-2.5 text-xs"
                      >
                        <div className="flex min-w-0 flex-1 items-start">
                          <IconCheck
                            className={cn(
                              "mt-0.5 mr-2 h-4 w-4 shrink-0 text-emerald-600",
                              isChecked ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <div className="flex flex-col gap-0.5 truncate whitespace-normal">
                            <span className="leading-tight font-medium text-slate-800">
                              {risikoItem.nama_resiko}
                            </span>

                            {/* ================= CONDITIONING METADATA SUB-TEXT (POIN 3) ================= */}
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {/* Tampilkan Badge Kategori jika ada */}
                              {mode !== "pengendalian_risiko" &&
                                risikoItem.kategori_name && (
                                  <span className="rounded bg-blue-50 px-1 text-[9px] font-bold text-blue-600 uppercase">
                                    {risikoItem.kategori_name}
                                  </span>
                                )}
                              {/* Khusus mode pencatatan kejadian: infokan jika status closed */}
                              {mode === "pencatatan_kejadian" && (
                                <Badge
                                  className="px-1 text-[9px] font-bold uppercase"
                                  variant={status.badgeClass}
                                >
                                  {status.label}
                                </Badge>
                              )}
                              {mode === "pengendalian_risiko" && (
                                <Badge
                                  className="rounded px-1 text-[9px] font-bold uppercase"
                                  variant={status.badgeClass}
                                >
                                  {status.label}
                                </Badge>
                              )}
                              {/* Tampilkan strategi jika sudah dievaluasi */}
                              {risikoItem.strategi_evaluasi && (
                                <span className="text-[9px] font-medium text-zinc-500">
                                  🛡️ Strategi: {risikoItem.strategi_evaluasi}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {mode !== "pengendalian_risiko" &&
                          risikoItem.sudah_evaluasi && (
                            <Badge
                              variant="outline"
                              className="shrink-0 gap-0.5 border-emerald-200 bg-emerald-50 text-[9px] text-emerald-700"
                            >
                              <IconHistory className="h-2.5 w-2.5" /> Sudah
                              Evaluasi ✓
                            </Badge>
                          )}
                      </CommandItem>
                    );
                  })}
                  {isFetchingNextPage && (
                    <div className="text-muted-foreground flex items-center justify-center gap-1.5 p-2 text-xs">
                      <IconLoader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />{" "}
                      Lebih banyak...
                    </div>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {metaCounter && (
        <div className="flex items-center gap-3 px-1 text-[11px] font-medium text-slate-400">
          {mode === "pencatatan_kejadian" ||
            (mode === "nihil_kejadian" && (
              <>
                <div>
                  Total Aktif:{" "}
                  <span className="font-bold text-emerald-600">
                    {metaCounter.totalAktif ?? 0}
                  </span>
                </div>
                <div className="h-2 w-px bg-slate-200" />
                <div>
                  Total Ditutup:{" "}
                  <span className="font-bold text-slate-500">
                    {metaCounter.totalTidakAktif ?? 0}
                  </span>
                </div>
              </>
            ))}
        </div>
      )}
    </div>
  );
}

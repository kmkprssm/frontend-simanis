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
import { IconCheck, IconSelector, IconLoader2 } from "@tabler/icons-react";
import { useInfiniteRisksKejadian } from "@/hooks/use-infinite-choosen-risks";
import { Badge } from "../ui/badge";
import { TRisikoOption } from "@/types/pencatatan-kejadian-risiko-type";

interface SelectInfiniteRisikoProps {
  value?: string;
  onChange: (riskId: string, selectedRiskObj?: TRisikoOption) => void;
}

export function SelectInfiniteRisiko({
  value,
  onChange,
}: SelectInfiniteRisikoProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Debouncer lokal (500ms) agar tidak membebani server setiap kali ketukan tombol keyboard
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Konsumsi data infinite query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteRisksKejadian({
      search: debouncedSearch,
      limit: 10,
    });

  // Flat array dari data halaman bertingkat
  const flatRisikoList = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.risiko);
  }, [data]);

  // Ekstrak total counter dari halaman pertama metadata
  const metaCounter = data?.pages[0]?.meta;

  // Deteksi scroll ke bawah untuk infinite pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const selectedRisiko = flatRisikoList.find((r) => r.risk_id === value);

  return (
    <div className="w-full space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-full justify-between border-slate-200 bg-white px-3 text-sm font-normal shadow-2xs hover:bg-slate-50"
          >
            <span
              className={cn(
                "truncate text-left",
                !value && "text-muted-foreground",
              )}
            >
              {value && selectedRisiko
                ? selectedRisiko.nama_resiko
                : "-- Pilih Risiko yang Terjadi --"}
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
              placeholder="Cari nama risiko induk..."
              value={search}
              onValueChange={setSearch}
              className="text-sm"
            />
            <CommandList
              ref={scrollRef}
              onScroll={handleScroll}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="no-scrollbar max-h-56 overflow-y-auto p-1"
            >
              {isLoading ? (
                <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-xs">
                  <IconLoader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Memuat daftar risiko...
                </div>
              ) : flatRisikoList.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center text-xs">
                  Risiko tidak ditemukan.
                </div>
              ) : (
                <CommandGroup>
                  {flatRisikoList.map((risiko) => {
                    const isClosed =
                      risiko.status.toUpperCase() === "CLOSE" ||
                      risiko.status.toUpperCase() === "CLOSED";
                    return (
                      <CommandItem
                        key={risiko.risk_id}
                        value={risiko.risk_id}
                        onSelect={() => {
                          onChange(risiko.risk_id, risiko);
                          setOpen(false);
                        }}
                        className="flex cursor-pointer items-start gap-1 rounded-md p-2 text-xs"
                      >
                        <IconCheck
                          className={cn(
                            "mt-0.5 mr-1 h-4 w-4 shrink-0 text-blue-600",
                            value === risiko.risk_id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="leading-tight font-semibold text-slate-800">
                            {risiko.nama_resiko}
                          </span>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-sm px-1.5 py-0 text-[9px] font-bold tracking-wider uppercase",
                                isClosed
                                  ? "border-slate-200 bg-slate-50 text-slate-500"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
                              )}
                            >
                              {isClosed ? "Ditutup" : "Aktif"}
                            </Badge>
                            <span className="text-[10px] text-slate-400">
                              {risiko.strategi || "TREAT"}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}

                  {isFetchingNextPage && (
                    <div className="text-muted-foreground flex items-center justify-center gap-1.5 p-2 text-xs">
                      <IconLoader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                      Memuat data lebih banyak...
                    </div>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* 5. INFORMASI TOTAL COUNTER RISIKO AKTIF & TIDAK AKTIF */}
      {metaCounter && (
        <div className="flex items-center gap-3 px-1 text-[11px] font-medium text-slate-400">
          <div>
            Total Aktif:{" "}
            <span className="font-bold text-emerald-600">
              {metaCounter.total_aktif ?? 0}
            </span>
          </div>
          <div className="h-2 w-px bg-slate-200" />
          <div>
            Total Ditutup:{" "}
            <span className="font-bold text-slate-500">
              {metaCounter.total_non_aktif ?? 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

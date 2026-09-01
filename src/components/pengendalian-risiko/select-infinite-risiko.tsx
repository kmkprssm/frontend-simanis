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
import CONST from "@/lib/constants";

interface RisikoOption {
  risk_id: string;
  nama_resiko: string;
  deskripsi: string;
  status: string;
  strategi: string;
}

interface SelectInfiniteRisikoProps {
  token: string;
  value: string;
  onChange: (value: string) => void;
}

export function SelectInfiniteRisiko({
  token,
  value,
  onChange,
}: SelectInfiniteRisikoProps) {
  const [open, setOpen] = React.useState(false);
  const [risikoList, setRisikoList] = React.useState<RisikoOption[]>([]);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const fetchRisiko = React.useCallback(
    async (searchQuery: string, pageNum: number, isNewSearch: boolean) => {
      setLoading((prevLoading) => {
        if (prevLoading) return true;

        (async () => {
          try {
            const url = `${CONST.API_BASE_URL}/celah-pengendalian/risiko?strategi=treat&page=${pageNum}&limit=10&search=${encodeURIComponent(searchQuery)}`;
            const res = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();

            if (res.ok && result.risiko) {
              setRisikoList((prev) =>
                isNewSearch ? result.risiko : [...prev, ...result.risiko],
              );
              setHasMore(result.meta.hasMore);
              setPage(pageNum);
            }
          } catch (err) {
            console.error("Gagal load risiko treat filter:", err);
          } finally {
            setLoading(false);
          }
        })();

        return true;
      });
    },
    [token],
  );

  // Debouncer Pencarian
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRisiko(search, 1, true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchRisiko]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 8;

    if (isBottom && hasMore && !loading) {
      fetchRisiko(search, page + 1, false);
    }
  };

  const selectedRisiko = risikoList.find((r) => r.risk_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between truncate text-xs"
        >
          <span className="mr-2 truncate text-left">
            {value === ""
              ? "Semua Risiko"
              : selectedRisiko?.nama_resiko || "Memuat..."}
          </span>
          <IconSelector className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command filter={() => 1}>
          <CommandInput
            placeholder="Cari risiko..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList
            ref={scrollRef}
            onScroll={handleScroll}
            className="no-scrollbar max-h-48 overflow-y-auto"
          >
            {!loading && search.trim() !== "" && risikoList.length === 0 && (
              <div className="text-muted-foreground p-6 text-center text-xs">
                Risiko tidak ditemukan.
              </div>
            )}

            <CommandGroup>
              {search.trim() === "" && (
                <CommandItem
                  value="all_risiko"
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  <IconCheck
                    className={cn(
                      "mr-2 h-3.5 w-3.5",
                      value === "" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  Semua Risiko
                </CommandItem>
              )}

              {risikoList.map((risiko) => (
                <CommandItem
                  key={risiko.risk_id}
                  value={risiko.risk_id}
                  onSelect={() => {
                    onChange(risiko.risk_id === value ? "" : risiko.risk_id);
                    setOpen(false);
                  }}
                  className="flex items-start gap-1 text-xs"
                >
                  <IconCheck
                    className={cn(
                      "mt-0.5 mr-2 h-3.5 w-3.5 shrink-0",
                      value === risiko.risk_id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col truncate">
                    <span className="truncate font-medium">
                      {risiko.nama_resiko}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      Status: {risiko.status} | {risiko.strategi || "TREAT"}
                    </span>
                  </div>
                </CommandItem>
              ))}

              {loading && (
                <div className="text-muted-foreground flex items-center justify-center p-2">
                  <IconLoader2 className="text-primary h-4 w-4 animate-spin" />
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

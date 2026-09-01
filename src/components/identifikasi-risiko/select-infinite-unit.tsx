"use client";

import * as React from "react";
import { IconCheck, IconSelector, IconLoader2 } from "@tabler/icons-react";

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
import { TUnitUser } from "@/types/user-type";
import { useInfiniteUsers } from "@/hooks/use-infinite-users";

interface SelectInfiniteUsersProps {
  value: string;
  onChange: (value: string, selectedObj?: TUnitUser) => void;
}

export function SelectInfiniteUnit({
  value,
  onChange,
}: SelectInfiniteUsersProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteUsers({
      search: debouncedSearch,
      limit: 10,
    });

  const flatUnitList = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.users || []);
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 12;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const selectedUser = flatUnitList.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-52 justify-between border-slate-200 bg-white px-3 text-sm font-normal shadow-xs transition-colors hover:bg-slate-50/80"
        >
          <span
            className={cn(
              "truncate text-left",
              !value && "text-muted-foreground",
            )}
          >
            {value === ""
              ? "Semua Unit Kerja"
              : selectedUser?.username || "Memuat..."}
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
            placeholder="Cari nama unit"
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
                Memuat daftar unit...
              </div>
            ) : flatUnitList.length === 0 ? (
              <div className="text-muted-foreground p-6 text-center text-xs">
                Unit tidak ditemukan.
              </div>
            ) : (
              <CommandGroup>
                {search.trim() === "" && (
                  <CommandItem
                    value="all_units_selection"
                    onSelect={() => {
                      onChange("", undefined);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center rounded-md p-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
                  >
                    <IconCheck
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0 text-blue-600",
                        value === "" ? "opacity-100" : "opacity-0",
                      )}
                    />
                    Tampilkan Semua Unit Kerja
                  </CommandItem>
                )}

                {flatUnitList.map((user) => {
                  const isChecked = value === user.id;
                  return (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => {
                        onChange(user.id, user);
                        setOpen(false);
                        setSearch("");
                      }}
                      className="flex cursor-pointer items-start gap-1 rounded-md p-2 text-xs"
                    >
                      <IconCheck
                        className={cn(
                          "mt-0.5 mr-2 h-4 w-4 shrink-0 text-emerald-600",
                          isChecked ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="leading-tight font-semibold text-slate-800">
                          {user.username}
                        </span>
                        {user.role && (
                          <span className="text-[10px] font-medium tracking-wide text-slate-400">
                            Role Akses: {user.role}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="text-muted-foreground flex items-center justify-center gap-1.5 p-2 text-xs">
                    <IconLoader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                    Memuat lebih banyak...
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

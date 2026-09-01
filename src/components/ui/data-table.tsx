"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import { Label } from "./label";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { TIdentifikasiRisiko } from "@/types/identifikasi-risiko-type";
import { TKategoriRisiko } from "@/types/kategori-risiko-type";
import { SelectInfiniteUnit } from "../identifikasi-risiko/select-infinite-unit";
import { ExtendedUser } from "@/next-auth";
import { Loader } from "./loader";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { TGetKejadianRisikoResponse } from "@/types/pencatatan-kejadian-risiko-type";
import { cn } from "@/lib/utils";
import { FilterTahunKejadianRisiko } from "../filter-tahun-kejadian-risiko";

type BaseDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  filterName?: string;
  loading?: boolean;
  isFetching?: boolean;
  tahunFilter?: number;
  isAdmin?: boolean;
  pageSize?: number;
  listTahunOptions?: number[];
  kategoriRisikoData?: TKategoriRisiko[];
  selectedKategori?: string;
};

// Varian khusus untuk Identifikasi Risiko
type IdentifikasiRisikoProps<TData, TValue> = BaseDataTableProps<
  TData,
  TValue
> & {
  variant: "identifikasi";
  showFilter?: boolean;
  setSelectedUnit: React.Dispatch<React.SetStateAction<string>>;
  setSelectedKategori: React.Dispatch<React.SetStateAction<string>>;
  filteredData?: TIdentifikasiRisiko[];
  userSession?: ExtendedUser;
  selectedUnit?: string;
};

// Varian khusus untuk Kejadian Risiko
type KejadianRisikoProps<TData, TValue> = BaseDataTableProps<TData, TValue> & {
  variant: "kejadian";
  showFilterKejadian?: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<NoInfer<TGetKejadianRisikoResponse>, Error>>;
  setTahunFilter: React.Dispatch<React.SetStateAction<number>>;
};

type GeneralProps<TData, TValue> = BaseDataTableProps<TData, TValue> & {
  variant: "general";
};

export type DataTableProps<TData, TValue> =
  | IdentifikasiRisikoProps<TData, TValue>
  | KejadianRisikoProps<TData, TValue>
  | GeneralProps<TData, TValue>;

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns,
    data,
    filterKey,
    filterName,
    pageSize,
    loading,
    isFetching,
    isAdmin,
    listTahunOptions,
    tahunFilter,
  } = props;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: props.variant === "kejadian" ? 12 : pageSize || 10,
  });

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="flex w-full flex-col justify-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative grid grid-flow-col grid-cols-2 gap-0">
          <Input
            placeholder={`Cari ${filterName!}...`}
            value={
              (table.getColumn(filterKey!)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterKey!)?.setFilterValue(event.target.value)
            }
            className="focus-visible:ring-muted-foreground col-span-2 w-full flex-1 pl-9 focus-visible:ring-1 focus-visible:ring-offset-0 sm:w-[384px]"
          />
          <div className="absolute inset-y-0 left-3 flex items-center justify-center">
            <IconSearch className="text-muted-foreground size-4" />
          </div>
        </div>
        {props.variant === "identifikasi" && props.showFilter && (
          <>
            {isAdmin && (
              <div className="flex flex-col gap-1">
                <SelectInfiniteUnit
                  value={props.selectedUnit as string}
                  onChange={props.setSelectedUnit}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Select
                value={
                  props.selectedKategori !== undefined &&
                  props.selectedKategori !== null &&
                  props.selectedKategori !== ""
                    ? String(props.selectedKategori)
                    : "all"
                }
                onValueChange={(val) => {
                  if (val === "all") {
                    props.setSelectedKategori("");
                  } else {
                    props.setSelectedKategori(val);
                  }
                }}
              >
                <SelectTrigger className="bg-background w-45 text-xs">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    Semua Kategori
                  </SelectItem>

                  {props.kategoriRisikoData?.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.name}
                      className="text-xs"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {props.variant === "kejadian" && props.showFilterKejadian && (
          <FilterTahunKejadianRisiko
            listTahunOptions={listTahunOptions}
            refetch={props.refetch}
            setTahunFilter={props.setTahunFilter}
            tahunFilter={tahunFilter}
            isFetching={isFetching}
            loading={loading}
          />
        )}
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {loading && !data?.length ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      {props.variant !== "kejadian" && (
        <div className="flex items-center justify-end">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Baris per hal.
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Hal. {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

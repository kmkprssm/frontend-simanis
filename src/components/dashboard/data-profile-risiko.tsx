"use client";

import { useEffect, useRef } from "react";
import { IconAlertCircle, IconInbox, IconUserStar } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ExtendedUser } from "@/next-auth";
import { useInfiniteProfileRisiko } from "@/hooks/use-infinite-profile-risiko";
import { ProfileRisikoCard } from "./profile-risiko-card";
import { Loader } from "../ui/loader";

interface DataProfileRisikoProps {
  user?: ExtendedUser;
}

export const DataProfileRisiko = ({ user }: DataProfileRisikoProps) => {
  const queryClient = useQueryClient();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
    error,
  } = useInfiniteProfileRisiko({
    token: user?.token,
    limit: 12,
  });

  const profiles =
    data?.pages.flatMap((page) => page?.profile_risiko ?? []) ?? [];
  const totalRows = data?.pages[0]?.meta.totalRows ?? 0;
  const isInitialLoading = status === "pending" && profiles.length === 0;

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["profile-risiko", "infinite"] });
    queryClient.invalidateQueries({ queryKey: ["penilaian"] });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (
          firstEntry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          status !== "pending"
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, status]);

  return (
    <div className="*:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconUserStar stroke={2} /> Profile Risiko
          </CardTitle>
          <CardDescription>
            Daftar seluruh tingkat risiko terpilih yang dipantau secara intensif
            oleh pemilik risiko organisasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="no-scrollbar max-h-150 flex-1 overflow-y-auto bg-slate-50/20">
          {isError && (
            <div className="mx-auto my-6 flex max-w-md flex-col items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-red-700">
              <IconAlertCircle className="h-6 w-6 text-red-500" />
              <p className="text-sm font-semibold">
                Gagal memuat profil risiko
              </p>
              <p className="text-xs opacity-80">
                {error?.message || "Terjadi kesalahan sistem."}
              </p>
            </div>
          )}

          {profiles.length === 0 && !isInitialLoading && !isError ? (
            <div className="mx-auto my-12 flex max-w-sm flex-col items-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <IconInbox className="h-6 w-6" />
              </div>
              <h5 className="text-sm font-bold text-slate-800">
                Profil Risiko Kosong
              </h5>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Belum ada penilaian risiko yang ditambahkan ke modul profil ini.
                Silakan tambahkan melalui menu Analisis Risiko.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
              {profiles.map((item) => (
                <ProfileRisikoCard
                  key={item.profile_id}
                  item={item}
                  onSuccessDelete={handleDeleteSuccess}
                />
              ))}
            </div>
          )}

          <div ref={loaderRef} className="mt-4 flex w-full justify-center pt-4">
            {(isInitialLoading || isFetchingNextPage) && (
              <div className="flex animate-pulse items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-1.5 text-xs text-slate-500 shadow-sm">
                <Loader className="h-3.5 w-3.5 text-amber-500" />
                <span>Memuat profil risiko selanjutnya...</span>
              </div>
            )}
            {!hasNextPage && profiles.length > 0 && (
              <div className="w-full border-t border-slate-100 pt-4 text-center">
                <p className="text-[11px] text-slate-400 italic">
                  Menampilkan seluruh data profil risiko ({totalRows} risiko
                  dipantau)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

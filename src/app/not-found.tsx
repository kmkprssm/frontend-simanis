// app/not-found.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconHome,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)] bg-size-[24px_24px]" />

      <div className="relative z-10 flex max-w-md flex-col items-center gap-6">
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
          <IconAlertTriangle size={44} stroke={1.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tight text-white md:text-8xl">
            404
          </h1>
          <h2 className="text-xl font-bold text-zinc-200 md:text-2xl">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm text-balance text-zinc-400">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
            dipindahkan ke alamat lain.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full gap-2 border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
          >
            <IconArrowLeft size={18} />
            Kembali
          </Button>

          <Button
            asChild
            className="w-full gap-2 bg-amber-600 text-white shadow-lg shadow-amber-900/20 hover:bg-amber-500 sm:w-auto"
          >
            <Link href="/dashboard">
              <IconHome size={18} />
              Ke Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

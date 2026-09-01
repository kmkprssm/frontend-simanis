"use client";

import * as React from "react";
import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar";

const SIDEBAR_STORAGE_KEY = "sidebar_state";

export function SidebarWrapper({
  children,
  defaultOpen = true, // Default aslinya sudah true di sini
  onOpenChange,
  ...props
}: Omit<
  React.ComponentProps<typeof ShadcnSidebarProvider>,
  "defaultOpen" | "open" | "onOpenChange"
> & {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);

    if (stored !== null) {
      setOpen(stored === "true");
    } else {
      // PERBAIKAN: Jika localStorage kosong, ikuti nilai defaultOpen (true)
      setOpen(defaultOpen);
      // Opsional: Langsung simpan ke localStorage agar kunjungan berikutnya tersinkronisasi
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(defaultOpen));
    }
  }, [defaultOpen]);

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      setOpen(value);
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
      onOpenChange?.(value);
    },
    [onOpenChange],
  );

  // Mencegah hydration flicker sebelum komponen membaca localStorage
  if (open === null) return null;

  return (
    <ShadcnSidebarProvider
      {...props}
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </ShadcnSidebarProvider>
  );
}

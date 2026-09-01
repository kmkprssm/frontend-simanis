"use client";

import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const SiteHeader = () => {
  const pathname = usePathname();

  const getActiveTitlePage = (url: string) => {
    if (url.startsWith("/dashboard")) return "Dashboard";
    if (url.startsWith("/konteks")) return "Penetapan Konteks";
    if (url.startsWith("/identifikasi-risiko")) return "Identifikasi Risiko";
    if (url.startsWith("/analisis-risiko")) return "Analisis Risiko";
    if (url.startsWith("/evaluasi-risiko")) return "Evaluasi Risiko";
    if (url.startsWith("/perlakuan-risiko")) return "Mitigasi Risiko";
    if (url.startsWith("/pengendalian-risiko"))
      return "Efektivitas Pengendalian Risiko";
    if (url.startsWith("/pemantauan-tinjauan"))
      return "Pemantauan & Tinjauan Risiko";
    if (url.startsWith("/pencatatan-kejadian-risiko"))
      return "Pencatatan Kejadian Risiko";
    if (url.startsWith("/analisis-residu-risiko"))
      return "Analisis Residu Risiko";
    if (url.startsWith("/master-user")) return "Master User";
    return null;
  };

  // Fungsi opsional jika ingin menampilkan nama sub-tab aktif di Breadcrumb/Header
  const getSubTabTitle = (url: string) => {
    if (url.includes("/risiko-aktif")) return "Risiko Aktif";
    if (url.includes("/histori-risiko")) return "Histori Risiko";
    // Jika berada di root /perlakuan-risiko, secara default adalah Risiko Aktif
    if (url === "/perlakuan-risiko") return "Risiko Aktif";
    return null;
  };

  const mainTitle = getActiveTitlePage(pathname);
  const subTitle = getSubTabTitle(pathname);

  return (
    <header className="bg-background sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="relative -ml-1 size-10 cursor-pointer" />
      <Separator
        orientation="vertical"
        className="mx-2 data-vertical:self-center data-[orientation=vertical]:h-4"
      />
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-muted-foreground">{mainTitle}</span>

        {subTitle && (
          <>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground font-semibold capitalize">
              {subTitle}
            </span>
          </>
        )}
      </div>
    </header>
  );
};

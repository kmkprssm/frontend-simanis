"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import ManriskLogo from "@/public/riskrssmMMMM.png";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  IconAdjustmentsAlt,
  IconAnalyze,
  IconDashboard,
  IconDatabaseCog,
  IconDeviceDesktopAnalytics,
  IconFileStar,
  IconReportMedical,
  IconShieldBolt,
  IconShieldExclamation,
} from "@tabler/icons-react";
import { NavRisk } from "./nav-risk";
import { NavMasterData } from "./nav-master-data";
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "@bprogress/next/app";
import { canAccessMenu } from "@/lib/permissions";

// Struktur data ditambahkan property `key` untuk identifikasi hak akses
const data = {
  user: {
    avatar: "/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      key: "dashboard",
      icon: IconDashboard,
    },
  ],
  navRisk: {
    itemsContext: {
      title: "Penetapan Konteks",
      url: "/konteks",
      key: "konteks",
      icon: IconFileStar,
    },
    itemsCollapsiblePenilaian: {
      item: {
        title: "Penilaian Risiko",
        url: "#",
        icon: IconAnalyze,
      },
      items: [
        {
          title: "Identifikasi Risiko",
          url: "/identifikasi-risiko",
          key: "identifikasi-risiko",
        },
        {
          title: "Analisis Risiko",
          url: "/analisis-risiko",
          key: "analisis-risiko",
        },
        {
          title: "Evaluasi Risiko",
          url: "/evaluasi-risiko",
          key: "evaluasi-risiko",
        },
      ],
    },
    itemsRisk: [
      {
        title: "Perlakuan Risiko",
        url: "/perlakuan-risiko",
        key: "perlakuan-risiko",
        icon: IconShieldBolt,
      },
      {
        title: "Pencatatan Kejadian Risiko",
        url: "/pencatatan-kejadian-risiko",
        key: "pencatatan-kejadian-risiko",
        icon: IconReportMedical,
      },
      {
        title: "Analisis Residu Risiko",
        url: "/analisis-residu-risiko",
        key: "analisis-residu-risiko",
        icon: IconShieldExclamation,
      },
      {
        title: "Efektivitas Pengendalian Risiko",
        url: "/pengendalian-risiko",
        key: "pengendalian-risiko",
        icon: IconAdjustmentsAlt,
      },
      {
        title: "Pemantauan & Tinjauan",
        url: "/pemantauan-tinjauan",
        key: "pemantauan-tinjauan",
        icon: IconDeviceDesktopAnalytics,
      },
    ],
  },
  navMasterData: {
    item: {
      title: "Master Data",
      url: "#",
      icon: IconDatabaseCog,
    },
    items: [
      {
        title: "Kelola User",
        url: "/master-user",
        key: "kelola-user",
      },
    ],
  },
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: ExtendedUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Filter NavMain (Dashboard)
  const filteredNavMain = data.navMain.filter((item) =>
    canAccessMenu(user?.role, item.key),
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group hover:bg-sidebar-accent/80 flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 transition-all duration-250"
              onClick={() => router.push("/", { showProgress: true })}
            >
              <div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-white shadow-2xs transition-transform group-hover:scale-105">
                  <Image
                    src={ManriskLogo}
                    alt="Manrisk Logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col leading-none">
                  <span className="text-sm font-bold tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
                    SiManis
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                    Management Risiko
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Render Dashboard */}
        <NavMain items={filteredNavMain} pathname={pathname} />

        {/* Render NavRisk (Otomatis memfilter menu berdasar user.role) */}
        <NavRisk
          itemsContext={data.navRisk.itemsContext}
          itemsCollapsiblePenilaian={data.navRisk.itemsCollapsiblePenilaian}
          itemsRisk={data.navRisk.itemsRisk}
          pathname={pathname}
          userRole={user?.role}
        />

        {/* Render Master Data khusus ADMIN */}
        {canAccessMenu(user?.role, "master-data") && (
          <NavMasterData
            itemsCollapsible={data.navMasterData}
            pathname={pathname}
          />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

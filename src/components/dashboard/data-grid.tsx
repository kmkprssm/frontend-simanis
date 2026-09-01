"use client";

import {
  IconActivity,
  IconAlertTriangle,
  IconBuildingHospital,
  IconCircleCheck,
  IconDashboardOff,
  IconProgress,
  IconShieldCheck,
  IconTarget,
} from "@tabler/icons-react";
import { DataCard } from "./data-card";
import { CountUp } from "../count-up";
import { TMetrics } from "@/types/summary-type";
import { PageHeader } from "../page-header";
import { Badge } from "../ui/badge";
import { ExtendedUser } from "@/next-auth";

interface DataGridProps {
  data: TMetrics | undefined;
  user?: ExtendedUser;
}

export const DataGrid = ({ data, user }: DataGridProps) => {
  const isUser = user?.role === "USER";

  return (
    <>
      <PageHeader
        title="Dashboard Manajemen Risiko - RSUD dr. Soedono Madiun"
        description="Ringkasan manajemen risiko yang telah dikelola"
        showAction={true}
        icon={IconBuildingHospital}
        action={
          <Badge
            variant={"secondary"}
            className="text-md font-medium text-indigo-500"
          >
            ISO 31000 Compliant
          </Badge>
        }
      />

      {/* Grid Layout Dinamis: 3 Kolom untuk USER, 4 Kolom untuk ADMIN/GUEST */}
      <div
        className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 ${
          isUser ? "@5xl/main:grid-cols-3" : "@5xl/main:grid-cols-4"
        }`}
      >
        {/* ================= BARIS 1 ================= */}

        {/* 1. Total Risiko (Kolom 1 - Baris 1) */}
        <DataCard
          title="TOTAL RISIKO"
          icon={IconDashboardOff}
          footer="Jumlah seluruh risiko"
          variant="default"
        >
          <CountUp preserveValue start={0} end={data?.totalRisks || 0} />
        </DataCard>

        {/* 2. Profil Risiko (Khusus ADMIN / GUEST) */}
        {!isUser && (
          <DataCard
            title="PROFIL RISIKO"
            icon={IconTarget}
            footer="Jumlah risiko masuk profil"
            variant="info"
          >
            <CountUp preserveValue start={0} end={data?.profileRisks || 0} />
          </DataCard>
        )}

        {/* 3. Risiko Ekstrim / Tinggi */}
        <DataCard
          title="RISIKO EKSTRIM"
          icon={IconAlertTriangle}
          footer="Jumlah risiko prioritas tinggi"
          variant="danger"
        >
          <CountUp preserveValue start={0} end={data?.highRisks || 0} />
        </DataCard>

        {/* 4. Risiko Aktif */}
        <DataCard
          title="RISIKO AKTIF"
          icon={IconActivity}
          footer="Jumlah risiko dalam penanganan"
          variant="warning"
        >
          <CountUp preserveValue start={0} end={data?.activeRisks || 0} />
        </DataCard>

        {/* ================= BARIS 2 ================= */}

        {/* 5. Progres Total Risiko (Otomatis jatuh ke Kolom 1 - Baris 2 pada layout 3-Kolom) */}
        <DataCard
          title="PROGRES TOTAL RISIKO"
          icon={IconProgress}
          footer="Rata-rata progres seluruh risiko"
          variant="info"
        >
          <CountUp
            start={0}
            end={data?.avgProgress || 0}
            decimals={1}
            decimal="."
            suffix="%"
            preserveValue
            duration={2}
          />
        </DataCard>

        {/* 6. Progres Profil Risiko (Khusus ADMIN / GUEST) */}
        {!isUser && (
          <DataCard
            title="PROGRES PROFIL RISIKO"
            icon={IconProgress}
            footer="Rata-rata progres khusus profil"
            variant="info"
          >
            <CountUp
              start={0}
              end={data?.avgProfileProgress || 0}
              decimals={1}
              decimal="."
              suffix="%"
              preserveValue
              duration={2}
            />
          </DataCard>
        )}

        {/* 7. Efektivitas */}
        <DataCard
          title="EFEKTIVITAS"
          icon={IconCircleCheck}
          footer="Tingkat efektivitas kontrol"
          variant="success"
        >
          <CountUp
            start={0}
            end={data?.avgEffectiveness || 0}
            decimals={1}
            decimal="."
            suffix="%"
            preserveValue
            duration={2}
          />
        </DataCard>

        {/* 8. Risiko Ditangani */}
        <DataCard
          title="RISIKO DITANGANI"
          icon={IconShieldCheck}
          footer="Jumlah risiko status ditutup/closed"
          variant="success"
        >
          <CountUp preserveValue start={0} end={data?.closedRisks || 0} />
        </DataCard>
      </div>
    </>
  );
};

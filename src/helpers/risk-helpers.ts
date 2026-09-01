import {
  IconShield,
  IconReplace,
  IconBan,
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
  IconEye,
  type TablerIcon,
  IconRefresh,
  IconCircleCheck,
} from "@tabler/icons-react";
import type { VariantProps } from "class-variance-authority";

import { badgeVariants } from "@/components/ui/badge";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

type ActionStatusInfo = {
  label: string;
  badgeVariant: BadgeVariant;
  isOverdue: boolean;
  isClosed: boolean;
  isOnProgress: boolean;
  isOpen: boolean;
};

export const STRATEGI_CONFIG = {
  TREAT: {
    label: "Mitigasi",
    badgeClass: "bg-amber-500 text-white",
    icon: IconShield,
  },
  TRANSFER: {
    label: "Transfer",
    badgeClass: "bg-red-500 text-white",
    icon: IconReplace,
  },
  AVOID: {
    label: "Hindari",
    badgeClass: "bg-slate-500 text-white",
    icon: IconBan,
  },
  ACCEPT: {
    label: "Terima",
    badgeClass: "bg-emerald-600 text-white",
    icon: IconCheck,
  },
} as const;

export const PRIORITAS_CONFIG = {
  1: {
    label: "Sangat Mendesak",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    icon: IconAlertTriangle,
  },
  2: {
    label: "Penting",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    icon: IconAlertCircle,
  },
  3: {
    label: "Sedang",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    icon: IconInfoCircle,
  },
  4: {
    label: "Monitoring",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    icon: IconEye,
  },
} as const;

export const normalizeStrategi = (
  strategi: string | null | undefined,
): keyof typeof STRATEGI_CONFIG | null => {
  if (!strategi) return null;
  const upper = strategi.toUpperCase().trim();
  if (upper.includes("ACCEPT")) return "ACCEPT";
  if (upper.includes("TREAT")) return "TREAT";
  if (upper.includes("TRANSFER")) return "TRANSFER";
  if (upper.includes("AVOID")) return "AVOID";
  return null;
};

export const getRiskLevel = (score: number) => {
  if (score >= 20)
    return {
      label: "Ekstrim",
      badgeClass: "bg-red-600 text-white hover:bg-red-600/90",
      textClass: "text-red-600",
      circleClass: "bg-red-500/10 text-red-600 border-red-200",
      bgGradient: "from-red-50 to-red-100/70 border-red-200",
    };
  if (score >= 12)
    return {
      label: "Tinggi",
      badgeClass: "bg-orange-500 text-white hover:bg-orange-500/90",
      textClass: "text-orange-600",
      circleClass: "bg-orange-500/10 text-orange-600 border-orange-200",
      bgGradient: "from-orange-50 to-orange-100/70 border-orange-200",
    };
  if (score >= 6)
    return {
      label: "Sedang",
      badgeClass: "bg-amber-500 text-white hover:bg-amber-500/90",
      textClass: "text-amber-600",
      circleClass: "bg-amber-500/10 text-amber-600 border-amber-200",
      bgGradient: "from-amber-50 to-amber-100/70 border-amber-200",
    };
  return {
    label: "Rendah",
    badgeClass: "bg-green-600 text-white hover:bg-green-600/90",
    textClass: "text-green-600",
    circleClass: "bg-green-500/10 text-green-600 border-green-200",
    bgGradient: "from-green-50 to-green-100/70 border-green-200",
  };
};

export const CATEGORY_COLORS = {
  Strategis: "#1890ff",
  Operasional: "#52c41a",
  Keuangan: "#722ed1",
  Kepatuhan: "#fa8c16",
  Teknologi: "#f5222d",
  Kecurangan: "#fd7e14",
  Reputasi: "#be4bdb",
} as const;

export const likelihoodKeterangan = {
  1: {
    label: "Sangat Jarang",
    desc: "Sangat jarang terjadi (Probabilitas < 20%), terjadi sekali dalam 10-20 tahun.",
    color:
      "border-green-200 text-green-600 bg-green-50 data-[state=checked]:bg-green-600 data-[state=checked]:text-white",
  },
  2: {
    label: "Jarang",
    desc: "Kemungkinan terjadi meskipun kecil (Probabilitas 20% - 40%), terjadi sekali dalam 5-10 tahun.",
    color:
      "border-emerald-200 text-emerald-600 bg-emerald-50 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white",
  },
  3: {
    label: "Moderat",
    desc: "Kemungkinan terjadi (Probabilitas 40% - 60%), terjadi sekali dalam 1-5 tahun.",
    color:
      "border-amber-200 text-amber-600 bg-amber-50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white",
  },
  4: {
    label: "Sering",
    desc: "Sering terjadi (Probabilitas 60% - 80%), terjadi sekali dalam 1 tahun.",
    color:
      "border-orange-200 text-orange-600 bg-orange-50 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white",
  },
  5: {
    label: "Sangat Sering",
    desc: "Sangat sering hampir pasti terjadi  (Probabilitas > 80%), terjadi beberapa kali dalam 1 tahun.",
    color:
      "border-red-200 text-red-600 bg-red-50 data-[state=checked]:bg-red-600 data-[state=checked]:text-white",
  },
} as const;

export const impactKeterangan = {
  1: {
    label: "Sangat Rendah",
    desc: "Gangguan minimal, tidak cedera, kerugian < 50 Juta.",
    color:
      "border-green-200 text-green-600 bg-green-50 data-[state=checked]:bg-green-600 data-[state=checked]:text-white",
  },
  2: {
    label: "Rendah",
    desc: "Gangguan terbatas 1 unit, cedera ringan, kerugian 50-250 Juta.",
    color:
      "border-emerald-200 text-emerald-600 bg-emerald-50 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white",
  },
  3: {
    label: "Sedang",
    desc: "Gangguan beberapa unit, cedera sedang, kerugian s/d 1 Miliar.",
    color:
      "border-amber-200 text-amber-600 bg-amber-50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white",
  },
  4: {
    label: "Tinggi",
    desc: "Layanan skala besar terganggu, cedera berat, sanksi s/d 5 Miliar.",
    color:
      "border-orange-200 text-orange-600 bg-orange-50 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white",
  },
  5: {
    label: "Ekstrem",
    desc: "Layanan lumpuh total, kematian pasien, kerugian > 5 Miliar.",
    color:
      "border-red-200 text-red-600 bg-red-50 data-[state=checked]:bg-red-600 data-[state=checked]:text-white",
  },
} as const;

export const METODE_LABEL: Record<string, string> = {
  QUALITATIVE: "Kualitatif",
  SEMI_QUANTITATIVE: "Semi Kuantitatif",
  QUANTITATIVE: "Kuantitatif",
};

export const METODE_VARIANT: Record<string, "info" | "warning" | "success"> = {
  QUALITATIVE: "info",
  SEMI_QUANTITATIVE: "warning",
  QUANTITATIVE: "success",
};

export const SELERA_VARIANT = {
  "Sangat Rendah": {
    label: "Sangat Rendah",
    variant: "secondary",
  },
  Rendah: {
    label: "Rendah",
    variant: "info",
  },
  Sedang: {
    label: "Sedang",
    variant: "primary",
  },
  Tinggi: {
    label: "Tinggi",
    variant: "warning",
  },
  "Sangat Tinggi": {
    label: "Sangat Tingi",
    variant: "destructive",
  },
} as const;

export const STATUS_VARIANTS: Record<
  string,
  { label: string; variant: string; icon: TablerIcon }
> = {
  Open: {
    label: "Open",
    variant: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    icon: IconCircleCheck,
  },
  "In Progress": {
    label: "In Progress",
    variant:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: IconRefresh,
  },
  Closed: {
    label: "Closed",
    variant:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: IconAlertTriangle,
  },
};

export const getTipeBadgeColor = (tipe: string) => {
  if (tipe?.toUpperCase() === "PREVENTIVE")
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (tipe?.toUpperCase() === "DETECTIVE")
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-orange-50 text-orange-700 border-orange-200";
};

const STATUS_MAP: Record<
  string,
  {
    label: string;
    badgeClass: BadgeVariant;
  }
> = {
  Open: {
    label: "Aktif",
    badgeClass: "active",
  },
  "Re-open": {
    label: "Aktif Kembali",
    badgeClass: "reopen",
  },
  Closed: {
    label: "Ditutup",
    badgeClass: "closed",
  },
};

export const getStatusRisiko = (status: string) =>
  STATUS_MAP[status] ?? {
    label: "Tidak Diketahui",
    badgeClass: "outline",
  };

export const getActionStatusInfo = (
  status: string,
  targetDate?: string | Date | null,
): ActionStatusInfo => {
  const isClosed = status === "Closed";
  const isOnProgress = status === "On Progress";
  const isOpen = status === "Open";

  const isOverdue =
    !!targetDate && !isClosed && new Date(targetDate).getTime() < Date.now();

  if (isClosed) {
    return {
      label: "Ditutup",
      badgeVariant: "closed",
      isClosed,
      isOnProgress,
      isOpen,
      isOverdue,
    };
  }

  if (isOnProgress) {
    return {
      label: "Sedang Dikerjakan",
      badgeVariant: "progress",
      isClosed,
      isOnProgress,
      isOpen,
      isOverdue,
    };
  }

  if (isOverdue) {
    return {
      label: "Terlambat",
      badgeVariant: "danger",
      isClosed,
      isOnProgress,
      isOpen,
      isOverdue,
    };
  }

  if (isOpen) {
    return {
      label: "Belum Dimulai",
      badgeVariant: "active",
      isClosed,
      isOnProgress,
      isOpen,
      isOverdue,
    };
  }

  return {
    label: status,
    badgeVariant: "outline",
    isClosed,
    isOnProgress,
    isOpen,
    isOverdue,
  };
};

export const getNamaBulanIndo = (bulanNum: number): string => {
  const daftarBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return daftarBulan[bulanNum - 1] || "Tidak Diketahui";
};

import {
  TKontrolRisikoWithActions,
  TRisikoAktifMitigasiItem,
} from "@/types/perlakuan-risiko-type";

export const calculateMitigasiStats = (riskItem: TRisikoAktifMitigasiItem) => {
  const listKontrol = riskItem?.list_kontrol || [];
  const totalKontrol = listKontrol.length;
  const allActions = listKontrol.flatMap((kontrol) => kontrol.actions || []);
  const totalActions = allActions.length;
  const closedActions = allActions.filter(
    (a) => a?.status?.toUpperCase() === "CLOSED",
  ).length;
  const openActions = allActions.filter(
    (a) => a?.status?.toUpperCase() === "OPEN",
  ).length;

  const WEIGHTS: Record<string, number> = {
    CLOSED: 100,
    "ON PROGRESS": 50,
    OPEN: 0,
    OVERDUE: 0,
  };

  let totalScore = 0;
  allActions.forEach((action) => {
    const statusKey = (action.status || "OPEN").toUpperCase();
    totalScore += WEIGHTS[statusKey] || 0;
  });

  const progressPercentage =
    totalActions > 0 ? Math.round(totalScore / totalActions) : 0;

  return {
    totalKontrol,
    totalActions,
    closedActions,
    openActions,
    progressPercentage,
  };
};

export const calculateKontrolStats = (kontrol: TKontrolRisikoWithActions) => {
  const totalActions = kontrol.actions.length;

  const WEIGHTS: Record<string, number> = {
    CLOSED: 100,
    "ON PROGRESS": 50,
    OPEN: 0,
    OVERDUE: 0,
  };

  let totalScore = 0;
  kontrol.actions.forEach((action) => {
    const statusKey = (action.status || "OPEN").toUpperCase();
    totalScore += WEIGHTS[statusKey] || 0;
  });

  const progressPercentage =
    totalActions > 0 ? Math.round(totalScore / totalActions) : 0;

  return {
    totalActions,
    progressPercentage,
  };
};

export const getProgressColor = (percent: number) => {
  if (percent <= 30)
    return "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-400";
  if (percent <= 70)
    return "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-400";
  return "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400";
};

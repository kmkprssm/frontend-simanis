"use server";

import { currentUser } from "@/lib/auth";
import CONST from "@/lib/constants";
import { TRiskHeatmapData, TSummaryData } from "@/types/summary-type";

export const getSummary = async () => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const response = await fetch(`${CONST.API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  });

  const result = (await response.json()) as TSummaryData;

  if (!result) {
    return null;
  }

  return {
    metrics: result.metrics,
    categories: result.categories,
    topRisks: result.topRisks,
  };
};

export const getRiskHeatmap = async () => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const response = await fetch(`${CONST.API_BASE_URL}/dashboard/risk-heatmap`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  });

  const result = (await response.json()) as TRiskHeatmapData;

  if (!result) {
    return null;
  }

  return {
    data: result.data,
  };
};

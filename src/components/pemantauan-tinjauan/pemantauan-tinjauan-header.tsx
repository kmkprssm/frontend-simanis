"use client";

import { IconDeviceAnalytics } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const PemantauanTinjauanHeader = () => {
  return (
    <Card className="bg-manrisk-gradient-dashboard border-background/20 @container/card relative mx-auto w-full py-4 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-4 self-center">
          <Badge variant="dashboard" className="size-12 [&>svg]:size-6!">
            <IconDeviceAnalytics stroke={2} className="text-white" />
          </Badge>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-semibold text-white tabular-nums @[250px]/card:text-2xl">
              Pemantauan & Tinjauan Risiko
            </CardTitle>
            <CardDescription className="text-zinc-200">
              Memantau progress risiko dan mengunduh rekap laporan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

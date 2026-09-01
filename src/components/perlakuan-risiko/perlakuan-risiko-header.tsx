"use client";

import { IconShieldCheckFilled } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const PerlakuanRisikoHeader = () => {
  return (
    <Card className="bg-manrisk-gradient-dashboard border-background/20 @container/card relative mx-auto w-full py-4 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-4 self-center">
          <Badge variant="dashboard" className="size-14 [&>svg]:size-8!">
            <IconShieldCheckFilled stroke={2} className="text-white" />
          </Badge>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-semibold text-white tabular-nums @[250px]/card:text-3xl">
              Perlakuan Risiko
            </CardTitle>
            <CardDescription className="text-zinc-200">
              Implementasi pengendalian (kontrol) dan aksi (action) mitigasi
              untuk mengelola risiko
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

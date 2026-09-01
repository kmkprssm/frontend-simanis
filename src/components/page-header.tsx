"use client";

import { type TablerIcon } from "@tabler/icons-react";

import { Badge } from "./ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface PageHeaderProps {
  icon: TablerIcon;
  title: string;
  description: string;
  showAction: boolean;
  action?: React.ReactNode;
}

export const PageHeader = ({
  icon: Icon,
  action,
  description,
  showAction,
  title,
}: PageHeaderProps) => {
  return (
    <Card className="bg-manrisk-gradient-dashboard border-background/20 @container/card relative mx-auto w-full py-4 shadow-2xl">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5 sm:items-center">
          <Badge
            variant="dashboard"
            className="size-11 shrink-0 sm:size-12 [&>svg]:size-5! sm:[&>svg]:size-6!"
          >
            <Icon stroke={2} className="text-white" />
          </Badge>

          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-lg font-semibold text-white tabular-nums sm:text-xl @[250px]/card:text-2xl">
              {title}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-200 sm:text-sm">
              {description}
            </CardDescription>
          </div>
        </div>

        {showAction && (
          <CardAction className="w-full sm:w-auto sm:self-center">
            <div className="flex w-full justify-start sm:w-auto">{action}</div>
          </CardAction>
        )}
      </CardHeader>
    </Card>
  );
};

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CustomTooltipProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  tooltipContent: React.ReactNode;
}

export const CustomTooltip = ({
  tooltipContent,
  children,
  side,
  align,
  className,
}: CustomTooltipProps) => {
  return (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} className={cn(className)}>
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

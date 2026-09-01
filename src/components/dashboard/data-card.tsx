"use client";

import { type TablerIcon } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const boxVariant = cva("size-14 [&>svg]:size-8!", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
      success: "bg-emerald-500/20",
      secondary: "bg-secondary/20",
      info: "bg-gray-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "text-blue-500",
      danger: "text-rose-500",
      warning: "text-yellow-500",
      success: "text-emerald-500",
      secondary: "text-secondary",
      info: "text-gray-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

type DataCardProps = BoxVariants &
  IconVariants & {
    icon: TablerIcon;
    title: string;
    footer: string;
    children: React.ReactNode;
  };

export const DataCard = ({
  title,
  footer,
  icon: Icon,
  variant,
  children,
}: DataCardProps) => {
  return (
    <Card className="@container/card relative mx-auto w-full">
      <CardHeader>
        <CardAction>
          <Badge className={cn(boxVariant({ variant }))}>
            <Icon className={cn(iconVariant({ variant }))} stroke={2} />
          </Badge>
        </CardAction>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {children}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-sm">{footer}</CardFooter>
    </Card>
  );
};

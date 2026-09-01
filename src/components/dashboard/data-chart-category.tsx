"use client";

import * as React from "react";
import { IconChartBarPopular } from "@tabler/icons-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TCategories } from "@/types/summary-type";

interface DataChartCategoryProps {
  data: TCategories[] | undefined;
}

const CATEGORY_COLORS = [
  "#1c7ed6",
  "#20c997",
  "#ff922b",
  "#fa5252",
  "#7950f2",
  "#e64980",
  "#ffd43b",
  "#12b886",
  "#fd7e14",
  "#be4bdb",
];

export const DataChartCategory = ({ data }: DataChartCategoryProps) => {
  const dynamicChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Total Risiko",
      },
    };

    data?.forEach((item, index) => {
      const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
      config[item.name] = {
        label: item.name,
        color: color,
      };
    });

    return config satisfies ChartConfig;
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <p className="text-muted-foreground p-4 text-center text-sm">
        Tidak ada data kategori.
      </p>
    );
  }

  return (
    <div className="*:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconChartBarPopular stroke={2} /> Distribusi Risiko per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={dynamicChartConfig} className="h-110 w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
                className="text-xs"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={false}
                defaultIndex={1}
              />

              <Bar dataKey="count" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground font-semibold"
                  fontSize={16}
                />

                {data.map((entry, index) => {
                  const itemColor =
                    CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                  return <Cell key={`cell-${index}`} fill={itemColor} />;
                })}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="text-md">
            Total: {data.reduce((sum, cat) => sum + cat.count, 0)} risiko
          </div>
          {data.length} kategori
        </CardFooter>
      </Card>
    </div>
  );
};

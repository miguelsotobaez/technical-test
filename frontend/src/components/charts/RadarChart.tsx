import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ElectricalBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RadarChartProps {
  data: ElectricalBalance[];
}

export function RadarChart({ data }: RadarChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>;
  }

  // Process data for the radar chart
  // Calculate averages of each energy source
  const sourcesData = data.reduce(
    (acc, item) => {
      if (item.details) {
        acc.nuclear += item.details.nuclear || 0;
        acc.hydro += item.details.hydro || 0;
        acc.wind += item.details.wind || 0;
        acc.solar += item.details.solar || 0;
        acc.thermal += item.details.thermal || 0;
      }
      return acc;
    },
    { nuclear: 0, hydro: 0, wind: 0, solar: 0, thermal: 0 }
  );

  // Calculate averages and convert to GWh
  const count = data.length;
  const chartData = [
    { source: "Nuclear", value: (sourcesData.nuclear / count) / 1000 },
    { source: "Hidráulica", value: (sourcesData.hydro / count) / 1000 },
    { source: "Eólica", value: (sourcesData.wind / count) / 1000 },
    { source: "Solar", value: (sourcesData.solar / count) / 1000 },
    { source: "Térmica", value: (sourcesData.thermal / count) / 1000 },
  ];

  const chartConfig: ChartConfig = {
    sources: {
      label: "Energy Sources Average",
    },
    value: {
      label: "Average Value",
      color: "hsl(var(--chart-1))",
    },
    nuclear: {
      label: "Nuclear",
      color: "hsl(var(--chart-1))",
    },
    hydro: {
      label: "Hidráulica",
      color: "hsl(var(--chart-2))",
    },
    wind: {
      label: "Eólica",
      color: "hsl(var(--chart-3))",
    },
    solar: {
      label: "Solar",
      color: "hsl(var(--chart-4))",
    },
    thermal: {
      label: "Térmica",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Sources (Radar)</CardTitle>
        <CardDescription>
          Average distribution of energy sources
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <RechartsRadarChart 
            data={chartData} 
            accessibilityLayer 
            cx="50%" 
            cy="50%" 
            outerRadius="70%"
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="source" />
            <PolarRadiusAxis 
              tickFormatter={(value) => `${value.toFixed(1)}`}
              domain={[0, 'auto']}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  className="w-[180px]" 
                  labelKey="sources"
                  formatter={(value) => {
                    return `${Number(value).toLocaleString(undefined, {maximumFractionDigits: 2})} GWh`;
                  }}
                />
              } 
            />
            <Radar 
              name="Energy Sources" 
              dataKey="value" 
              fill="var(--color-value)" 
              fillOpacity={0.6} 
              stroke="var(--color-value)" 
            />
          </RechartsRadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 
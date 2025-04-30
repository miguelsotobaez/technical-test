import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ElectricalBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RenewableEnergyChartProps {
  data: ElectricalBalance[];
}

export function RenewableEnergyChart({ data }: RenewableEnergyChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>;
  }

  // Process data for renewable energy sources
  const sourcesData = data.reduce(
    (acc, item) => {
      if (item.details) {
        // Energías renovables: hidráulica, eólica, solar
        acc.hydro += item.details.hydro || 0;
        acc.wind += item.details.wind || 0;
        acc.solar += item.details.solar || 0;
      }
      return acc;
    },
    { hydro: 0, wind: 0, solar: 0 }
  );

  // Calculate total renewable energy
  const totalRenewable = sourcesData.hydro + sourcesData.wind + sourcesData.solar;
  
  // Calculate total generation from all sources
  const totalGeneration = data.reduce((total, item) => {
    if (item.details) {
      const details = item.details;
      return total + (details.nuclear || 0) + (details.hydro || 0) + 
             (details.wind || 0) + (details.solar || 0) + (details.thermal || 0);
    }
    return total;
  }, 0);

  // Calculate percentages
  const renewablePercentage = (totalRenewable / totalGeneration) * 100;
  
  // Calculate individual percentages for bar chart
  const hydroPercentage = (sourcesData.hydro / totalRenewable) * 100;
  const windPercentage = (sourcesData.wind / totalRenewable) * 100;
  const solarPercentage = (sourcesData.solar / totalRenewable) * 100;

  // Data for Bar Chart (percentages)
  const chartData = [
    { source: "hydro", value: hydroPercentage, fill: "var(--color-hydro)" },
    { source: "wind", value: windPercentage, fill: "var(--color-wind)" },
    { source: "solar", value: solarPercentage, fill: "var(--color-solar)" },
  ];

  const chartConfig: ChartConfig = {
    renewable: {
      label: "Energías Renovables",
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
    value: {
      label: "Porcentaje",
      color: "hsl(143, 85%, 45%)",
    },
  };

  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardHeader className="flex flex-col items-stretch space-y-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Energías Renovables</CardTitle>
            <CardDescription>
              Distribución por tipo de fuente renovable
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-green-500">{renewablePercentage.toFixed(1)}%</span>
            <CardDescription>del total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-0 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
            barSize={30}
            className="dark:[&_.recharts-cartesian-axis-line]:stroke-gray-800 dark:[&_.recharts-cartesian-grid-horizontal]:stroke-gray-800 dark:[&_.recharts-cartesian-grid-vertical]:stroke-gray-800"
          >
            <YAxis
              dataKey="source"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const label = chartConfig[value as keyof typeof chartConfig]?.label;
                return label ? String(label) : value;
              }}
            />
            <XAxis 
              dataKey="value" 
              type="number" 
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  hideLabel 
                  formatter={(value) => {
                    return `${Number(value).toFixed(1)}%`;
                  }}
                />
              }
            />
            <Bar 
              dataKey="value" 
              fill="var(--color-value)" 
              layout="vertical" 
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--color-hydro)]" />
            <span>Hidráulica: <strong>{hydroPercentage.toFixed(1)}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--color-wind)]" />
            <span>Eólica: <strong>{windPercentage.toFixed(1)}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--color-solar)]" />
            <span>Solar: <strong>{solarPercentage.toFixed(1)}%</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
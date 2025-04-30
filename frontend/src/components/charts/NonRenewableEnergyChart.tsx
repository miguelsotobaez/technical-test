import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ElectricalBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NonRenewableEnergyChartProps {
  data: ElectricalBalance[];
}

export function NonRenewableEnergyChart({ data }: NonRenewableEnergyChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>;
  }

  // Process data for non-renewable energy sources
  const sourcesData = data.reduce(
    (acc, item) => {
      if (item.details) {
        // Energías no renovables: nuclear, térmica
        acc.nuclear += item.details.nuclear || 0;
        acc.thermal += item.details.thermal || 0;
      }
      return acc;
    },
    { nuclear: 0, thermal: 0 }
  );

  // Calculate total non-renewable energy
  const totalNonRenewable = sourcesData.nuclear + sourcesData.thermal;
  
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
  const nonRenewablePercentage = (totalNonRenewable / totalGeneration) * 100;
  
  // Calculate individual percentages for bar chart
  const nuclearPercentage = (sourcesData.nuclear / totalNonRenewable) * 100;
  const thermalPercentage = (sourcesData.thermal / totalNonRenewable) * 100;

  // Data for Bar Chart (percentages)
  const chartData = [
    { source: "nuclear", value: nuclearPercentage, fill: "var(--color-nuclear)" },
    { source: "thermal", value: thermalPercentage, fill: "var(--color-thermal)" },
  ];

  const chartConfig: ChartConfig = {
    nonrenewable: {
      label: "Energías No Renovables",
      color: "hsl(var(--chart-1))",
    },
    nuclear: {
      label: "Nuclear",
      color: "hsl(var(--chart-1))",
    },
    thermal: {
      label: "Térmica",
      color: "hsl(var(--chart-5))",
    },
    value: {
      label: "Porcentaje",
      color: "hsl(24, 85%, 45%)",
    },
  };

  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardHeader className="flex flex-col items-stretch space-y-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Energías No Renovables</CardTitle>
            <CardDescription>
              Distribución por tipo de fuente no renovable
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-orange-500">{nonRenewablePercentage.toFixed(1)}%</span>
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
            <div className="w-3 h-3 rounded-sm bg-[var(--color-nuclear)]" />
            <span>Nuclear: <strong>{nuclearPercentage.toFixed(1)}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--color-thermal)]" />
            <span>Térmica: <strong>{thermalPercentage.toFixed(1)}%</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
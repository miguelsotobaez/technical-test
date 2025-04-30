import { PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ElectricalBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RadialChartProps {
  data: ElectricalBalance[];
}

export function RadialChart({ data }: RadialChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>;
  }

  // Calculate totals for each energy source
  const sourcesTotal = data.reduce(
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

  // Convert to GWh
  const chartData = [
    { name: "Nuclear", value: sourcesTotal.nuclear / 1000 },
    { name: "Hidráulica", value: sourcesTotal.hydro / 1000 },
    { name: "Eólica", value: sourcesTotal.wind / 1000 },
    { name: "Solar", value: sourcesTotal.solar / 1000 },
    { name: "Térmica", value: sourcesTotal.thermal / 1000 },
  ].filter(item => item.value > 0);

  const chartConfig: ChartConfig = {
    sources: {
      label: "Fuentes de Energía",
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

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Create a custom legend with percentages
  const customLegend = (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {chartData.map((entry, index) => {
        const sourceKey = entry.name.toLowerCase() === "hidráulica" ? "hydro" : 
                          entry.name.toLowerCase() === "eólica" ? "wind" : 
                          entry.name.toLowerCase() === "térmica" ? "thermal" : 
                          entry.name.toLowerCase();
        const percentage = ((entry.value / total) * 100).toFixed(1);
        
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: `var(--color-${sourceKey})` }}
            />
            <span className="text-sm">
              {chartConfig[sourceKey as keyof typeof chartConfig].label}: <strong>{percentage}%</strong>
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuentes de Energía</CardTitle>
        <CardDescription>
          Distribución de fuentes de energía en el período seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <RechartsPieChart accessibilityLayer>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={140}
              paddingAngle={1}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => {
                const sourceKey = entry.name.toLowerCase() === "hidráulica" ? "hydro" : 
                                 entry.name.toLowerCase() === "eólica" ? "wind" : 
                                 entry.name.toLowerCase() === "térmica" ? "thermal" : 
                                 entry.name.toLowerCase();
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`var(--color-${sourceKey})`}
                  />
                );
              })}
            </Pie>
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  labelKey="sources" 
                  className="w-[180px]"
                  formatter={(value) => {
                    const numValue = typeof value === 'number' ? value : Number(value);
                    return `${numValue.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh (${((numValue / total) * 100).toFixed(1)}%)`;
                  }}
                />
              } 
            />
          </RechartsPieChart>
        </ChartContainer>
        {customLegend}
      </CardContent>
    </Card>
  );
} 
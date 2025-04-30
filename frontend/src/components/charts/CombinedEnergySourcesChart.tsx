import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ElectricalBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CombinedEnergySourcesChartProps {
  data: ElectricalBalance[];
}

export function CombinedEnergySourcesChart({ data }: CombinedEnergySourcesChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>;
  }

  // Process data for the charts
  // Calculate totals and averages of each energy source
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

  // Data for Radar Chart (averages)
  const count = data.length;
  const radarData = [
    { source: "Nuclear", value: (sourcesData.nuclear / count) / 1000 },
    { source: "Hidráulica", value: (sourcesData.hydro / count) / 1000 },
    { source: "Eólica", value: (sourcesData.wind / count) / 1000 },
    { source: "Solar", value: (sourcesData.solar / count) / 1000 },
    { source: "Térmica", value: (sourcesData.thermal / count) / 1000 },
  ];

  // Data for Pie Chart (totals)
  const pieData = [
    { name: "Nuclear", value: sourcesData.nuclear / 1000 },
    { name: "Hidráulica", value: sourcesData.hydro / 1000 },
    { name: "Eólica", value: sourcesData.wind / 1000 },
    { name: "Solar", value: sourcesData.solar / 1000 },
    { name: "Térmica", value: sourcesData.thermal / 1000 },
  ].filter(item => item.value > 0);

  // Calculate total for percentage
  const total = pieData.reduce((sum, item) => sum + item.value, 0);

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
    value: {
      label: "Valor Promedio",
      color: "hsl(var(--chart-1))",
    },
  };

  // Create a custom legend with percentages
  const customLegend = (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {pieData.map((entry, index) => {
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
          Distribución de las fuentes de energía en el período seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0 sm:p-6">
        <Tabs defaultValue="radar" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="radar">Distribución Radar</TabsTrigger>
            <TabsTrigger value="pie">Distribución Circular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="radar" className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <RechartsRadarChart 
                data={radarData} 
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
                  name="Fuentes de Energía" 
                  dataKey="value" 
                  fill="var(--color-value)" 
                  fillOpacity={0.6} 
                  stroke="var(--color-value)" 
                />
              </RechartsRadarChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="pie" className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <RechartsPieChart accessibilityLayer>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={140}
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, index) => {
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
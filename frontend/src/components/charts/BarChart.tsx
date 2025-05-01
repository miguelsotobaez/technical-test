import { AreaChart, Area, XAxis, CartesianGrid,  YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { ElectricalBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

interface BarChartProps {
  data: ElectricalBalance[];
}

export function BarChart({ data }: BarChartProps) {
  // Process and prepare data for the chart - sort by date and convert to GWh
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    return sortedData.map((item) => ({
      date: item.timestamp,
      generation: item.generation / 1000, // Convert to GWh
      demand: item.demand / 1000, // Convert to GWh
      exports: item.exports / 1000, // Convert to GWh
      imports: item.imports / 1000, // Convert to GWh
    }));
  }, [data]);

  // Calculate totals for display
  const totals = useMemo(() => {
    if (chartData.length === 0) {
      return {
        generation: 0,
        demand: 0,
        exports: 0,
        imports: 0
      };
    }
    
    return {
      generation: chartData.reduce((acc, curr) => acc + curr.generation, 0),
      demand: chartData.reduce((acc, curr) => acc + curr.demand, 0),
      exports: chartData.reduce((acc, curr) => acc + curr.exports, 0),
      imports: chartData.reduce((acc, curr) => acc + curr.imports, 0),
    };
  }, [chartData]);

  // Calculate trend percentage from first to last month
  const trendCalculation = useMemo(() => {
    if (chartData.length < 2) {
      return { percentage: 0, isUp: true };
    }
    
    const firstValue = chartData[0].generation;
    const lastValue = chartData[chartData.length - 1].generation;
    
    const percentage = firstValue !== 0 
      ? ((lastValue - firstValue) / firstValue) * 100
      : 0;
    
    return {
      percentage: Math.abs(percentage).toFixed(1),
      isUp: percentage >= 0
    };
  }, [chartData]);

  // Format date range for display
  const dateRange = useMemo(() => {
    if (chartData.length === 0) return '';
    
    const firstDate = new Date(chartData[0].date);
    const lastDate = new Date(chartData[chartData.length - 1].date);
    
    return `${firstDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - ${lastDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
  }, [chartData]);

  // Define chart configuration
  const chartConfig: ChartConfig = {
    generation: {
      label: "Generación",
      color: "hsl(var(--chart-1))",
    },
    demand: {
      label: "Demanda",
      color: "hsl(var(--chart-2))",
    },
    exports: {
      label: "Exportaciones",
      color: "hsl(var(--chart-3))",
    },
    imports: {
      label: "Importaciones",
      color: "hsl(var(--chart-4))",
    },
  };

  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>;
  }

  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Balance Eléctrico</CardTitle>
          <CardDescription>
            Mostrando datos de generación, demanda, exportaciones e importaciones
          </CardDescription>
        </div>
        <div className="hidden md:flex flex-wrap">
          <div className="relative z-30 flex flex-col justify-center gap-1 border-t px-4 py-4 text-left sm:border-l sm:border-t-0 sm:px-6 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.generation.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-xl">
              {totals.generation.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh
            </span>
          </div>
          <div className="relative z-30 flex flex-col justify-center gap-1 border-t border-l px-4 py-4 text-left sm:border-l sm:border-t-0 sm:px-6 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.demand.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-xl">
              {totals.demand.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              top: 30,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="dark:opacity-20" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={30}
              tickFormatter={(value) => {
                try {
                  const date = new Date(value);
                  if (isNaN(date.getTime())) {
                    return "";
                  }
                  return date.toLocaleDateString("es-ES", {
                    month: "numeric",
                    year: "numeric",
                  });
                } catch (error) {
                  console.error("Error formatting date in XAxis:", error);
                  return "";
                }
              }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value.toFixed(1)}`}
              label={{ value: 'GWh', angle: -90, position: 'insideLeft', offset: -5 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    try {
                      const date = new Date(value);
                      if (isNaN(date.getTime())) {
                        return value;
                      }
                      return date.toLocaleDateString("es-ES", {
                        month: 'long',
                        year: 'numeric'
                      });
                    } catch {
                      return String(value);
                    }
                  }}
                  formatter={(value, name) => {
                    // Obtener el nombre legible según la clave de datos
                    let label = '';
                    switch (String(name)) {
                      case 'generation':
                        label = 'Generación';
                        break;
                      case 'demand':
                        label = 'Demanda';
                        break;
                      case 'exports':
                        label = 'Exportaciones';
                        break;
                      case 'imports':
                        label = 'Importaciones';
                        break;
                      default:
                        label = String(name);
                    }
                    
                    return `${label}: ${Number(value).toLocaleString(undefined, {maximumFractionDigits: 2})} GWh`;
                  }}
                />
              }
            />
            <ChartLegend 
              content={<ChartLegendContent />}
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: "10px" }}
            />
            <defs>
              <linearGradient id="fillGeneration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-generation)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-generation)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-demand)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-demand)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-exports)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-exports)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillImports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-imports)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-imports)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone"
              dataKey="generation"
              name="Generación"
              stroke="var(--color-generation)"
              fill="url(#fillGeneration)"
              fillOpacity={0.6}
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Area 
              type="monotone"
              dataKey="demand"
              name="Demanda"
              stroke="var(--color-demand)"
              fill="url(#fillDemand)"
              fillOpacity={0.6}
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Area 
              type="monotone"
              dataKey="exports"
              name="Exportaciones"
              stroke="var(--color-exports)"
              fill="url(#fillExports)"
              fillOpacity={0.6}
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Area 
              type="monotone"
              dataKey="imports"
              name="Importaciones"
              stroke="var(--color-imports)"
              fill="url(#fillImports)"
              fillOpacity={0.6}
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trendCalculation.isUp ? (
                <>
                  Tendencia al alza de un {trendCalculation.percentage}% en este periodo <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  Tendencia a la baja de un {trendCalculation.percentage}% en este periodo <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dateRange}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 
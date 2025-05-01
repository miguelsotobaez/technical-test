import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ElectricalBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LineChartProps {
  data: ElectricalBalance[];
}

export function LineChart({ data }: LineChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>;
  }

  // Process and sort data by timestamp
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Prepare data for the chart - convert MWh to GWh
  const chartData = sortedData.map((item) => ({
    date: item.timestamp,
    generation: item.generation / 1000, // Convert to GWh
    demand: item.demand / 1000, // Convert to GWh
  }));

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
  };

  // Calculate totals for display
  const totalGeneration = chartData.reduce((acc, curr) => acc + curr.generation, 0);
  const totalDemand = chartData.reduce((acc, curr) => acc + curr.demand, 0);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Generation Trends</CardTitle>
          <CardDescription>
            Showing generation and demand over time
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Generation</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">
              {totalGeneration.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-l px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Demand</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">
              {totalDemand.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <RechartsLineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-ES", {
                  month: "numeric",
                  year: "numeric",
                });
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
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      month: "numeric",
                      year: "numeric"
                    });
                  }}
                  formatter={(value) => {
                    return `${Number(value).toLocaleString(undefined, {maximumFractionDigits: 2})} GWh`;
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="generation"
              stroke="var(--color-generation)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="var(--color-demand)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 
import { useEffect, useRef, useState } from "react";
import { ElectricalBalance } from "../types";
import { cn } from "../lib/utils";

interface ShadcnChartProps {
  data: ElectricalBalance[];
}

export function ShadcnChart({ data }: ShadcnChartProps) {
  const [activeTab, setActiveTab] = useState<'balance' | 'generation' | 'sources'>('balance');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  // Procesamiento de datos para el gráfico
  const processData = () => {
    if (!data || data.length === 0) return null;

    // Ordena los datos por fecha
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Calcula valores para escala
    let maxValue = 0;
    if (activeTab === 'balance') {
      maxValue = Math.max(
        ...sortedData.map(d => Math.max(d.generation, d.demand, d.imports, d.exports))
      );
    } else if (activeTab === 'generation') {
      maxValue = Math.max(
        ...sortedData.map(d => d.generation)
      );
    } else {
      maxValue = Math.max(
        ...sortedData.flatMap(d => [
          d.details?.nuclear || 0,
          d.details?.hydro || 0,
          d.details?.wind || 0,
          d.details?.solar || 0,
          d.details?.thermal || 0
        ])
      );
    }

    return { sortedData, maxValue };
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const processedData = processData();
    if (!processedData) return;
    
    const { sortedData, maxValue } = processedData;
    
    // Configura el canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    setChartWidth(rect.width);
    setChartHeight(rect.height);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Limpia el canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Define colores para cada serie
    const colors = {
      generation: '#4f46e5', // indigo-600
      demand: '#ef4444',     // red-500
      imports: '#84cc16',    // lime-500
      exports: '#f97316',    // orange-500
      nuclear: '#8b5cf6',    // violet-500
      hydro: '#06b6d4',      // cyan-500
      wind: '#10b981',       // emerald-500
      solar: '#f59e0b',      // amber-500
      thermal: '#6b7280'     // gray-500
    };

    // Configuración de gráfico
    const padding = { top: 30, right: 20, bottom: 40, left: 60 };
    const chartInnerWidth = rect.width - padding.left - padding.right;
    const chartInnerHeight = rect.height - padding.top - padding.bottom;
    
    // Función para convertir valor a coordenada Y
    const getYCoordinate = (value: number) => {
      return padding.top + chartInnerHeight - (value / maxValue * chartInnerHeight);
    };
    
    // Dibujar ejes
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 1;
    
    // Eje Y
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartInnerHeight);
    
    // Eje X
    ctx.moveTo(padding.left, padding.top + chartInnerHeight);
    ctx.lineTo(padding.left + chartInnerWidth, padding.top + chartInnerHeight);
    ctx.stroke();
    
    // Dibujar líneas de cuadrícula Y
    const gridLines = 5;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '12px Inter, system-ui, sans-serif';
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartInnerHeight / gridLines) * i;
      const value = Math.round((maxValue - (maxValue / gridLines) * i) / 1000);
      
      ctx.beginPath();
      ctx.strokeStyle = '#e2e8f0'; // slate-200
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartInnerWidth, y);
      ctx.stroke();
      
      ctx.fillText(`${value}k`, padding.left - 10, y);
    }
    
    // Calcular ancho de columna para cada punto de datos
    const barWidth = Math.max(1, chartInnerWidth / sortedData.length - 2);
    const xStep = chartInnerWidth / (sortedData.length - 1);

    // Dibujar datos según el tab activo
    if (activeTab === 'balance') {
      // Líneas para cada serie
      const series = [
        { name: 'generation', color: colors.generation, data: sortedData.map(d => d.generation) },
        { name: 'demand', color: colors.demand, data: sortedData.map(d => d.demand) },
        { name: 'imports', color: colors.imports, data: sortedData.map(d => d.imports) },
        { name: 'exports', color: colors.exports, data: sortedData.map(d => d.exports) }
      ];
      
      series.forEach(serie => {
        ctx.beginPath();
        ctx.strokeStyle = serie.color;
        ctx.lineWidth = 2;
        
        sortedData.forEach((d, i) => {
          const x = padding.left + i * xStep;
          const y = getYCoordinate(serie.data[i]);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      });
    } else if (activeTab === 'generation') {
      // Gráfico de área para generación
      ctx.beginPath();
      ctx.fillStyle = `${colors.generation}40`; // Con transparencia
      
      sortedData.forEach((d, i) => {
        const x = padding.left + i * xStep;
        const y = getYCoordinate(d.generation);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      // Completar el área
      ctx.lineTo(padding.left + chartInnerWidth, padding.top + chartInnerHeight);
      ctx.lineTo(padding.left, padding.top + chartInnerHeight);
      ctx.closePath();
      ctx.fill();
      
      // Dibujar la línea superior
      ctx.beginPath();
      ctx.strokeStyle = colors.generation;
      ctx.lineWidth = 2;
      
      sortedData.forEach((d, i) => {
        const x = padding.left + i * xStep;
        const y = getYCoordinate(d.generation);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    } else {
      // Gráfico apilado para fuentes
      const seriesOrder = ['nuclear', 'hydro', 'wind', 'solar', 'thermal'];
      const stackedData = sortedData.map(d => {
        const values = {
          nuclear: d.details?.nuclear || 0,
          hydro: d.details?.hydro || 0,
          wind: d.details?.wind || 0,
          solar: d.details?.solar || 0,
          thermal: d.details?.thermal || 0
        };
        
        // Calcular acumulados
        let cumulative = 0;
        const stacked: Record<string, { start: number; end: number }> = {};
        
        seriesOrder.forEach(key => {
          stacked[key] = {
            start: cumulative,
            end: cumulative + values[key as keyof typeof values]
          };
          cumulative += values[key as keyof typeof values];
        });
        
        return stacked;
      });
      
      // Dibujar barras apiladas
      sortedData.forEach((d, i) => {
        const x = padding.left + i * xStep - barWidth / 2;
        
        seriesOrder.forEach(key => {
          const stack = stackedData[i][key];
          const startY = getYCoordinate(stack.start);
          const endY = getYCoordinate(stack.end);
          const height = startY - endY;
          
          if (height > 0) {
            ctx.fillStyle = colors[key as keyof typeof colors];
            ctx.fillRect(x, endY, barWidth, height);
          }
        });
      });
    }
    
    // Dibujar etiquetas del eje X (fechas)
    const labelStep = Math.ceil(sortedData.length / 6); // Mostrar aproximadamente 6 etiquetas
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#94a3b8'; // slate-400
    
    sortedData.forEach((d, i) => {
      if (i % labelStep === 0 || i === sortedData.length - 1) {
        const x = padding.left + i * xStep;
        const date = new Date(d.timestamp);
        const label = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        
        ctx.fillText(label, x, padding.top + chartInnerHeight + 10);
      }
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
    
    const handleResize = () => {
      drawChart();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, activeTab]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.625 1.5C3.59 1.5 1.875 3.214 1.875 5.25V9.375C1.875 10.411 2.714 11.25 3.75 11.25C4.786 11.25 5.625 10.411 5.625 9.375V8.25H9.375V9.375C9.375 10.411 10.214 11.25 11.25 11.25C12.286 11.25 13.125 10.411 13.125 9.375V5.25C13.125 3.214 11.41 1.5 9.375 1.5H5.625ZM5.625 6.75V5.25H9.375V6.75H5.625ZM9.375 15.375C9.375 14.339 10.214 13.5 11.25 13.5H15.75C16.786 13.5 17.625 14.339 17.625 15.375V16.5H21.375V17.25C21.375 19.286 19.66 21 17.625 21H14.625C12.59 21 10.875 19.286 10.875 17.25V15.375C10.875 15.339 10.877 15.304 10.879 15.269C10.871 15.303 10.861 15.337 10.847 15.37C10.222 16.683 8.669 17.286 7.355 16.66C6.042 16.035 5.439 14.483 6.064 13.17C6.689 11.856 8.242 11.253 9.555 11.878C10.315 12.243 10.845 12.9 11.046 13.636C11.001 13.608 10.952 13.585 10.9 13.569C10.376 13.424 9.838 13.737 9.693 14.261C9.547 14.784 9.86 15.323 10.384 15.468C10.429 15.479 10.474 15.488 10.519 15.493C10.404 15.68 10.34 15.9 10.34 16.137C10.34 16.862 10.976 17.422 11.75 17.422H13.106C13.201 17.422 13.283 17.41 13.361 17.393C13.506 17.683 13.801 17.886 14.144 17.886H14.606C15.14 17.886 15.574 18.32 15.574 18.853C15.574 19.387 15.14 19.821 14.606 19.821C14.439 19.821 14.283 19.771 14.151 19.686C14.135 19.675 14.118 19.664 14.1 19.656C13.96 19.579 13.798 19.533 13.625 19.533C13.09 19.533 12.656 19.967 12.656 20.5C12.656 21.033 13.09 21.467 13.625 21.467C13.839 21.467 14.04 21.394 14.202 21.272C14.551 21.402 14.942 21.468 15.339 21.424C16.811 21.267 17.938 19.978 17.938 18.5C17.938 17.022 16.811 15.733 15.339 15.576C14.942 15.532 14.551 15.598 14.202 15.728C14.04 15.606 13.839 15.533 13.625 15.533C13.09 15.533 12.656 15.967 12.656 16.5C12.656 17.033 13.09 17.467 13.625 17.467C13.646 17.467 13.666 17.466 13.686 17.464C13.652 17.501 13.618 17.538 13.583 17.574C13.392 17.768 13.155 17.877 12.875 17.877H11.519C11.171 17.877 10.84 17.78 10.562 17.613C10.675 17.516 10.781 17.41 10.875 17.291V17.25C10.875 16.339 11.61 15.604 12.518 15.557C12.634 15.551 12.75 15.554 12.865 15.567C12.771 15.693 12.694 15.832 12.637 15.983C12.491 16.506 12.804 17.045 13.328 17.19C13.852 17.336 14.39 17.023 14.536 16.499C14.682 15.975 14.369 15.437 13.845 15.291C13.829 15.286 13.812 15.282 13.795 15.278C13.866 15.189 13.945 15.107 14.032 15.034C14.581 14.572 15.28 14.25 16.086 14.25C17.697 14.25 19 15.584 19 17.235V19.5H20.625V17.25C20.625 15.214 18.91 13.5 16.875 13.5H11.25V15.375H17.625V16.5H13.125V17.25C13.125 18.114 12.698 18.895 12.039 19.387C11.714 19.621 11.352 19.853 10.959 20.006C10.377 20.238 9.75 20.25 9.375 20.25C6.891 20.25 4.875 18.234 4.875 15.75C4.875 13.266 6.891 11.25 9.375 11.25V15.375Z" fill="currentColor" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">No hay datos disponibles</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Seleccione un rango de fechas diferente o actualice los datos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Balance Eléctrico</h2>
        <div className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('balance')}
            className={cn(
              "relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'balance' 
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
                : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            )}
          >
            Balance
          </button>
          <button
            onClick={() => setActiveTab('generation')}
            className={cn(
              "relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'generation' 
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
                : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            )}
          >
            Generación
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={cn(
              "relative inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'sources' 
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
                : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            )}
          >
            Fuentes
          </button>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-800 p-4 h-96">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full" 
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
        {activeTab === 'balance' && (
          <>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Generación</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Demanda</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-lime-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Importaciones</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Exportaciones</span>
            </div>
          </>
        )}
        {activeTab === 'sources' && (
          <>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-violet-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Nuclear</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Hidráulica</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Eólica</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Solar</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Térmica</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
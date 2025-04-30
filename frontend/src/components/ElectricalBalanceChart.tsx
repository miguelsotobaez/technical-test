import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ElectricalBalance } from '../types';

interface ElectricalBalanceChartProps {
  data: ElectricalBalance[];
}

const COLORS = {
  renewable: '#34D399', // verde
  nonRenewable: '#F87171', // rojo
  storage: '#60A5FA', // azul
  nuclear: '#8B5CF6', // morado
  hydro: '#3B82F6', // azul
  wind: '#10B981', // verde
  solar: '#FBBF24', // amarillo
  thermal: '#EC4899', // rosa
  imports: '#8B5CF6', // morado
  exports: '#F59E0B', // naranja
  balance: '#6B7280', // gris
  generation: '#0EA5E9', // azul claro
  demand: '#4F46E5', // indigo
};

export const ElectricalBalanceChart = ({ data }: ElectricalBalanceChartProps) => {
  const [chartType, setChartType] = useState<'generation' | 'balance' | 'details'>('generation');

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center text-gray-500">
        No hay datos disponibles para mostrar
      </div>
    );
  }

  const formattedData = data.map((item) => {
    const date = new Date(item.timestamp);
    return {
      ...item,
      date: format(date, 'MMM yyyy', { locale: es }),
      formattedDate: format(date, 'dd/MM/yyyy', { locale: es }),
    };
  });

  const generatePieChartData = () => {
    if (data.length === 0) return [];

    // Tomar el último dato para el gráfico de pie
    const lastItem = data[data.length - 1];
    return [
      { name: 'Renovable', value: lastItem.details.renewable },
      { name: 'No Renovable', value: lastItem.details.nonRenewable },
      { name: 'Almacenamiento', value: lastItem.details.storage },
    ];
  };

  const generateDetailsPieChartData = () => {
    if (data.length === 0) return [];

    // Tomar el último dato para el gráfico de pie
    const lastItem = data[data.length - 1];
    return [
      { name: 'Nuclear', value: lastItem.details.nuclear },
      { name: 'Hidráulica', value: lastItem.details.hydro },
      { name: 'Eólica', value: lastItem.details.wind },
      { name: 'Solar', value: lastItem.details.solar },
      { name: 'Térmica', value: lastItem.details.thermal },
    ];
  };

  const renderGenerationChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [`${value.toLocaleString()} MWh`, name]}
          labelFormatter={(label) => `Fecha: ${label}`}
        />
        <Legend />
        <Bar dataKey="details.renewable" name="Renovable" stackId="a" fill={COLORS.renewable} />
        <Bar dataKey="details.nonRenewable" name="No Renovable" stackId="a" fill={COLORS.nonRenewable} />
        <Bar dataKey="details.storage" name="Almacenamiento" stackId="a" fill={COLORS.storage} />
        <Line type="monotone" dataKey="demand" name="Demanda" stroke={COLORS.demand} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderBalanceChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [`${value.toLocaleString()} MWh`, name]}
          labelFormatter={(label) => `Fecha: ${label}`}
        />
        <Legend />
        <Bar dataKey="imports" name="Importaciones" fill={COLORS.imports} />
        <Bar dataKey="exports" name="Exportaciones" fill={COLORS.exports} />
        <Line type="monotone" dataKey="balance" name="Balance" stroke={COLORS.balance} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderDetailsCharts = () => (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/2">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Distribución de Generación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={generatePieChartData()}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {generatePieChartData().map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="md:w-1/2">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Tipos de Generación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={generateDetailsPieChartData()}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {generateDetailsPieChartData().map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index + 3]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Balance Eléctrico</h2>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setChartType('generation')}
            className={`px-4 py-2 text-sm font-medium text-gray-700 ${
              chartType === 'generation'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white hover:bg-gray-100'
            } border border-gray-300 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700`}
          >
            Generación
          </button>
          <button
            type="button"
            onClick={() => setChartType('balance')}
            className={`px-4 py-2 text-sm font-medium text-gray-700 ${
              chartType === 'balance'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white hover:bg-gray-100'
            } border-t border-b border-gray-300 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700`}
          >
            Balance
          </button>
          <button
            type="button"
            onClick={() => setChartType('details')}
            className={`px-4 py-2 text-sm font-medium text-gray-700 ${
              chartType === 'details'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white hover:bg-gray-100'
            } border border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700`}
          >
            Detalles
          </button>
        </div>
      </div>

      {chartType === 'generation' && renderGenerationChart()}
      {chartType === 'balance' && renderBalanceChart()}
      {chartType === 'details' && renderDetailsCharts()}
    </div>
  );
}; 
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  loading: boolean;
}

export const DateRangePicker = ({ onDateRangeChange, loading }: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState<string>(
    format(new Date(new Date().getFullYear(), new Date().getMonth() - 12, 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [error, setError] = useState<string>('');

  const validateDateRange = (start: Date, end: Date): boolean => {
    // Check if end date is after start date
    if (end < start) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }
    
    // Ya no validamos el rango máximo de 1 año
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (validateDateRange(start, end)) {
      onDateRangeChange(start, end);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (endDate) {
      validateDateRange(new Date(e.target.value), new Date(endDate));
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (startDate) {
      validateDateRange(new Date(startDate), new Date(e.target.value));
    }
  };

  // Ayudantes para establecer rangos predefinidos
  const setLastMonth = () => {
    const today = new Date();
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    setStartDate(format(firstDayLastMonth, 'yyyy-MM-dd'));
    setEndDate(format(lastDayLastMonth, 'yyyy-MM-dd'));
    
    if (validateDateRange(firstDayLastMonth, lastDayLastMonth)) {
      onDateRangeChange(firstDayLastMonth, lastDayLastMonth);
    }
  };

  const setLastYear = () => {
    const today = new Date();
    const firstDayLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const lastDayLastYear = new Date(today.getFullYear() - 1, 11, 31);
    
    setStartDate(format(firstDayLastYear, 'yyyy-MM-dd'));
    setEndDate(format(lastDayLastYear, 'yyyy-MM-dd'));
    
    if (validateDateRange(firstDayLastYear, lastDayLastYear)) {
      onDateRangeChange(firstDayLastYear, lastDayLastYear);
    }
  };

  const setYTD = () => {
    const today = new Date();
    const firstDayThisYear = new Date(today.getFullYear(), 0, 1);
    
    setStartDate(format(firstDayThisYear, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
    
    if (validateDateRange(firstDayThisYear, today)) {
      onDateRangeChange(firstDayThisYear, today);
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-md shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row justify-between mb-3">
        <h2 className="text-base font-medium mb-2 sm:mb-0">Seleccionar rango de fechas</h2>
        <div className="flex space-x-2">
          <button 
            type="button" 
            onClick={setLastMonth}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 text-xs"
            disabled={loading}
          >
            Último mes
          </button>
          <button 
            type="button" 
            onClick={setLastYear}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 text-xs"
            disabled={loading}
          >
            Último año
          </button>
          <button 
            type="button" 
            onClick={setYTD}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 text-xs"
            disabled={loading}
          >
            Año actual
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col flex-1">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de fin
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !!error}
          className="self-end px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 font-medium disabled:bg-gray-50 disabled:text-gray-400"
        >
          {loading ? 'Cargando...' : 'Buscar datos'}
        </button>
      </form>
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}; 
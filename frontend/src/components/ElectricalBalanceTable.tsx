import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ElectricalBalance } from '../types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface ElectricalBalanceTableProps {
  data: ElectricalBalance[];
}

export const ElectricalBalanceTable = ({ data }: ElectricalBalanceTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length]);
  
  // Obtener los datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);
  
  // Control de páginas
  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };
  
  // Ir a una página específica
  const goToFirstPage = () => goToPage(1);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToLastPage = () => goToPage(totalPages);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
        <p className="mt-1 text-sm text-gray-500">Seleccione un rango de fechas diferente o actualice los datos.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Datos de Balance Eléctrico</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Generación (GWh)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Demanda (GWh)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Importaciones (GWh)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Exportaciones (GWh)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Balance (GWh)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {paginatedData.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {format(new Date(item.timestamp), 'dd/MM/yyyy', { locale: es })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {(item.generation / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {Math.abs(item.demand / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {(item.imports / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {(item.exports / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {(item.balance / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, data.length)} de {data.length} registros
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              title="Primera página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Página {currentPage} de {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              title="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              title="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {totalPages <= 1 && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Mostrando {data.length} registros
        </div>
      )}
    </div>
  );
}; 
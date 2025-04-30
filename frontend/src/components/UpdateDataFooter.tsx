import { useState, useEffect, useRef } from 'react';
import { orbit } from 'ldrs';

interface UpdateDataFooterProps {
  onUpdateData: (year: number) => void;
  loading: boolean;
}

// Registra el componente para uso global
orbit.register();

// Definimos un componente de React específico
const OrbitLoader = ({ size = 20, color = "white" }) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaderRef.current) {
      // Crear el elemento personalizado
      const loader = document.createElement('l-orbit');
      loader.setAttribute('size', size.toString());
      loader.setAttribute('color', color);
      
      // Limpiar el contenedor y añadir el loader
      loaderRef.current.innerHTML = '';
      loaderRef.current.appendChild(loader);
    }
  }, [size, color]);

  return <div ref={loaderRef} className="inline-block"></div>;
};

export const UpdateDataFooter = ({ onUpdateData, loading }: UpdateDataFooterProps) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  
  // Generar opciones para los últimos 10 años
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);
  
  const handleUpdate = () => {
    onUpdateData(selectedYear);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-3 z-10">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
            <span className="text-gray-700 mr-2 text-sm">Actualizar datos desde REE:</span>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded p-1 text-sm"
              disabled={loading}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="https://www.ree.es/es/datos-espana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 underline"
            >
              Más información en REE
            </a>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm disabled:bg-green-300"
            >
              {loading ? (
                <div className="flex items-center">
                  <span className="mr-1">
                    <OrbitLoader size={16} color="white" />
                  </span>
                  <span>Actualizando...</span>
                </div>
              ) : (
                'Actualizar Datos'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
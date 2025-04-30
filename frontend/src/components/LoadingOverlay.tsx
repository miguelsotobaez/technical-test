import React, { useEffect, useRef } from 'react';
import { ring } from 'ldrs';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

// Registra el componente para uso global
ring.register();

// Definimos un componente de React específico
const RingLoader = ({ size = 75, color = "#4f46e5", speed = 1.5, stroke = 5, bgOpacity = 0.2 }) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaderRef.current) {
      // Crear el elemento personalizado
      const loader = document.createElement('l-ring');
      loader.setAttribute('size', size.toString());
      loader.setAttribute('color', color);
      loader.setAttribute('speed', speed.toString());
      loader.setAttribute('stroke', stroke.toString());
      loader.setAttribute('bg-opacity', bgOpacity.toString());
      
      // Limpiar el contenedor y añadir el loader
      loaderRef.current.innerHTML = '';
      loaderRef.current.appendChild(loader);
    }
  }, [size, color, speed, stroke, bgOpacity]);

  return <div ref={loaderRef} className="inline-block"></div>;
};

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Cargando datos...',
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center">
        <div className="mb-6">
          <RingLoader 
            size={75}
            color="#4f46e5"
            speed={1.5}
            stroke={5}
            bgOpacity={0.2}
          />
        </div>
        
        <div className="text-gray-800 font-medium text-center">
          {message}
          <div className="text-sm text-gray-500 mt-1">Por favor, espere mientras procesamos su solicitud</div>
        </div>
      </div>
    </div>
  );
}; 
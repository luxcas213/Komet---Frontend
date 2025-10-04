'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const SolarSystem = dynamic(() => import("@/components/SolarSystem"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Cargando simulación del sistema solar...</p>
      </div>
    </div>
  )
})

interface SimulationClientProps {
  id: string;
}

export default function SimulationClient({ id }: SimulationClientProps) {
  return (
    <div className="relative w-full h-screen bg-black">
      {/* Botón Volver */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/simulation"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Link>
      </div>

      {/* Información del asteroide */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg p-4 max-w-sm">
          <h3 className="font-semibold mb-2">Simulación Asteroide</h3>
          <p className="text-sm text-gray-300">ID: {id}</p>
          <p className="text-xs text-gray-400 mt-2">
            Use el mouse para navegar por el espacio 3D
          </p>
        </div>
      </div>

      {/* Componente Three.js */}
      <SolarSystem />
    </div>
  );
}
'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchAsteroidData } from '@/utils/api'
import { AsteroidInfo } from '@/types/asteroid'

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
  const [asteroidData, setAsteroidData] = useState<AsteroidInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAsteroidData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAsteroidData(id);
        setAsteroidData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error loading asteroid data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAsteroidData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Cargando datos del asteroide {id}...</p>
          <p className="text-sm text-gray-400 mt-2">Obteniendo parámetros orbitales</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error al cargar datos</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Link 
            href="/simulation"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver a selección
          </Link>
        </div>
      </div>
    );
  }

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
          <h3 className="font-semibold mb-2">Sistema Solar 3D</h3>
          {asteroidData && (
            <>
              <p className="text-sm text-gray-300 mb-1">{asteroidData.name}</p>
              <p className="text-xs text-gray-400 mb-3">ID: {asteroidData.id}</p>
              
              <div className="space-y-2">
                <div className="text-xs">
                  <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-yellow-300">Sol (centro)</span>
                </div>
                <div className="text-xs">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-blue-300">Tierra (1 AU, 365 días)</span>
                </div>
                <div className="text-xs">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${asteroidData.is_hazardous ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                  <span className={asteroidData.is_hazardous ? 'text-red-300' : 'text-orange-300'}>
                    {asteroidData.name.split(' ')[0]} 
                    {asteroidData.is_hazardous && ' (Peligroso)'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-600">
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Diámetro promedio: {asteroidData.diameter_avg.toFixed(0)} m</p>
                  <p>Rango: {asteroidData.diameter_min.toFixed(0)}-{asteroidData.diameter_max.toFixed(0)} m</p>
                  {asteroidData.close_approach_velocity && (
                    <p>Velocidad de aproximación: {asteroidData.close_approach_velocity.toFixed(0)} km/h</p>
                  )}
                  <p>Semi-eje mayor: {asteroidData.orbital_params.semi_major_axis.toFixed(3)} AU</p>
                  <p>Excentricidad: {asteroidData.orbital_params.eccentricity.toFixed(4)}</p>
                  <p>Inclinación: {asteroidData.orbital_params.inclination.toFixed(2)}°</p>
                  <p>Período orbital: {asteroidData.orbital_params.orbital_period.toFixed(1)} días</p>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-600">
                <p className="text-xs text-gray-400">
                  Mecánica orbital de Kepler • Tiempo acelerado 50x
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Use el mouse para navegar por el espacio 3D
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Componente Three.js */}
      <SolarSystem asteroidData={asteroidData} />
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Interfaces para los datos de asteroides
interface Asteroid {
  id: string;
  name: string;
  diameter_min_m: string;
  diameter_max_m: string;
  close_approach_date: string;
  miss_distance_km: string;
  velocity_kph: string;
}

interface AsteroidData {
  [date: string]: Asteroid[];
}

// Componente para cada card de asteroide
function AsteroidCard({ asteroid }: { asteroid: Asteroid }) {
  const diameterMin = parseFloat(asteroid.diameter_min_m);
  const diameterMax = parseFloat(asteroid.diameter_max_m);
  const avgDiameter = (diameterMin + diameterMax) / 2;
  const missDistance = parseInt(asteroid.miss_distance_km);
  const velocity = parseInt(asteroid.velocity_kph);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-colors group">
      <h3 className="text-xl font-bold text-white mb-4 truncate" title={asteroid.name}>
        {asteroid.name}
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">ID:</span>
          <span className="text-white font-mono">{asteroid.id}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Diámetro promedio:</span>
          <span className="text-blue-400 font-semibold">
            {avgDiameter.toFixed(1)} m
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Rango diámetro:</span>
          <span className="text-gray-300 text-xs">
            {diameterMin.toFixed(1)} - {diameterMax.toFixed(1)} m
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Fecha aproximación:</span>
          <span className="text-green-400">{asteroid.close_approach_date}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Distancia:</span>
          <span className="text-yellow-400">
            {(missDistance / 1000000).toFixed(2)} M km
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Velocidad:</span>
          <span className="text-red-400">
            {velocity.toLocaleString()} km/h
          </span>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-xs">Peligrosidad:</span>
            <div className={`px-2 py-1 rounded text-xs font-semibold ${
              missDistance < 5000000 ? 'bg-red-600 text-white' :
              missDistance < 20000000 ? 'bg-yellow-600 text-white' :
              'bg-green-600 text-white'
            }`}>
              {missDistance < 5000000 ? 'ALTO' :
               missDistance < 20000000 ? 'MEDIO' : 'BAJO'}
            </div>
          </div>
          
          {/* Botones de enlaces a las simulaciones */}
          <div className="space-y-2">
            <Link 
              href={`/simulation/${asteroid.id}`}
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 group-hover:bg-blue-500"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver Orbita
              </span>
            </Link>
            
            <Link 
              href={`/simulation/impact/${asteroid.id}`}
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 group-hover:bg-red-500"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5z" />
                </svg>
                Simular Impacto
              </span>
            </Link> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimulationPage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [diameterFilter, setDiameterFilter] = useState<string>('');
  const [dangerFilter, setDangerFilter] = useState<string>('');
  const [velocityFilter, setVelocityFilter] = useState<string>('');

  useEffect(() => {
    fetchAsteroids();
  }, []);

  const fetchAsteroids = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://komet-backend-phi.vercel.app/api/asteroids');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: AsteroidData = await response.json();
      
      // Obtener todos los asteroides de todas las fechas
      const allAsteroids: Asteroid[] = [];
      const dates = Object.keys(data);
      
      dates.forEach(date => {
        allAsteroids.push(...data[date]);
      });
      
      setAsteroids(allAsteroids);
      
      // Mantener "Todas las fechas" como opción por defecto
      // No establecer ninguna fecha específica
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el nivel de peligrosidad
  const getDangerLevel = (missDistance: number) => {
    if (missDistance < 5000000) return 'ALTO';
    if (missDistance < 20000000) return 'MEDIO';
    return 'BAJO';
  };

  // Filtros aplicados
  const filteredAsteroids = asteroids.filter(asteroid => {
    const diameterMin = parseFloat(asteroid.diameter_min_m);
    const diameterMax = parseFloat(asteroid.diameter_max_m);
    const avgDiameter = (diameterMin + diameterMax) / 2;
    const missDistance = parseInt(asteroid.miss_distance_km);
    const velocity = parseInt(asteroid.velocity_kph);
    const dangerLevel = getDangerLevel(missDistance);
    
    // Filtro por fecha
    if (selectedDate && asteroid.close_approach_date !== selectedDate) {
      return false;
    }
    
    // Filtro por diámetro
    if (diameterFilter) {
      switch (diameterFilter) {
        case 'small':
          if (avgDiameter >= 50) return false;
          break;
        case 'medium':
          if (avgDiameter < 50 || avgDiameter >= 200) return false;
          break;
        case 'large':
          if (avgDiameter < 200 || avgDiameter >= 500) return false;
          break;
        case 'xlarge':
          if (avgDiameter < 500) return false;
          break;
      }
    }
    
    // Filtro por peligrosidad
    if (dangerFilter && dangerLevel !== dangerFilter) {
      return false;
    }
    
    // Filtro por velocidad
    if (velocityFilter) {
      switch (velocityFilter) {
        case 'slow':
          if (velocity >= 30000) return false;
          break;
        case 'medium':
          if (velocity < 30000 || velocity >= 60000) return false;
          break;
        case 'fast':
          if (velocity < 60000 || velocity >= 100000) return false;
          break;
        case 'vfast':
          if (velocity < 100000) return false;
          break;
      }
    }
    
    return true;
  });

  const availableDates = [...new Set(asteroids.map(a => a.close_approach_date))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Botón Volver */}
        <div className="fixed top-4 left-4 z-50">
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Cargando datos de asteroides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Botón Volver */}
        <div className="fixed top-4 left-4 z-50">
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl mb-4">Error al cargar datos</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchAsteroids}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Botón Volver */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Asteroides Cercanos a la Tierra</h1>
        <p className="text-lg mb-8 text-center text-gray-400">
          Monitoreo en tiempo real de asteroides que se aproximan a nuestro planeta.
        </p>
        
        {/* Panel de filtros */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Filtros de Búsqueda
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por fecha */}
            <div className="flex flex-col gap-2">
              <label htmlFor="date-filter" className="text-gray-300 text-sm font-medium">Fecha de aproximación:</label>
              <select
                id="date-filter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todas las fechas</option>
                {availableDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>

            {/* Filtro por diámetro */}
            <div className="flex flex-col gap-2">
              <label htmlFor="diameter-filter" className="text-gray-300 text-sm font-medium">Diámetro promedio:</label>
              <select
                id="diameter-filter"
                value={diameterFilter}
                onChange={(e) => setDiameterFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todos los tamaños</option>
                <option value="small">Pequeño (&lt; 50m)</option>
                <option value="medium">Mediano (50-200m)</option>
                <option value="large">Grande (200-500m)</option>
                <option value="xlarge">Muy Grande (&gt; 500m)</option>
              </select>
            </div>

            {/* Filtro por peligrosidad */}
            <div className="flex flex-col gap-2">
              <label htmlFor="danger-filter" className="text-gray-300 text-sm font-medium">Nivel de peligrosidad:</label>
              <select
                id="danger-filter"
                value={dangerFilter}
                onChange={(e) => setDangerFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todos los niveles</option>
                <option value="ALTO">🔴 Alto (&lt; 5M km)</option>
                <option value="MEDIO">🟡 Medio (5-20M km)</option>
                <option value="BAJO">🟢 Bajo (&gt; 20M km)</option>
              </select>
            </div>

            {/* Filtro por velocidad */}
            <div className="flex flex-col gap-2">
              <label htmlFor="velocity-filter" className="text-gray-300 text-sm font-medium">Velocidad:</label>
              <select
                id="velocity-filter"
                value={velocityFilter}
                onChange={(e) => setVelocityFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todas las velocidades</option>
                <option value="slow">Lenta (&lt; 30,000 km/h)</option>
                <option value="medium">Moderada (30-60k km/h)</option>
                <option value="fast">Rápida (60-100k km/h)</option>
                <option value="vfast">Muy Rápida (&gt; 100k km/h)</option>
              </select>
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => {
                setSelectedDate('');
                setDiameterFilter('');
                setDangerFilter('');
                setVelocityFilter('');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
            >
              Limpiar filtros
            </button>
            
            <div className="text-gray-400 text-sm">
              Mostrando <span className="font-semibold text-white">{filteredAsteroids.length}</span> de <span className="font-semibold text-white">{asteroids.length}</span> asteroides
            </div>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAsteroids.slice().reverse().map((asteroid) => (
            <AsteroidCard key={asteroid.id} asteroid={asteroid} />
          ))}
        </div>

        {filteredAsteroids.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            No se encontraron asteroides para los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
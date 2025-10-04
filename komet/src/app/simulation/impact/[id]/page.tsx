'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

// Componente para la simulación de impacto visual
function ImpactSimulation({ asteroid }: { asteroid: Asteroid }) {
  const [impactStage, setImpactStage] = useState<'approaching' | 'impact' | 'aftermath'>('approaching');
  const [impactTimer, setImpactTimer] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setImpactTimer(prev => {
        if (prev <= 1) {
          setImpactStage('impact');
          setTimeout(() => setImpactStage('aftermath'), 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const diameterMin = parseFloat(asteroid.diameter_min_m);
  const diameterMax = parseFloat(asteroid.diameter_max_m);
  const avgDiameter = (diameterMin + diameterMax) / 2;
  const velocity = parseInt(asteroid.velocity_kph);

  // Calcular efectos del impacto basado en el tamaño y velocidad
  const getImpactEffects = () => {
    const energy = Math.pow(avgDiameter / 100, 2) * Math.pow(velocity / 50000, 2);
    
    if (energy > 10) {
      return {
        scale: 'Extinción masiva',
        crater: `${(avgDiameter * 20).toFixed(0)} km`,
        magnitude: '12+ (Catastrófico)',
        color: 'text-red-500',
        bgColor: 'bg-red-900/20',
        description: 'Impacto devastador que alteraría el clima global y causaría extinciones masivas'
      };
    } else if (energy > 5) {
      return {
        scale: 'Regional devastador',
        crater: `${(avgDiameter * 15).toFixed(0)} km`,
        magnitude: '9-11 (Severo)',
        color: 'text-orange-500',
        bgColor: 'bg-orange-900/20',
        description: 'Destrucción regional masiva con efectos climáticos significativos'
      };
    } else if (energy > 1) {
      return {
        scale: 'Local significativo',
        crater: `${(avgDiameter * 10).toFixed(0)} km`,
        magnitude: '6-8 (Moderado)',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-900/20',  
        description: 'Destrucción local considerable, afectaría ciudades enteras'
      };
    } else {
      return {
        scale: 'Local menor',
        crater: `${(avgDiameter * 5).toFixed(0)} km`,
        magnitude: '3-5 (Menor)',
        color: 'text-green-500',
        bgColor: 'bg-green-900/20',
        description: 'Daños localizados, similar a una explosión nuclear'
      };
    }
  };

  const effects = getImpactEffects();

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        Simulación de Impacto en Tiempo Real
      </h3>
      
      {/* Contador regresivo */}
      {impactStage === 'approaching' && (
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-red-400 mb-2">{impactTimer}</div>
          <div className="text-lg text-gray-300">segundos hasta el impacto</div>
        </div>
      )}

      {/* Visualización del impacto */}
      <div className="relative h-64 bg-gradient-to-b from-blue-900 to-green-800 rounded-lg mb-6 overflow-hidden">
        {impactStage === 'approaching' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"
              style={{
                animation: `approach ${impactTimer}s linear`,
                top: '10px',
                left: '10px'
              }}
            ></div>
            <div className="text-center text-white">
              <div className="text-lg font-semibold">🌍 Tierra</div>
              <div className="text-sm">Asteroide aproximándose...</div>
            </div>
          </div>
        )}

        {impactStage === 'impact' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping w-32 h-32 bg-red-500 rounded-full opacity-75"></div>
            <div className="absolute animate-pulse text-6xl">💥</div>
          </div>
        )}

        {impactStage === 'aftermath' && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900 to-red-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-lg font-semibold">Crater de Impacto</div>
              <div className="text-sm">Efectos devastadores</div>
            </div>
          </div>
        )}
      </div>

      {/* Efectos del impacto */}
      <div className={`${effects.bgColor} border border-gray-600 rounded-lg p-4`}>
        <h4 className={`text-xl font-bold ${effects.color} mb-3`}>
          Efectos del Impacto: {effects.scale}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Diámetro del cráter:</span>
              <span className="text-white font-semibold">{effects.crater}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Magnitud del evento:</span>
              <span className={`font-semibold ${effects.color}`}>{effects.magnitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Energía liberada:</span>
              <span className="text-white font-semibold">
                {(Math.pow(avgDiameter / 100, 2) * Math.pow(velocity / 50000, 2) * 100).toFixed(1)} Megatones TNT
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Velocidad de impacto:</span>
              <span className="text-red-400 font-semibold">{velocity.toLocaleString()} km/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Área afectada:</span>
              <span className="text-white font-semibold">
                {(Math.PI * Math.pow(parseFloat(effects.crater) * 5, 2)).toFixed(0)} km²
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <p className="text-gray-300 text-sm italic">{effects.description}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes approach {
          0% { transform: translate(-200px, -200px) rotate(45deg); }
          100% { transform: translate(200px, 200px) rotate(45deg); }
        }
      `}</style>
    </div>
  );
}

export default function ImpactPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [asteroid, setAsteroid] = useState<Asteroid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAsteroidData();
    }
  }, [id]);

  const fetchAsteroidData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://komet-backend-phi.vercel.app/api/asteroids');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: AsteroidData = await response.json();
      
      // Buscar el asteroide por ID en todas las fechas
      let foundAsteroid: Asteroid | null = null;
      Object.values(data).forEach(asteroidArray => {
        const found = asteroidArray.find(ast => ast.id === id);
        if (found) {
          foundAsteroid = found;
        }
      });
      
      if (foundAsteroid) {
        setAsteroid(foundAsteroid);
      } else {
        setError('Asteroide no encontrado');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Botón Volver */}
        <div className="fixed top-4 left-4 z-50">
          <Link 
            href="/simulation"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Simulaciones
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mb-4"></div>
          <p className="text-lg">Cargando simulación de impacto...</p>
        </div>
      </div>
    );
  }

  if (error || !asteroid) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Botón Volver */}
        <div className="fixed top-4 left-4 z-50">
          <Link 
            href="/simulation"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Simulaciones
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl mb-4">Error al cargar el asteroide</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchAsteroidData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const diameterMin = parseFloat(asteroid.diameter_min_m);
  const diameterMax = parseFloat(asteroid.diameter_max_m);
  const avgDiameter = (diameterMin + diameterMax) / 2;
  const missDistance = parseInt(asteroid.miss_distance_km);
  const velocity = parseInt(asteroid.velocity_kph);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Botón Volver */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          href="/simulation"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Simulaciones
        </Link>
      </div>

      <div className="max-w-6xl mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Simulación de Impacto
          </h1>
          <h2 className="text-2xl text-red-400 mb-2">{asteroid.name}</h2>
          <p className="text-gray-400">
            Análisis detallado del impacto potencial en la Tierra
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del asteroide */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Datos del Asteroide
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
                <span className="text-gray-300">
                  {diameterMin.toFixed(1)} - {diameterMax.toFixed(1)} m
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Fecha aproximación:</span>
                <span className="text-green-400">{asteroid.close_approach_date}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Distancia de paso:</span>
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
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Nivel de peligro actual:</span>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    missDistance < 5000000 ? 'bg-red-600 text-white' :
                    missDistance < 20000000 ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {missDistance < 5000000 ? 'ALTO' :
                     missDistance < 20000000 ? 'MEDIO' : 'BAJO'}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón a simulación 3D */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <Link 
                href={`/simulation/${asteroid.id}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver Simulación 3D
                </span>
              </Link>
            </div>
          </div>

          {/* Simulación de impacto */}
          <ImpactSimulation asteroid={asteroid} />
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-yellow-400 font-semibold mb-1">Aviso Importante</h4>
              <p className="text-yellow-200 text-sm">
                Esta es una simulación hipotética con fines educativos. Los cálculos son aproximados y los asteroides listados 
                NO impactarán la Tierra según las predicciones actuales. La distancia real de paso es segura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
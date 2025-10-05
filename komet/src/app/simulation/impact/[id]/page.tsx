'use client';

import { useEffect, useState } from 'react';
import main from './simviewer/main';
import { useParams, useRouter } from 'next/navigation';

interface BestHypothetical {
  impact_lat_deg: number;
  impact_lon_deg: number;
  impact_angle_deg: number;
  azimuth_deg: number;
  diameter_meters_mean: number;
  mass_kg_estimate: number;
  kinetic_energy_joules: number;
  kinetic_energy_megatons_tnt: number;
}

interface Matching {
  angular_mismatch_deg: number;
  speed_difference_percent: number;
  likelihood_percent: number;
  conservative_upper_bound_percent: number;
}

interface Match {
  close_approach_date: string;
  orbiting_body: string;
  miss_distance_km: number;
  rel_speed_km_s_estimate: number;
  used_orbital_propagation: boolean;
  best_hypothetical: BestHypothetical;
  matching: Matching;
}

interface SimData {
  inputId: string;
  name: string;
  generatedAt: string;
  matches: Match[];
}

export default function ImpactSimulation() {
  const { id } = useParams();
  const router = useRouter();
  const [simData, setSimData] = useState<SimData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    main(Number(id));
    
    const fetchSimData = async () => {
      try {
        setLoading(true);
        const URL_SIMDATA = `http://localhost:3001/api/asteroidsimdata/${id}`;
        const response = await fetch(URL_SIMDATA);
        const data = await response.json();
        setSimData(data);
      } catch (error) {
        console.error('Error fetching simulation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimData();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };


  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Estilos personalizados para el slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
      `}</style>
      
      {/* Canvas de Three.js como fondo */}
      <canvas id="c" className="absolute inset-0 z-0"></canvas>
      
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-4 left-4">
          <button
            onClick={handleGoBack}
            className="pointer-events-auto cursor-pointer bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-lg group"
          >
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="transition-all duration-300 group-hover:font-semibold">Volver</span>
          </button>
        </div>

        <div className="absolute top-4 right-4 bottom-50">
          <div className="pointer-events-auto bg-black/50 text-white rounded-lg backdrop-blur-sm border border-white/20 w-80 h-full flex flex-col">
            {/* Sección superior: Información de aproximación (80%) */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ height: '80%' }}>
              <h3 className="font-semibold mb-3">Aproximación Cercana</h3>
              
              {loading ? (
                <p className="text-sm text-gray-300">Cargando datos...</p>
              ) : simData ? (
                <>
                  <p className="text-sm text-gray-300 mb-4">
                    <span className="font-medium text-white">Nombre:</span> {simData.name}
                  </p>
                  
                  {/* Lista de aproximaciones */}
                  <div className="space-y-4">
                    {simData.matches?.map((match, index) => (
                      <div key={index} className="border-t border-white/20 pt-3 first:border-t-0 first:pt-0">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-blue-300">
                            {match.close_approach_date}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            ({match.orbiting_body})
                          </span>
                        </div>
                        
                        {/* Distancia de paso */}
                        <div className="text-xs text-gray-300 mb-2">
                          <span className="font-medium">Distancia:</span> {(match.miss_distance_km / 1000).toLocaleString()} km
                        </div>
                        
                        {/* Velocidad relativa */}
                        <div className="text-xs text-gray-300 mb-3">
                          <span className="font-medium">Velocidad:</span> {match.rel_speed_km_s_estimate} km/s
                        </div>
                        
                        {/* Datos del impacto hipotético */}
                        {match.best_hypothetical && (
                          <div className="bg-white/10 p-2 rounded text-xs">
                            <div className="font-medium text-yellow-300 mb-1">Impacto Hipotético:</div>
                            
                            <div className="grid grid-cols-2 gap-1 text-gray-300">
                              <div>
                                <span className="font-medium">Latitud:</span> {match.best_hypothetical.impact_lat_deg?.toFixed(1)}°
                              </div>
                              <div>
                                <span className="font-medium">Longitud:</span> {match.best_hypothetical.impact_lon_deg?.toFixed(1)}°
                              </div>
                              <div>
                                <span className="font-medium">Ángulo:</span> {match.best_hypothetical.impact_angle_deg?.toFixed(1)}°
                              </div>
                              <div>
                                <span className="font-medium">Diámetro:</span> {match.best_hypothetical.diameter_meters_mean?.toFixed(1)}m
                              </div>
                            </div>
                            
                            <div className="mt-2 space-y-1">
                              <div>
                                <span className="font-medium">Masa:</span> {(match.best_hypothetical.mass_kg_estimate / 1000000).toFixed(1)} t
                              </div>
                              <div>
                                <span className="font-medium">Energía:</span> {match.best_hypothetical.kinetic_energy_megatons_tnt?.toFixed(2)} MT TNT
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-red-300">Error al cargar datos</p>
              )}
            </div>
            
            {/* Sección inferior: Botón de acción (20%) */}
            <div className="p-4 border-t border-white/20 flex items-center justify-center" style={{ height: '20%' }}>
              <button className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl w-full">
                <span className="text-xl mr-2">☄️</span>Probar impacto
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-40 right-40">
          <div className="pointer-events-auto bg-black/50 text-white p-6 rounded-lg backdrop-blur-sm border border-white/20">
            {/* Slider de tiempo */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>00:00</span>
                <span className="font-medium">Tiempo de simulación</span>
                <span>05:30</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            {/* Controles de reproducción */}
            <div className="flex items-center justify-center gap-3">
              {/* Ir más lento */}
              <button className="pointer-events-auto cursor-pointer p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="Velocidad lenta">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 6L5 12l6 6V6z"/>
                  <path d="M17 6L11 12l6 6V6z"/>
                </svg>
              </button>
              
              {/* Play */}
              <button className="pointer-events-auto cursor-pointer p-4 bg-green-600 hover:bg-green-700 rounded-full transition-colors" title="Reproducir">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              
              {/* Pausa */}
              <button className="pointer-events-auto cursor-pointer p-4 bg-yellow-600 hover:bg-yellow-700 rounded-full transition-colors" title="Pausar">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              </button>
              
              {/* Fast forward */}
              <button className="pointer-events-auto cursor-pointer p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="Velocidad rápida">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 6v12l6-6-6-6z"/>
                  <path d="M7 6v12l6-6-6-6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* <div className="absolute bottom-50 right-4">
          <button className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl">
            <span className="text-2xl mr-2">☄️</span>Probar impacto
          </button>
        </div> lo dejo para despues por ahora hace que no existe*/}
      </div>
    </div>
  );
}

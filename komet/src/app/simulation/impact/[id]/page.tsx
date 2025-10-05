'use client';

import { useEffect, useState, useRef } from 'react';
import main from './simviewer/main';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [fechaOpen, setFechaOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [endingOpen, setEndingOpen] = useState(false);
  const mainInstanceRef = useRef<any>(null);

  useEffect(() => {
    mainInstanceRef.current = main(Number(id));
    
    const fetchSimData = async () => {
      try {
        setLoading(true);
        const URL_SIMDATA = `http://localhost:4000/api/asteroidsimdata/${id}`;
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
    return () => { mainInstanceRef.current.dispose(); }
  }, [id]);

  // register onFinish from the main instance so the UI can react when sim ends
  useEffect(() => {
    const inst = mainInstanceRef.current;
    if (!inst) return;
    const handler = () => {
      setSimulationStarted(false);
      setEndingOpen(true);
      setSelectedMatch(null);
      setSelectedMatchIndex(null);
    };
    inst.onFinish = handler;
    return () => { if (inst) inst.onFinish = null; };
  }, [mainInstanceRef.current]);

  // register controller callbacks when controller becomes available
  useEffect(() => {
    const checkAndRegister = () => {
      const ctrl = mainInstanceRef.current?.controller;
      const slider = document.getElementById('sim-slider') as HTMLInputElement | null;
      if (ctrl && slider) {
        ctrl.onTimeUpdate = (t: number) => {
          slider.value = String(Math.round(t * 100));
        };
        return true;
      }
      return false;
    };

    // Try registering immediately, otherwise poll briefly until controller is ready
    if (!checkAndRegister()) {
      const iv = setInterval(() => {
        if (checkAndRegister()) clearInterval(iv);
      }, 200);
      return () => clearInterval(iv);
    }
  }, [mainInstanceRef.current]);

  const handleGoBack = () => {
    router.back();
  };

    const handleMatchSelect = (match: Match, index: number) => {
    setSelectedMatch(match);
    setSelectedMatchIndex(index);
  };

  const handleStartImpact = async () => {
    if (selectedMatchIndex === null) return;
    console.log('Requesting startImpactAnimation for match index', selectedMatchIndex);
    setFechaOpen(false);
    try {
      if (mainInstanceRef.current?.startImpactAnimation) {
        await mainInstanceRef.current.startImpactAnimation({ matchIndex: selectedMatchIndex, impactData: selectedMatch?.best_hypothetical });
        // mark simulation as started when JS finished loading the trajectory and started playback
        setSimulationStarted(true);
      } else {
        // fallback: if API not present, try to play existing controller
        const ctrl = mainInstanceRef.current?.controller;
        if (ctrl) ctrl.play();
        if (mainInstanceRef.current?.animation) mainInstanceRef.current.animation();
        setSimulationStarted(true);
      }
    } catch (err) {
      console.error('Failed to start impact animation:', err);
    }
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
            
      {fechaOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={() => setFechaOpen(false)}
        >
          <div 
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 w-[500px] max-h-[600px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">Seleccionar Fecha de Impacto</h2>
              <p className="text-gray-300 text-sm">Elige una aproximación cercana para simular el impacto:</p>
            </div>
            
            {/* Lista de fechas */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-3">
              {loading ? (
                <p className="text-gray-300 text-center py-8">Cargando fechas...</p>
              ) : simData?.matches?.length ? (
                simData.matches.map((match, index) => (
                  <div 
                    key={index}
                    onClick={() => handleMatchSelect(match, index)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedMatch === match 
                        ? 'bg-blue-600/30 border-blue-400 shadow-lg' 
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-blue-300 font-medium text-lg">
                          {match.close_approach_date}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {match.orbiting_body}
                        </div>
                      </div>
                      {selectedMatch === match && (
                        <div className="text-blue-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                      <div>
                        <span className="font-medium">Distancia:</span> {(match.miss_distance_km / 1000).toLocaleString()} km
                      </div>
                      <div>
                        <span className="font-medium">Velocidad:</span> {match.rel_speed_km_s_estimate} km/s
                      </div>
                      {match.best_hypothetical && (
                        <>
                          <div>
                            <span className="font-medium">Energía:</span> {match.best_hypothetical.kinetic_energy_megatons_tnt?.toFixed(2)} MT
                          </div>
                          <div>
                            <span className="font-medium">Diámetro:</span> {match.best_hypothetical.diameter_meters_mean?.toFixed(1)}m
                          </div>
                        </>
                      )}
                    </div>
                    
                    {match.matching && (
                      <div className="mt-2 text-xs text-yellow-300">
                        Probabilidad: {match.matching.likelihood_percent?.toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-red-300 text-center py-8">No hay fechas de aproximación disponibles</p>
              )}
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-3">
              <button 
                onClick={() => setFechaOpen(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleStartImpact}
                disabled={selectedMatchIndex === null || simulationStarted}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedMatchIndex !== null && !simulationStarted
                    ? 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 shadow-lg' 
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="text-lg mr-2">☄️</span>
                {simulationStarted ? 'Simulación en curso' : 'Iniciar Impacto'}
              </button>
            </div>
          </div>
        </div>
      )}
      {endingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={() => setEndingOpen(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 w-96 max-h-[360px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white mb-4 text-center">
              <h2 className="text-2xl font-bold mb-2">Impacto terminado</h2>
              <p className="text-gray-300 text-sm">La simulación terminó. Podés volver a la página anterior o visualizar las consecuencias del impacto.</p>
            </div>

            <div className="mt-auto flex gap-3">
              <Link href="/simulation">
                <button
                  onClick={() => {setEndingOpen(false);}}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors size-100%"
                >
                  Volver
                </button>
              </Link>

              <button
                onClick={() => {
                  try { mainInstanceRef.current?.unloadTrajectory(); } catch (e) {}
                  setEndingOpen(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Ver consecuencias
              </button>
            </div>
          </div>
        </div>
      )}
      
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
                <button className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl w-full"
                  onClick={() => {
                    // when opening selector, remove any loaded trajectory so user sees only Earth/Sun/Stars
                    try { mainInstanceRef.current?.unloadTrajectory(); } catch (e) {}
                    setFechaOpen(true);
                  }}
                >
                  <span className="text-xl mr-2">☄️</span>Probar impacto
                </button>
              </div>
          </div>
        </div>

        { simulationStarted &&
          <div className="absolute bottom-4 left-40 right-40">
          <div className="pointer-events-auto bg-black/50 text-white p-6 rounded-lg backdrop-blur-sm border border-white/20">
            {/* Slider de tiempo */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>start</span>
                <span className="font-medium">Tiempo de simulación</span>
                <span>end</span>
              </div>
              <input
                id="sim-slider"
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                onChange={(e) => {
                  const val = Number((e.target as HTMLInputElement).value)/100;
                  const ctrl = mainInstanceRef.current?.controller;
                  if (ctrl) ctrl.setTime(val);
                }}
              />
            </div>
            
            {/* Controles de reproducción */}
            <div className="flex items-center justify-center gap-3">
              {/* Ir más lento */}
              <button className="pointer-events-auto cursor-pointer p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="Velocidad lenta"
                onClick={() => {
                  const ctrl = mainInstanceRef.current?.controller;
                  if (ctrl) ctrl.setSpeed((ctrl.speed || 0.001) * 0.5);
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 6L5 12l6 6V6z"/>
                  <path d="M17 6L11 12l6 6V6z"/>
                </svg>
              </button>
              
              {/* Play */}
              <button className="pointer-events-auto cursor-pointer p-4 bg-green-600 hover:bg-green-700 rounded-full transition-colors" title="Reproducir"
                onClick={() => {
                  const ctrl = mainInstanceRef.current?.controller;
                  if (ctrl) ctrl.play();
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              
              {/* Pausa */}
              <button className="pointer-events-auto cursor-pointer p-4 bg-yellow-600 hover:bg-yellow-700 rounded-full transition-colors" title="Pausar"
                onClick={() => {
                  const ctrl = mainInstanceRef.current?.controller;
                  if (ctrl) ctrl.pause();
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              </button>
              
              {/* Fast forward */}
              <button className="pointer-events-auto cursor-pointer p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="Velocidad rápida"
                onClick={() => {
                  const ctrl = mainInstanceRef.current?.controller;
                  if (ctrl) ctrl.setSpeed((ctrl.speed || 0.001) * 2);
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 6v12l6-6-6-6z"/>
                  <path d="M7 6v12l6-6-6-6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
}
        {/* <div className="absolute bottom-50 right-4">
          <button className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl">
            <span className="text-2xl mr-2">☄️</span>Probar impacto
          </button>
        </div> lo dejo para despues por ahora hace que no existe*/}
      </div>
    </div>
  );
}

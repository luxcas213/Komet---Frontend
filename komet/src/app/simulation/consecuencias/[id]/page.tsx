"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type ConsequencesData = {
    magnitude: number;
    energy: number;
    alert_level: string;
    intensity_mmi: number;
    community_intensity_cdi: number;
    significance: number;
    depth: number;
    tsunami_warning: boolean;
    location: { latitude: number; longitude: number };
    asteroid_properties: { mass_kg: number; velocity_ms: number; kinetic_energy_joules: number };
    message: string;
};

const exampleData: ConsequencesData = {
    magnitude: 7.1,
    energy: 5625000000000.0,
    alert_level: "Red",
    intensity_mmi: 6.705,
    community_intensity_cdi: 7.6,
    significance: 1155.0,
    depth: 38.3,
    tsunami_warning: true,
    location: { latitude: 36.098094, longitude: 144.101495 },
    asteroid_properties: { mass_kg: 50, velocity_ms: 19.511152, kinetic_energy_joules: 5625000000000.0 },
    message: "Impacto sísmico predicho: Magnitud 7.1, nivel de alerta Rojo",
};

function numberFormat(n: number) {
    if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(2)}k`;
    return n.toString();
}

export default function ConsecuenciasPage() {

    const params = useParams();
    const { id } = (params || {}) as { id?: string };
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ConsequencesData | null>(null);

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        const fetchPrediction = async () => {
            setIsLoading(true);

            // Valores por defecto si no hay nada en localStorage
            let payload = {
                mass: 50000,
                velocity: 15000,
                latitude: 35.6762,
                longitude: 139.6503
            };

            try {
                // Intentar obtener datos del localStorage
                const storedData = localStorage.getItem(`simData-${id}`);
                
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    
                    // La estructura de simData tiene matches[], tomamos el primer match
                    if (parsed.matches && parsed.matches.length > 0) {
                        const firstMatch = parsed.matches[0];
                        
                        // Extraer datos del best_hypothetical
                        if (firstMatch.best_hypothetical) {
                            payload.mass = firstMatch.best_hypothetical.mass_kg_estimate || payload.mass;
                            payload.latitude = firstMatch.best_hypothetical.impact_lat_deg || payload.latitude;
                            payload.longitude = firstMatch.best_hypothetical.impact_lon_deg || payload.longitude;
                        }
                        
                        // Extraer velocidad (convertir de km/s a m/s)
                        if (firstMatch.rel_speed_km_s_estimate) {
                            payload.velocity = firstMatch.rel_speed_km_s_estimate * 1000;
                        }
                    }
                }
            } catch (e) {
                console.warn('Error al leer localStorage, usando valores por defecto', e);
            }

            try {
                const response = await fetch("https://komet-ml.onrender.com/predict/predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error("Network response was not ok");
                
                const result = await response.json();

                if (result && result.success) {
                    const mapped: ConsequencesData = {
                        magnitude: result.magnitude,
                        energy: result.energy,
                        alert_level: result.alert_level,
                        intensity_mmi: result.intensity_mmi,
                        community_intensity_cdi: result.community_intensity_cdi,
                        significance: result.significance,
                        depth: result.depth,
                        tsunami_warning: result.tsunami_warning,
                        location: result.location,
                        asteroid_properties: result.asteroid_properties,
                        message: result.message,
                    };
                    setData(mapped);
                    
                    // Guardar en localStorage para uso posterior
                    if (id) {
                        localStorage.setItem(`simData-${id}`, JSON.stringify(mapped));
                    }
                } else {
                    console.warn('La API no devolvió success, usando datos de ejemplo');
                    setData(exampleData);
                }
            } catch (error) {
                console.error('Error al hacer fetch a la API, usando datos de ejemplo', error);
                setData(exampleData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrediction();
    }, [id]);

    if (isLoading) {
        return (
            <main className="max-w-5xl mx-auto p-6 text-foreground min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400 mb-4"></div>
                    <p className="text-lg text-foreground/70">Cargando consecuencias del impacto...</p>
                </div>
            </main>
        );
    }

    if (!data) {
        return (
            <main className="max-w-5xl mx-auto p-6 text-foreground min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-foreground/70">No hay datos disponibles</p>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-5xl mx-auto p-6 text-foreground" style={{ animation: 'fadeIn 0.6s ease-out' }}>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            
            {/* Botón Volver */}
            <div className="mb-4">
                <button
                    onClick={handleGoBack}
                    className="cursor-pointer bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-lg group"
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

            <header className="mb-6">
                <h1 className="text-3xl font-bold">Consecuencias</h1>
                <p className="text-sm text-foreground/70">Detalles predictivos del impacto y propiedades del asteroide</p>
                {id && <p className="mt-2 text-xs text-foreground/60">ID del escenario: <strong>{id}</strong></p>}

                {/* Banner prominente con el mensaje - lo primero que se ve */}
                <div className={`mt-4 w-full rounded-lg border p-4 text-sm ${data.alert_level === 'Yellow' ? 'bg-amber-900/20 border-amber-700/30 text-amber-300' : data.alert_level === 'Red' ? 'bg-red-900/25 border-red-700/30 text-red-300' : 'bg-emerald-900/15 border-emerald-600/20 text-emerald-300'}`}>
                    <strong className="mr-2">Alerta: {data.alert_level}</strong>
                    <span>{data.message}</span>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className="p-4 bg-white/5 rounded-lg shadow border border-white/6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
                    <h3 className="text-sm text-foreground/60">Magnitud</h3>
                    <p className="text-2xl font-semibold text-foreground">{data.magnitude.toFixed(2)}</p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg shadow border border-white/6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
                    <h3 className="text-sm text-foreground/60">Nivel de alerta</h3>
                    <p className={`text-2xl font-semibold ${data.alert_level === 'Yellow' ? 'text-amber-400' : data.alert_level === 'Red' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {data.alert_level}
                    </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg shadow border border-white/6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
                    <h3 className="text-sm text-foreground/60">Alerta de tsunami</h3>
                    <p className={`text-2xl font-semibold ${data.tsunami_warning ? 'text-red-400' : 'text-foreground/70'}`}>{data.tsunami_warning ? 'Sí' : 'No'}</p>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-5 bg-gradient-to-br from-slate-900/10 to-white/2 rounded-lg shadow border border-white/6 transition-all duration-300 hover:from-slate-900/20 hover:to-white/5 hover:border-white/20 hover:shadow-xl">
                    <h2 className="text-lg font-semibold mb-3">Detalles sísmicos y de impacto</h2>
                    <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Intensidad (MMI)</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-amber-400 hover:scale-105">{data.intensity_mmi}</dd>

                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Intensidad comunitaria (CDI)</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-amber-400 hover:scale-105">{data.community_intensity_cdi}</dd>

                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Significancia</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-amber-400 hover:scale-105">{data.significance}</dd>

                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Profundidad (km)</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-amber-400 hover:scale-105">{data.depth}</dd>

                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Energía</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-amber-400 hover:scale-105">{numberFormat(data.energy)} J</dd>
                    </dl>
                </div>

                <div className="p-5 bg-gradient-to-br from-slate-900/10 to-white/2 rounded-lg shadow border border-white/6 transition-all duration-300 hover:from-slate-900/20 hover:to-white/5 hover:border-white/20 hover:shadow-xl">
                    <h2 className="text-lg font-semibold mb-3">Propiedades del asteroide</h2>
                    <dl className="text-sm grid grid-cols-2 gap-y-2 gap-x-4">
                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Masa</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-sky-400 hover:scale-105">{numberFormat(data.asteroid_properties.mass_kg)} t</dd>

                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Velocidad</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-sky-400 hover:scale-105">{numberFormat(data.asteroid_properties.velocity_ms)} km/s</dd>

                        <dt className="text-foreground/60 transition-colors duration-200 hover:text-foreground">Energía cinética</dt>
                        <dd className="font-medium transition-all duration-200 hover:text-sky-400 hover:scale-105">{numberFormat(data.asteroid_properties.kinetic_energy_joules)} J</dd>
                    </dl>

                    <div className="mt-4 text-sm p-3 rounded-lg transition-all duration-200 hover:bg-white/5">
                        <h3 className="text-foreground/60">Ubicación</h3>
                        <p className="font-medium transition-colors duration-200 hover:text-sky-400">Lat: {data.location.latitude}, Lon: {data.location.longitude}</p>
                        <a
                            className="text-xs text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-200"
                            href={`https://www.google.com/maps/search/?api=1&query=${data.location.latitude},${data.location.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Abrir en Google Maps
                        </a>
                    </div>
                </div>
            </section>
            
        </main>
    );
}
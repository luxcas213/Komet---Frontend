'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef, Suspense, useState } from 'react'
import * as THREE from 'three'
import { AsteroidInfo } from '@/types/asteroid'

// Constantes astronómicas
const AU = 1 // Unidad Astronómica (escalada para visualización)
const EARTH_RADIUS = 0.05 // Radio de la Tierra escalado
const SUN_RADIUS = 0.3 // Radio del Sol escalado
const TIME_SCALE = 50 // Aceleración de la simulación (días por segundo)

// Parámetros orbitales de la Tierra
const EARTH_ORBITAL_PARAMS = {
  semi_major_axis: 1.0, // 1 AU
  eccentricity: 0.0167,
  inclination: 0, // grados
  ascending_node_longitude: 0,
  perihelion_argument: 0,
  orbital_period: 365 // días
}

interface SolarSystemProps {
  asteroidData?: AsteroidInfo | null;
}

// Utilidades para mecánica orbital Kepleriana
function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180
}

// Resuelve la ecuación de Kepler para obtener la anomalía excéntrica
function solveKeplerEquation(meanAnomaly: number, eccentricity: number, tolerance: number = 1e-6): number {
  let E = meanAnomaly // Primera aproximación
  let deltaE = 1
  
  while (Math.abs(deltaE) > tolerance) {
    const f = E - eccentricity * Math.sin(E) - meanAnomaly
    const df = 1 - eccentricity * Math.cos(E)
    deltaE = f / df
    E -= deltaE
  }
  
  return E
}

// Calcula la anomalía verdadera desde la anomalía excéntrica
function getTrueAnomaly(E: number, eccentricity: number): number {
  return 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
  )
}

// Calcula la posición 3D desde los elementos orbitales
function getOrbitalPosition(
  orbitalParams: any,
  meanAnomalyAtTime: number,
  scale: number = AU
): THREE.Vector3 {
  const { semi_major_axis, eccentricity, inclination, ascending_node_longitude, perihelion_argument } = orbitalParams
  
  // Convertir ángulos a radianes
  const i = degreesToRadians(inclination)
  const Omega = degreesToRadians(ascending_node_longitude)
  const omega = degreesToRadians(perihelion_argument)
  
  // Resolver ecuación de Kepler
  const E = solveKeplerEquation(meanAnomalyAtTime, eccentricity)
  const nu = getTrueAnomaly(E, eccentricity)
  
  // Calcular radio
  const r = semi_major_axis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(nu))
  
  // Posición en el plano orbital
  const x_orbital = r * Math.cos(nu)
  const y_orbital = r * Math.sin(nu)
  
  // Aplicar rotaciones para orientar la órbita
  const cosOmega = Math.cos(Omega)
  const sinOmega = Math.sin(Omega)
  const cosomega = Math.cos(omega)
  const sinomega = Math.sin(omega)
  const cosi = Math.cos(i)
  const sini = Math.sin(i)
  
  // Matriz de rotación
  const x = (cosOmega * cosomega - sinOmega * sinomega * cosi) * x_orbital + 
            (-cosOmega * sinomega - sinOmega * cosomega * cosi) * y_orbital
  const y = (sinOmega * cosomega + cosOmega * sinomega * cosi) * x_orbital + 
            (-sinOmega * sinomega + cosOmega * cosomega * cosi) * y_orbital
  const z = (sinomega * sini) * x_orbital + (cosomega * sini) * y_orbital
  
  return new THREE.Vector3(x * scale, z * scale, y * scale)
}

// Genera puntos para dibujar la órbita completa
function generateOrbitPoints(orbitalParams: any, segments: number = 128, scale: number = AU): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  
  for (let i = 0; i <= segments; i++) {
    const meanAnomaly = (i / segments) * 2 * Math.PI
    const position = getOrbitalPosition(orbitalParams, meanAnomaly, scale)
    points.push(position)
  }
  
  return points
}

// Calcula la velocidad orbital en una posición específica (km/s)
function getOrbitalVelocity(orbitalParams: any, trueAnomaly: number): number {
  const { semi_major_axis, eccentricity } = orbitalParams
  const GM_sun = 1.327e11 // km³/s² (Constante gravitacional del Sol)
  
  // Radio actual
  const r = semi_major_axis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(trueAnomaly))
  
  // Velocidad orbital usando la ecuación vis-viva
  const velocity = Math.sqrt(GM_sun * (2/r - 1/semi_major_axis)) * 6.68e-9 // Convertir a AU/día
  
  return velocity
}

// Componente para mostrar la órbita de la Tierra
function EarthOrbit() {
  const points = generateOrbitPoints(EARTH_ORBITAL_PARAMS, 64, AU)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color: 0x00BFFF, // Celeste brillante (DeepSkyBlue)
      opacity: 0.6, 
      transparent: true 
    }))} />
  )
}

// Componente para mostrar la órbita del meteorito
function MeteoriteOrbit({ asteroidData }: { asteroidData?: AsteroidInfo | null }) {
  if (!asteroidData) return null;
  
  const points = generateOrbitPoints(asteroidData.orbital_params, 128, AU)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color: 0xFF6B35, // Naranja brillante
      opacity: 0.8, 
      transparent: true 
    }))} />
  )
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (earthRef.current) {
      const elapsedTime = clock.getElapsedTime() * TIME_SCALE // días simulados
      const meanMotion = 2 * Math.PI / EARTH_ORBITAL_PARAMS.orbital_period // radianes por día
      const meanAnomaly = meanMotion * elapsedTime
      
      const position = getOrbitalPosition(EARTH_ORBITAL_PARAMS, meanAnomaly, AU)
      earthRef.current.position.copy(position)
      earthRef.current.rotation.y += 0.02 // Rotación de la Tierra sobre su eje
    }
  })
  
  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

function Meteorite({ asteroidData }: { asteroidData?: AsteroidInfo | null }) {
  const meteoriteRef = useRef<THREE.Mesh>(null)
  const [currentVelocity, setCurrentVelocity] = useState<number>(0)
  
  useFrame(({ clock }) => {
    if (meteoriteRef.current && asteroidData) {
      const elapsedTime = clock.getElapsedTime() * TIME_SCALE // días simulados
      
      // Usar el periodo orbital de la API o calcular usando la tercera ley de Kepler
      const orbitalPeriod = asteroidData.orbital_params.orbital_period || 
                           Math.sqrt(Math.pow(asteroidData.orbital_params.semi_major_axis, 3)) * 365
      
      // Calcular velocidad angular variable basada en la posición orbital (2da Ley de Kepler)
      const initialMeanAnomaly = degreesToRadians(asteroidData.orbital_params.mean_anomaly)
      const currentMeanAnomaly = initialMeanAnomaly + (2 * Math.PI / orbitalPeriod) * elapsedTime
      
      // Resolver para anomalía excéntrica y verdadera para obtener velocidad real
      const E = solveKeplerEquation(currentMeanAnomaly, asteroidData.orbital_params.eccentricity)
      const trueAnomaly = getTrueAnomaly(E, asteroidData.orbital_params.eccentricity)
      
      // Calcular posición y velocidad actual
      const position = getOrbitalPosition(asteroidData.orbital_params, currentMeanAnomaly, AU)
      const orbitalVel = getOrbitalVelocity(asteroidData.orbital_params, trueAnomaly)
      
      // Actualizar velocidad actual para display (convertir a km/s)
      setCurrentVelocity(orbitalVel * 1.731e6) // Conversión de AU/día a km/s
      
      meteoriteRef.current.position.copy(position)
      
      // Rotación basada en el tamaño del asteroide y velocidad orbital
      const sizeBasedRotation = Math.max(0.01, 0.1 / Math.sqrt(asteroidData.diameter_avg / 100))
      const velocityBasedRotation = orbitalVel * 0.001 // Factor de escala para rotación
      const totalRotationSpeed = sizeBasedRotation + velocityBasedRotation
      
      meteoriteRef.current.rotation.x += totalRotationSpeed
      meteoriteRef.current.rotation.y += totalRotationSpeed * 0.7
    }
  })
  
  if (!asteroidData) return null;
  
  // Calcular radio del asteroide basado en su diámetro promedio real
  // Usar escala logarítmica para mejor visualización
  const realDiameter = asteroidData.diameter_avg; // metros
  const logScale = Math.log10(realDiameter + 1) / Math.log10(1000); // Normalizar a escala log
  const asteroidRadius = Math.max(0.005, Math.min(0.08, logScale * 0.02)) // Escalado mejorado
  
  return (
    <group>
      <mesh ref={meteoriteRef}>
        <sphereGeometry args={[asteroidRadius, 16, 16]} />
        <meshStandardMaterial 
          color={asteroidData.is_hazardous ? "#FF4444" : "#8B4513"}
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005 // Rotación lenta del Sol
    }
  })
  
  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[SUN_RADIUS, 32, 32]} />
        <meshStandardMaterial 
          emissive="#FFA500" 
          emissiveIntensity={1.5} 
          color="#FFD700" 
        />
      </mesh>
      {/* Resplandor del Sol */}
      <mesh>
        <sphereGeometry args={[SUN_RADIUS * 1.2, 32, 32]} />
        <meshBasicMaterial 
          color="#FFA500" 
          opacity={0.08} 
          transparent 
        />
      </mesh>
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full text-white">
      <div className="text-center">
        <div className="animate-pulse text-blue-400 text-2xl mb-2">🌌</div>
        <p>Cargando objetos 3D...</p>
      </div>
    </div>
  )
}

export default function SolarSystem({ asteroidData }: SolarSystemProps) {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [3, 2, 3], fov: 75 }}
        style={{ background: 'black' }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Control de cámara con el mouse */}
          <OrbitControls 
            enableDamping 
            enableZoom 
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={8}
            target={[0, 0, 0]}
          />
          
          {/* Fondo estrellado */}
          <Stars radius={50} depth={25} count={3000} factor={2} />
          
          {/* Luces */}
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={1.5} />
          
          {/* Objetos del sistema solar */}
          <Sun />
          <EarthOrbit />
          <Earth />
          <MeteoriteOrbit asteroidData={asteroidData} />
          <Meteorite asteroidData={asteroidData} />
        </Suspense>
      </Canvas>
    </div>
  )
}

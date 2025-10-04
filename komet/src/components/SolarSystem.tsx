'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

function Earth() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * 5
      ref.current.position.z = Math.sin(t) * 5
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  )
}

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial emissive="yellow" emissiveIntensity={1.5} color="orange" />
    </mesh>
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

export default function SolarSystem() {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [10, 5, 10], fov: 60 }}
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
            minDistance={3}
            maxDistance={50}
          />
          
          {/* Fondo estrellado */}
          <Stars radius={100} depth={50} count={5000} factor={4} />
          
          {/* Luces */}
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2} />
          
          {/* Objetos del sistema solar */}
          <Sun />
          <Earth />
        </Suspense>
      </Canvas>
    </div>
  )
}

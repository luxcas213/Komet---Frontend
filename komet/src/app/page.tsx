"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative w-full bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo y nombre */}
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Komet Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-white">Komet</h1>
            </div>

            {/* Navegación */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#inicio"
                className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105 transform"
              >
                Inicio
              </a>
              <a
                href="#sobre"
                className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105 transform"
              >
                Sobre Komet
              </a>
              <a
                href="#objetivos"
                className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105 transform"
              >
                Objetivos
              </a>
              <a
                href="#caracteristicas"
                className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105 transform"
              >
                Características
              </a>
              <Link
                href="/simulation"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Probar
              </Link>
            </nav>

            {/* Menú móvil (hamburguesa) */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {/* Fondo animado */}
      <div className="fixed top-0 left-0 w-full h-full bg-black z-0">
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage: 'url(http://solarscroller.rhettforbes.com/img/stars.jpg)',
            backgroundRepeat: 'repeat',
            animation: 'sky 82s linear infinite',
          }}
        />
      </div>

      {/* Logo centrado */}
      <div id="inicio" className="relative z-10 flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-6xl md:text-9xl font-bold text-white mb-4">
          Komet
        </h1>
        <h6 className="text-lg md:text-2xl text-gray-300">
          Observa, Simula, Impacta
        </h6>
      </div>

      {/* Sección Sobre el Proyecto */}
      <div id="sobre" className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">
            Sobre Komet
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-400">
                Simulación Interactiva de Meteoritos
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Komet es un proyecto innovador que permite explorar y simular el comportamiento de meteoritos en un entorno 3D interactivo.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Los usuarios pueden seleccionar meteoritos basados en datos reales y simular su trayectoria e impacto hacia la Tierra. Komet destaca por combinar precisión científica con visualización en tiempo real, ofreciendo una simulación interactiva y educativa que permite explorar diferentes escenarios de manera dinámica.
              </p>
            </div>
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-700/30">
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 border border-gray-600/20">
                <Image
                  src="/meteorito_landing.png"
                  alt="Simulación Interactiva de Meteoritos"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Meteorito Hoba, el meteorito más grande conocido, en Namibia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Objetivos */}
      <div id="objetivos" className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-16">
            Nuestros Objetivos
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda - Objetivos principales */}
            <div className="space-y-8">
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-400 text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">
                      [OBJETIVO PRINCIPAL]
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      [Describe el objetivo principal de Komet - qué quieres lograr con esta plataforma]
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">
                      [OBJETIVO EDUCATIVO]
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      [Explica cómo Komet ayudará a educar o informar a los usuarios sobre el espacio]
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Lo que queremos mostrar */}
            <div className="space-y-8">
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 text-xl">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-3">
                      [QUÉ QUEREMOS MOSTRAR]
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      [Describe qué contenido específico quieres mostrar - planetas, estrellas, datos, etc.]
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-400 text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-orange-400 mb-3">
                      [EXPERIENCIA INTERACTIVA]
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      [Explica cómo será la experiencia del usuario - navegación, interacciones, funcionalidades]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje central */}
          <div className="text-center mt-16">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
              <h3 className="text-2xl font-semibold text-white mb-4">
                [VISIÓN DEL PROYECTO]
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                [Escribe aquí tu visión general del proyecto Komet - qué impacto quieres tener y por qué es importante]
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Características */}
      <div id="caracteristicas" className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-16">
            Características
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Característica 1 */}
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/30">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-400 text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                [CARACTERÍSTICA 1]
              </h3>
              <p className="text-gray-300">
                [Descripción de la primera característica principal de Komet]
              </p>
            </div>

            {/* Característica 2 */}
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/30">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-purple-400 text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                [CARACTERÍSTICA 2]
              </h3>
              <p className="text-gray-300">
                [Descripción de la segunda característica principal de Komet]
              </p>
            </div>

            {/* Característica 3 */}
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/30">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-400 text-2xl">🌌</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                [CARACTERÍSTICA 3]
              </h3>
              <p className="text-gray-300">
                [Descripción de la tercera característica principal de Komet]
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Call to Action */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para explorar?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            [MENSAJE MOTIVACIONAL PARA QUE PRUEBEN KOMET]
          </p>
          
          {/* Botón PROBAR */}
          <Link href="/simulation">
            <button className="group relative px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-full hover:from-blue-500 hover:via-purple-500 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105">
              <span className="relative z-10">PROBAR KOMET</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 opacity-30"></div>
            </button>
          </Link>
          
          <p className="text-sm text-gray-500 mt-6">
            Haz clic para comenzar tu viaje por el espacio
          </p>
        </div>
      </div>

      {/* Animación CSS */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes sky {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 600px 0;
          }
          100% {
            background-position: 1200px 0;
          }
        }
      `}</style>
    </div>
  );
}

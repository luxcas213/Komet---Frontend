export default function SimulationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8">Simulación Interactiva del Sistema Solar</h1>
      <p className="text-lg mb-4">Explora los planetas y sus órbitas en una experiencia inmersiva.</p>
      <div className="w-full max-w-4xl h-96 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
        {/* Aquí iría la simulación interactiva, por ahora es un placeholder */}
        <span className="text-gray-400">[Simulación Interactiva Aquí]</span>
      </div>
    </div>
  );
}
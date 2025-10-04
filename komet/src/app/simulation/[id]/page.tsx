import SimulationClient from './SimulationClient'

export default async function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <SimulationClient id={id} />;
}
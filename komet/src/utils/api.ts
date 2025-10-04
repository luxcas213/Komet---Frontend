import { AsteroidData, AsteroidInfo } from '@/types/asteroid';

const API_BASE_URL = 'https://komet-backend-phi.vercel.app/api';

export async function fetchAsteroidData(id: string): Promise<AsteroidInfo> {
  try {
    const response = await fetch(`${API_BASE_URL}/asteroids/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AsteroidData = await response.json();
    
    // Transform API data to our format
    const orbitalData = data.orbital_data;
    
    // Calculate average diameter
    const diameterMin = data.estimated_diameter_meters.estimated_diameter_min;
    const diameterMax = data.estimated_diameter_meters.estimated_diameter_max;
    const diameterAvg = (diameterMin + diameterMax) / 2;
    
    // Get velocity from most recent close approach (if available)
    let closeApproachVelocity: number | undefined;
    if (data.close_approach_data && data.close_approach_data.length > 0) {
      // Sort by date to get most recent, or just use the first one
      const mostRecent = data.close_approach_data[0];
      closeApproachVelocity = parseFloat(mostRecent.relative_velocity_kph);
    }

    const asteroidInfo: AsteroidInfo = {
      id: data.id,
      name: data.name,
      diameter_min: diameterMin,
      diameter_max: diameterMax,
      diameter_avg: diameterAvg,
      is_hazardous: data.is_potentially_hazardous_asteroid,
      close_approach_velocity: closeApproachVelocity,
      orbital_params: {
        semi_major_axis: parseFloat(orbitalData.semi_major_axis),
        eccentricity: parseFloat(orbitalData.eccentricity),
        inclination: parseFloat(orbitalData.inclination),
        ascending_node_longitude: parseFloat(orbitalData.ascending_node_longitude),
        perihelion_argument: parseFloat(orbitalData.perihelion_argument),
        mean_anomaly: parseFloat(orbitalData.mean_anomaly),
        orbital_period: parseFloat(orbitalData.orbital_period)
      }
    };
    
    return asteroidInfo;
  } catch (error) {
    console.error('Error fetching asteroid data:', error);
    throw new Error('Failed to fetch asteroid data. Please try again.');
  }
}
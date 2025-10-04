// Types for the Komet Backend API
export interface AsteroidOrbitalData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
  equinox: string;
  orbit_class: {
    orbit_class_type: string;
    orbit_class_description: string;
    orbit_class_range: string;
  };
}

export interface CloseApproachData {
  close_approach_date: string;
  relative_velocity_kph: string;
  miss_distance_km: string;
  orbiting_body: string;
  relative_velocity_kps: string;
}

export interface EstimatedDiameter {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface AsteroidData {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter_meters: EstimatedDiameter;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: AsteroidOrbitalData;
}

export interface OrbitalParams {
  semi_major_axis: number;
  eccentricity: number;
  inclination: number;
  ascending_node_longitude: number;
  perihelion_argument: number;
  mean_anomaly: number;
  orbital_period: number;
}

export interface AsteroidInfo {
  id: string;
  name: string;
  diameter_min: number;
  diameter_max: number;
  diameter_avg: number;
  is_hazardous: boolean;
  orbital_params: OrbitalParams;
  close_approach_velocity?: number; // km/h from most recent close approach
}
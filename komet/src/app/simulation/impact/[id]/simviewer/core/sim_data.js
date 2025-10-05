import { getData } from '../api/asteroid_data.js';

export function getSimData(id) {
    if (id === -1) {
        console.warn('Invalid ID provided for simulation data.');
        return null;
    }
    const data = getData(id).then(data => {
        if (!data) {
            console.error('No data returned from getData.');
            return null;
        }
        const pos = data.matches[0].best_hypothetical.start_position_km;
        const vel = data.matches[0].best_hypothetical.start_velocity_km_s;
        const mass = data.matches[0].best_hypothetical.mass_kg_estimate;
        return { pos, vel, mass };
        // return data;
    });
    return data;
}
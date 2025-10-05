import { getData } from '../api/asteroid_data.js';

// Return the full simulation metadata for an asteroid id
export async function getSimData(id) {
    if (id === -1) {
        console.warn('Invalid ID provided for simulation data.');
        return null;
    }
    const data = await getData(id);
    if (!data) {
        console.error('No data returned from getData.');
        return null;
    }
    return data;
}

// Return only the trajectory input (pos, vel, mass) for a specific match index
export async function getTrajectoryData(id, matchIndex) {
    if (id === -1) {
        console.warn('Invalid ID provided for trajectory data.');
        return null;
    }
    const data = await getData(id);
    if (!data) {
        console.error('No data returned from getData.');
        return null;
    }
    if (typeof matchIndex !== 'number' || matchIndex < 0 || matchIndex >= (data.matches || []).length) {
        console.error('Invalid matchIndex for trajectory data:', matchIndex);
        return null;
    }
    const match = data.matches[matchIndex];
    if (!match || !match.best_hypothetical) {
        console.error('No best_hypothetical for match', matchIndex);
        return null;
    }
    const pos = match.best_hypothetical.start_position_km;
    const vel = match.best_hypothetical.start_velocity_km_s;
    const mass = match.best_hypothetical.mass_kg_estimate;
    return { pos, vel, mass };
}
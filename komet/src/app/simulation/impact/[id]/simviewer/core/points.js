import * as THREE from 'three';
import { runSimulation, getSimulationData } from '../api/simulation.js';


export async function calculatePointList(asteroid) {

    const { id } = await runSimulation(asteroid);
    const data = await getSimulationData(id);
    const points = [];
    
    for (let i of data) {
        const { x, y, z, vx, vy, vz} = i;
        const point = new THREE.Vector3(x, y, z);
        const velocity = new THREE.Vector3(vx, vy, vz);
        point.velocity = velocity;
        // dt will be computed relative to the previous point using the previous point's velocity
        // if no previous point exists, dt = 0
        if (points.length === 0) {
            point.dt = 0;
        } else {
            const prev = points[points.length - 1];
            const disp = new THREE.Vector3().subVectors(point, prev);
            const vprev = prev.velocity || new THREE.Vector3();
            const vprevLenSq = vprev.lengthSq();
            // If previous velocity is non-zero, project displacement onto previous velocity to estimate dt
            if (vprevLenSq > 1e-12) {
                // dt = (disp . vprev) / |vprev|^2
                const dt = disp.dot(vprev) / vprevLenSq;
                // If dt is negative or NaN, clamp to zero as fallback
                point.dt = (isFinite(dt) && dt > 0) ? dt : 0;
            } else {
                point.dt = 0;
            }
        }

        points.push(point);
    }
    return points;
}
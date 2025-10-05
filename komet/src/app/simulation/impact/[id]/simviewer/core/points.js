import * as THREE from 'three';
import { runSimulation, getSimulationData } from '../api/simulation.js';


export async function calculatePointList(asteroid) {

    const { id } = await runSimulation(asteroid);
    const data = await getSimulationData(id);
    const points = [];

    for (let i of data) {
        const { x, y, z} = i;
        const point = new THREE.Vector3(x, y, z);
        points.push(point);
    }
    return points;
}
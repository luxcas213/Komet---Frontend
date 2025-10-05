import * as THREE from 'three';
import { runSimulation, getSimulationData } from '../api/simulation.js';

const toVector3Array = (arr) => {
    if (arr && arr[0] && arr[0].isVector3) return arr;
    return arr.map(p => Array.isArray(p)
        ? new THREE.Vector3(p[0], p[1], p[2])
        : new THREE.Vector3(p.x, p.y, p.z)
    );
};


export async function calculatePointList(dx, dy, dz, vx, vy, vz, mass) {
    
    const { id } = await runSimulation(dx, dy, dz, vx, vy, vz, mass); // TODO: class asteroid with properties as input
    const data = await getSimulationData(id);
    const points = [];

    for (let i of data) {
        const { x, y, z} = i;
        const point = new THREE.Vector3(x, y, z);
        points.push(point);
    }
    return points;
}
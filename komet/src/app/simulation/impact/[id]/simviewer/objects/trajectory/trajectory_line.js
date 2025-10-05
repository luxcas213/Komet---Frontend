import * as THREE from 'three';

export function createTrajectoryLine(scene, points) {
    
    if (!points || points.length === 0) {
        console.warn('No points provided for trajectory line.');
        return;
    }
    
    const trajectory_geometry = new THREE.BufferGeometry().setFromPoints(points);
    const trajectory_material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const trajectory_line = new THREE.Line(trajectory_geometry, trajectory_material);
    scene.add(trajectory_line);  


    return trajectory_line;
}
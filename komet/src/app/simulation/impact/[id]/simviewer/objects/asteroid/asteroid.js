import * as THREE from 'three';

export function createAsteroid(scene, points){
    const asteroidGeo = new THREE.SphereGeometry(5, 32, 32);
    const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
    asteroid.position.copy(points[0]); 
    asteroid.name = 'asteroid';
    
    scene.add(asteroid);

    return asteroid;
}
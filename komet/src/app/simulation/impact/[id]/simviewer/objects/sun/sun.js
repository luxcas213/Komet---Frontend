import * as THREE from 'three';

export function createSun(scene){
    const sunGeo = new THREE.SphereGeometry(100, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff2a0 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(-15000, 0, 0);
    sun.name = 'sun';
    scene.add(sun);

    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.copy(sun.position);
    dir.target.position.set(0, 0, 0);
    scene.add(dir);

    return {sun, dir};
}
import * as THREE from 'three';

export function createStars(scene, camera) {
    const starCount = 10000;
    const radius = 50000;     // target distance from origin
    const thickness = 2000;   // +/- 1000 around radius for variation

    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Uniform direction on a sphere
        const u = Math.random();
        const v = Math.random();
        const phi = 2 * Math.PI * u;
        const cosTheta = 2 * v - 1;
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

        const dirX = Math.cos(phi) * sinTheta;
        const dirY = Math.sin(phi) * sinTheta;
        const dirZ = cosTheta;

        // Radius with slight jitter
        const r = radius + (Math.random() - 0.5) * thickness;

        positions[i * 3 + 0] = dirX * r;
        positions[i * 3 + 1] = dirY * r;
        positions[i * 3 + 2] = dirZ * r;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius + thickness);

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: true,
        depthWrite: false
    });

    const stars = new THREE.Points(geometry, material);
    stars.name = 'stars';
    scene.add(stars);
    return stars;
}
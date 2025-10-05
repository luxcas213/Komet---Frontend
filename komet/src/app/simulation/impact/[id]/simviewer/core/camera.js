import * as THREE from 'three';

export function createCamera() {
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000000);
        return camera;
}
import * as THREE from 'three';

export function createRenderer(canvas) {
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        return renderer;
}
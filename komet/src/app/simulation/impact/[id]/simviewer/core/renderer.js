import * as THREE from "three";

export function createRenderer(canvas) {
        if (!canvas) {
                throw new Error("❌ No canvas provided to createRenderer");
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        // devolver también cleanup
        const dispose = () => {
                console.log("♻️ Disposing WebGLRenderer");
                renderer.dispose();
        };

        return { renderer, dispose };
}
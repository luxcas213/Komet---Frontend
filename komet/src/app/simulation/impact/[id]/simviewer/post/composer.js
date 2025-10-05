import * as THREE from 'three';
import {createRenderer} from '../core/renderer.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function createComposer(canvas, scene, camera) {
    const renderer = createRenderer(canvas);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.2,   // strength
        0.6,   // radius
        0.2    // threshold
    );
    composer.addPass(bloomPass);
    return {composer, bloomPass, renderer};
}
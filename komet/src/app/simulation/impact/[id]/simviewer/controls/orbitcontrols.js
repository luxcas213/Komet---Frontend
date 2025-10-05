import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

export function createOrbitControls(camera, domElement, sphere) {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    
    return controls;
}

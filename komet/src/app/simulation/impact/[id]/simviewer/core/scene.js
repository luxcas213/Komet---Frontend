import * as THREE from 'three';

export function createScene(){
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    return scene;    
}
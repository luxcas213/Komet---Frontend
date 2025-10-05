import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { createEarthTexture } from './texture';

export function createEarth(renderer, scene, camera, controls) {
    const earthMap = createEarthTexture(renderer);
        // Load OBJ
        const loader = new OBJLoader();
        loader.load(
            '/earth_and_clouds.obj',
            (obj) => {
                const material = new THREE.MeshStandardMaterial({
                    map: earthMap,
                    roughness: 1.0,
                    metalness: 0.0
                });
                    
                obj.position.set(0, 0, 0);
                obj.scale.set(.01254, .01254, .01254);
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }   
                });
                obj.name = 'earth';
                scene.add(obj);
    
                // Fit camera to object (account for aspect)
                const box = new THREE.Box3().setFromObject(obj);
                const sphere = new THREE.Sphere();
                box.getBoundingSphere(sphere);
                console.log(box);
    
                // Atmosphere shell (slightly larger, transparent glow)
                const atmScale = .5; // bigger than Earth (and clouds) radius
                const atmosphereGeo = new THREE.SphereGeometry(sphere.radius * atmScale, 64, 64);
                const atmosphereMat = new THREE.MeshPhongMaterial({
                    color: 0x4ea3ff,
                    transparent: true,
                    opacity: 0.25,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
                atmosphere.position.copy(sphere.center);
                atmosphere.name = 'atmosphere';
    
                // Save data for dynamic opacity
                atmosphere.userData.center = sphere.center.clone();
                atmosphere.userData.radius = sphere.radius * atmScale;
                atmosphere.userData.minOpacity = 0.08; // far away
                atmosphere.userData.maxOpacity = 0.35; // close up
                atmosphere.userData.falloff = sphere.radius * 1.5; // distance range for fade
    
                obj.add(atmosphere); // attach to obj so it follows transforms

                
                const vFOV = THREE.MathUtils.degToRad(camera.fov);
                const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect);
                const distV = sphere.radius / Math.tan(vFOV / 2);
                const distH = sphere.radius / Math.tan(hFOV / 2);
                const distance = Math.max(distV, distH) * 1.2;
            
                camera.position.copy(sphere.center).add(new THREE.Vector3(0, 0, distance*10));
                camera.near = Math.max(0.1, distance);
                camera.updateProjectionMatrix();
            
                controls.target.copy(sphere.center);
                controls.minDistance = camera.near * 1.3;

                controls.update();
            },
            undefined,
            (err) => console.error(err)
        );
        return null; 
}
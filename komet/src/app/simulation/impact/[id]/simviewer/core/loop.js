import * as THREE from 'three';

export function AnimationLoop(renderer, controls, scene, camera, composer){
    renderer.setAnimationLoop(() => {
        controls.update();

        const atm = scene.getObjectByName('atmosphere');
        if (atm) {
            const d = camera.position.distanceTo(atm.userData.center) - atm.userData.radius; // distance from shell surface
            const t = THREE.MathUtils.clamp(1 - d / atm.userData.falloff, 0, 1);
            atm.material.opacity = THREE.MathUtils.lerp(atm.userData.minOpacity, atm.userData.maxOpacity, t);
        }

        composer.render();
    });
}
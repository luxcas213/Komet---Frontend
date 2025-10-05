import * as THREE from 'three';

export function AnimationLoop(renderer, controls, scene, camera, composer, controller, asteroid, points) {
    renderer.setAnimationLoop(() => {
        controls.update();

        if (controller && points && points.length > 0) {
            if (controller.playing) {
                controller.time += controller.speed || 0;
                controller.time = THREE.MathUtils.clamp(controller.time, 0, 1);
            }

            const idx = Math.floor(controller.time * (points.length - 1));
            const p = points[idx];
            if (p) {
                asteroid.position.set(p.x, p.y, p.z);
                if (idx < points.length - 1) {
                    const p2 = points[idx + 1];
                    const dir = new THREE.Vector3().subVectors(p2, p).normalize();
                    asteroid.lookAt(asteroid.position.clone().add(dir));
                }
            }

            if (typeof controller.onTimeUpdate === 'function') controller.onTimeUpdate(controller.time);
            // if we've reached the end, pause and notify
            if (controller.time >= 1) {
                controller.playing = false;
                if (typeof controller.onFinish === 'function') controller.onFinish();
            }
        }

        if (controller && controller.time >= 0.9) { // explosion effect when near impact
            const explosion = scene.getObjectByName('explosion');
            if (explosion) {
                // support both Group (inner/outer children) or single Mesh
                if (explosion.type === 'Group' || explosion.isGroup) {
                    explosion.scale.multiplyScalar(1.05);
                    // fade children materials
                    for (let i = 0; i < explosion.children.length; i++) {
                        const child = explosion.children[i];
                        if (child.material && typeof child.material.opacity === 'number') {
                            child.material.opacity *= 0.95;
                        }
                    }
                    // remove when fully faded
                    const anyVisible = explosion.children.some(c => c.material && c.material.opacity > 0.01);
                    if (!anyVisible) scene.remove(explosion);
                } else {
                    explosion.scale.multiplyScalar(1.05);
                    if (explosion.material && typeof explosion.material.opacity === 'number') {
                        explosion.material.opacity *= 0.95;
                        if (explosion.material.opacity < 0.01) scene.remove(explosion);
                    }
                }
            }
        }

        const atm = scene.getObjectByName('atmosphere');
        if (atm) {
            const d = camera.position.distanceTo(atm.userData.center) - atm.userData.radius; // distance from shell surface
            const t = THREE.MathUtils.clamp(1 - d / atm.userData.falloff, 0, 1);
            atm.material.opacity = THREE.MathUtils.lerp(atm.userData.minOpacity, atm.userData.maxOpacity, t);
        }

        composer.render();
    });
}
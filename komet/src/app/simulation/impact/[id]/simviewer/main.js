// main.js
import { createCanvas } from './core/canvas.js';
import { createCamera } from './core/camera.js';
import { createScene } from './core/scene.js';
import { createSun } from './objects/sun/sun.js';
import { createComposer } from './post/composer.js';
import { createEarth } from './objects/earth/earth.js';
import { AnimationLoop } from './core/loop.js';
import { resizeHandler } from './core/resize.js';
import { createTrajectoryLine } from './objects/trajectory/trajectory_line.js';
import { createStars } from './objects/stars/stars.js';
import { createAsteroid } from './objects/asteroid/asteroid.js';
import { calculatePointList } from './core/points.js';
import { createOrbitControls } from './controls/orbitcontrols.js';

import { getSimData } from './core/sim_data.js';

export default function main(id = -1) {
  sessionStorage.clear();
  const canvas = createCanvas();
  const camera = createCamera();
  const scene = createScene();

  const { composer, bloomPass, renderer } = createComposer(canvas, scene, camera);

  createSun(scene);
  const controls = createOrbitControls(camera, renderer.domElement);
  createEarth(renderer, scene, camera, controls);
  createStars(scene, camera);

  const simData = getSimData(id).then(data => {
    console.log(data);
    calculatePointList(data).then((points) => {
      console.log(points);
      if (!points || points.length === 0) {
        console.error('No trajectory points calculated.');
        return;
      }
  
      const anim_time = { value: 0.0 };
      createTrajectoryLine(scene, points);
      const asteroid = createAsteroid(scene, points);
      camera.position.set(0, 50, 150);
      camera.lookAt(0, 0, 0);
  
      AnimationLoop(renderer, controls, scene, camera, composer, anim_time, asteroid);
    }).catch(console.error);
  }).catch(console.error);

  resizeHandler(renderer, camera, composer, bloomPass);
}

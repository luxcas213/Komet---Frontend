import * as THREE from 'three';
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

import { getSimData, getTrajectoryData } from './core/sim_data.js';

export default function main(id = -1) {
  sessionStorage.clear();
  const canvas = createCanvas();
  const camera = createCamera();
  const scene = createScene();

  const { composer, bloomPass, renderer, dispose } = createComposer(canvas, scene, camera);

  createSun(scene);
  const controls = createOrbitControls(camera, renderer.domElement);
  createEarth(renderer, scene, camera, controls);
  createStars(scene, camera);

  // create a default controller so we can start a lightweight render loop
  let controller = null;

  // load sim metadata (not trajectory) so the UI can show matches etc.
  const simData = getSimData(id).then(data => {
    // sim metadata loaded; do not compute trajectory here. UI will ask to load a specific match.
    console.log('Sim metadata loaded for id', id);
    return data;
  }).catch(console.error);

  // internal references for runtime objects created when a match is loaded
  let asteroid = null;
  let points = null;

  // helper to create controller object
  function createController() {
    return {
      time: 0.0,
      speed: 0.001,
      playing: false,
      onTimeUpdate: null,
      play() { this.playing = true; },
      pause() { this.playing = false; },
      setTime(t) { this.time = Math.min(1, Math.max(0, t)); if (typeof this.onTimeUpdate === 'function') this.onTimeUpdate(this.time); },
      setSpeed(s) { this.speed = s; }
    };
  }

  // initialize controller and start a minimal animation loop so the scene (sun, earth, stars) is visible
  controller = createController();
  // Start rendering immediately (no points/asteroid yet)
  AnimationLoop(renderer, controls, scene, camera, composer, controller, null, null);

  // API: load trajectory for a specific match index (deferred). Returns a promise that resolves when trajectory is ready.
  async function loadMatchTrajectory(matchIndex) {
    try {
      const trajInput = await getTrajectoryData(id, matchIndex);
      if (!trajInput) throw new Error('No trajectory input for match ' + matchIndex);
      // calculate point list from trajectory input
      points = await calculatePointList(trajInput);
      if (!points || points.length === 0) throw new Error('No trajectory points calculated.');

      // create visuals
      // remove previous trajectory/asteroid if present
      try {
        const prevLine = scene.getObjectByName('trajectory_line');
        if (prevLine) scene.remove(prevLine);
      } catch (e) {}
      try {
        if (asteroid) {
          scene.remove(asteroid);
          asteroid = null;
        }
      } catch (e) {}

      createTrajectoryLine(scene, points);
      asteroid = createAsteroid(scene, points);
      camera.position.set(0, 50, 150);
      camera.lookAt(0, 0, 0);

  // reuse existing controller (already driving the render loop), now points and asteroid exist
  // controller object is shared with the running loop; reset time and leave playing=false until asked
  controller.time = 0;
  controller.playing = false;

  // update the running loop by providing asteroid and points via closure parameters -
  // AnimationLoop was given 'controller' and will read 'points' and 'asteroid' variables from its arguments,
  // but since we passed null earlier for points/asteroid, we need to re-invoke the loop with the same controller but new objects.
  // To keep things simple, stop the current loop and start a new one with the updated references.
  renderer.setAnimationLoop(null);
  AnimationLoop(renderer, controls, scene, camera, composer, controller, asteroid, points);

      // expose controller on instance
      if (instance) instance.controller = controller;
      return { points, asteroid, controller };
    } catch (err) {
      console.error('Failed to load match trajectory:', err);
      throw err;
    }
  }

  // create a simple explosion effect at the given position
  function createExplosion(scene, position) {
    try {
      // remove existing
      const prev = scene.getObjectByName('explosion');
      if (prev) scene.remove(prev);

      const group = new THREE.Group();
      group.name = 'explosion';
      group.position.copy(position);

      // inner bright sphere
      const innerGeom = new THREE.SphereGeometry(1, 16, 12);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0xffdd66, transparent: true, opacity: 1, blending: THREE.AdditiveBlending });
      const inner = new THREE.Mesh(innerGeom, innerMat);
      inner.name = 'explosion_inner';
      inner.scale.set(1,1,1);
      group.add(inner);

      // outer translucent sphere
      const outerGeom = new THREE.SphereGeometry(1.5, 16, 12);
      const outerMat = new THREE.MeshBasicMaterial({ color: 0xffaa33, transparent: true, opacity: 0.6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
      const outer = new THREE.Mesh(outerGeom, outerMat);
      outer.name = 'explosion_outer';
      group.add(outer);

      scene.add(group);
    } catch (e) { console.error('createExplosion failed', e); }
  }

  // unload current trajectory and stop playback
  function unloadTrajectory() {
    try {
      if (controller) controller.playing = false;
      const prevLine = scene.getObjectByName('trajectory_line');
      if (prevLine) scene.remove(prevLine);
      if (asteroid) { scene.remove(asteroid); asteroid = null; }
      // remove any explosion
      const exp = scene.getObjectByName('explosion');
      if (exp) scene.remove(exp);
      points = null;
      if (instance) instance.controller = controller;
    } catch (e) { console.error('unloadTrajectory error', e); }
  }

  // API: start impact animation with optional config; ensures trajectory loaded first
  async function startImpactAnimation(config) {
    try {
      const matchIndex = (config && typeof config.matchIndex === 'number') ? config.matchIndex : null;
      if (matchIndex === null) throw new Error('matchIndex required in config');

      // if points not loaded or loaded for a different match, load requested match
      await loadMatchTrajectory(matchIndex);

      // you can pass more data via config (impactData etc.) if needed
      if (controller) {
        controller.setTime(0);
        controller.play();
        // attach a default onFinish handler to clean up or notify
        controller.onFinish = () => {
          // pause already set by loop; spawn explosion at last known impact point
          try {
            if (points && points.length > 0) {
              const last = points[points.length - 1];
              createExplosion(scene, new THREE.Vector3(last.x, last.y, last.z));
            }
          } catch (e) { console.error('error creating explosion', e); }
          // notify instance/UI
          if (instance && typeof instance.onFinish === 'function') instance.onFinish();
        };
      }

    } catch (err) {
      console.error('startImpactAnimation error:', err);
    }
  }

  function animation(){
    // kept for backward compatibility — play if controller exists
    if (controller) controller.play();
  }

  resizeHandler(renderer, camera, composer, bloomPass);
  // Return an object that will later receive the controller via closure
  const instance = { dispose, animation, controller, loadMatchTrajectory, startImpactAnimation, unloadTrajectory, onFinish: null };
  // when controller is set later in the simData promise, update instance.controller
  simData.then(() => { /* no-op, controller captured by closure */ }).catch(() => {});
  return instance;
}

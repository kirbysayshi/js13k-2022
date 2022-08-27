import ScienceHalt from 'science-halt';
import TestPng from '../assets/00 - Fool.png';
import { Assets } from './asset-map';
import { makeDefenseGoal } from './blueprints/defense-goal';
import { makePlayer } from './blueprints/player';
import {
  DrawStepSystem,
  DrawTimeHz,
  UpdateStepSystem,
  UpdateTimeHz,
} from './components';
import {
  computeWindowResize,
  initializeResize as initializeWindowResizeListener,
  moveViewportCamera,
  vv2,
} from './components/ViewportCmp';
import { initializeCES } from './initialize-ces';
import { createGameLoop } from './loop';
import { DrawClearScreenSystem } from './systems/DrawClearScreenSystem';
import { DrawDebugFPSSystem } from './systems/DrawDebugFPSSystem';
import { DrawDebugShapesSystem } from './systems/DrawDebugShapesSystem';
import { DrawTestSpriteSystem } from './systems/DrawTestSpriteSystem';
import { UpdateInputSystem } from './systems/UpdateInputSystem';
import { UpdateMovementSystem } from './systems/UpdateMovementSystem';
import { tick } from './time';
import { assertDefinedFatal } from './utils';

console.log(TestPng);

async function boot() {
  const assets = new Assets();
  await assets.preload();

  // A component=entity-system(s) is a pattern for managing the lifecycles and
  // structures of differently structured data. It can be thought of as a
  // document database. Each entity (document) has a numeric id. Specific
  // fields and combinations of fields across the entire Store can be queried
  // by `select`ing those fields, as seen below.
  const ces = initializeCES();

  // create the initial viewport and sizing
  initializeWindowResizeListener(ces);
  computeWindowResize(ces);

  // For a good example of touch + keyboard input, see
  // https://github.com/kirbysayshi/js13k-2020/blob/master/src/ui.ts

  makePlayer(ces);
  makeDefenseGoal(ces, vv2(25, 25), vv2(4, 4));

  // A system of an entity-component-system framework is simply a function that
  // is repeatedly called. We separate them into two types based on how often
  // they are invoked: every frame or once every update step (10fps by default).
  const drawStepSystems: DrawStepSystem[] = [];
  const updateStepSystems: UpdateStepSystem[] = [];

  {
    // Move the camera so the test image is framed nicely.
    const vp = ces.selectFirstData('viewport');
    assertDefinedFatal(vp);
    moveViewportCamera(vp, vv2(vp.vpWidth / 2, vp.camera.frustrum.y));
  }

  {
    // fps entity
    ces.entity([{ k: 'fps', v: 60 }]);
  }

  updateStepSystems.push(UpdateInputSystem(), UpdateMovementSystem());

  drawStepSystems.push(DrawClearScreenSystem(), DrawTestSpriteSystem(assets));

  drawStepSystems.push(DrawDebugFPSSystem(), DrawDebugShapesSystem());

  const { stop } = createGameLoop({
    drawTime: 1000 / DrawTimeHz,
    updateTime: 1000 / UpdateTimeHz,
    update: (dt) => {
      // Increment scheduled actions.
      tick(dt);

      // Update all the "update" systems
      updateStepSystems.forEach((s) => s(ces, dt));

      // Actualy destroy any entities that were marked for destruction. We do
      // this at the end of the update step to avoid race conditions between
      // systems.
      ces.flushDestruction();
    },
    draw: (interp) => {
      // `interp` is a value between 0 and 1 that determines how close we are
      // to the next `update` frame. This allows for smooth animation, even
      // though the actual root values change less frequently than we draw.
      drawStepSystems.forEach((s) => s(ces, interp));
    },
    onPanic,
    onFPS: (fps) => {
      const data = ces.selectFirstData('fps')!;
      data.v = fps;
    },
  });

  // Turn into dead-code during minification via NODE_ENV check.
  if (process.env.NODE_ENV !== 'production') {
    ScienceHalt(() => stop());
  }
}

function onPanic() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('panic!');
  }
}

boot();

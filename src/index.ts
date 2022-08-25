import { accelerate, inertia } from 'pocket-physics';
import ScienceHalt from 'science-halt';
import TestPng from '../assets/00 - Fool.png';
import { AsepriteAtlasAnimatedSprite, Assets } from './asset-map';
import {
  DrawStepSystem,
  DrawTimeHz,
  UpdateStepSystem,
  UpdateTimeHz,
} from './components';
import { createGameLoop } from './loop';
import { useDebugMode } from './query-string';
import { BodyTextLines, YellowRGBA } from './theme';
import { schedule, tick } from './time';
import { initializeCES } from './use-ces';
import { assertDefinedFatal } from './utils';
import {
  asPixels,
  asViewportUnits,
  clearScreen,
  computeWindowResize,
  drawSheetAssetPx,
  drawSheetAssetVp,
  drawTextLinesInViewport,
  initializeResize as initializeWindowResizeListener,
  moveViewportCamera,
  predictTextHeight,
  vv2,
} from './viewport';

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

  // An entity is just a numeric ID with associated "tagged" data denoted by
  // property 'k'. The unique names give to 'k' allow us to lookup that data
  // and modify it.
  const e1 = ces.entity([
    {
      k: 'v-movement',
      cpos: vv2(0, 0),
      ppos: vv2(0, 0),
      acel: vv2(10, 0),
    },
    { k: 'draw-console' },
  ]);

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

  // Physics "system", updated at 10fps
  updateStepSystems.push(function (ces, dt) {
    const entities = ces.select(['v-movement']);
    entities.forEach((e) => {
      const cmp = ces.data(e, 'v-movement');
      if (!cmp) return;
      accelerate(cmp, dt);
      inertia(cmp);
    });
  });

  // clear the screen at 60fps
  drawStepSystems.push((ces) => {
    const vp = ces.selectFirstData('viewport');
    assertDefinedFatal(vp);
    clearScreen(vp);
  });

  const testSprite = new AsepriteAtlasAnimatedSprite('test');

  // Draw "system" updated at 60fps
  drawStepSystems.push(function (ces, interp) {
    const vp = ces.selectFirstData('viewport');
    assertDefinedFatal(vp);
    testSprite.tick(1000 / DrawTimeHz);
    const frame = testSprite.getFrame();
    if (!frame) return;

    drawSheetAssetPx(
      vp,
      assets.getAtlas(),
      interp,
      vv2(0, 0),
      vv2(0, 0),
      frame.frame.x,
      frame.frame.y,
      frame.frame.w,
      frame.frame.h,
      asPixels(frame.spriteSourceSize.x),
      asPixels(frame.spriteSourceSize.y),
      asPixels(frame.sourceSize.w),
      asPixels(frame.sourceSize.h),
      false
    );

    drawSheetAssetVp(
      vp,
      assets.getAtlas(),
      interp,
      vv2(50, 0),
      vv2(50, 0),
      frame.frame.x,
      frame.frame.y,
      frame.frame.w,
      frame.frame.h,
      asPixels(frame.spriteSourceSize.x),
      asPixels(frame.spriteSourceSize.y),
      asPixels(frame.sourceSize.w),
      asPixels(frame.sourceSize.h),
      false,
      asViewportUnits(50),
      asViewportUnits(50)
    );
  });

  // "draw" the position of this object to the console at 60fps
  drawStepSystems.push(function (ces, interp) {
    const entities = ces.select(['v-movement', 'draw-console']);
    entities.forEach((e) => {
      const cmp = ces.data(e, 'v-movement');
      if (!cmp) return;
      console.log('x', cmp.ppos.x + (cmp.cpos.x - cmp.ppos.x) * interp);
      console.log('y', cmp.ppos.y + (cmp.cpos.y - cmp.ppos.y) * interp);
    });
  });

  // fps entity
  ces.entity([{ k: 'fps', v: 60 }]);

  // Draw the FPS as text on the canvas
  drawStepSystems.push((ces) => {
    if (!useDebugMode()) return;

    const vp = ces.selectFirstData('viewport');
    const fpsData = ces.selectFirstData('fps');
    assertDefinedFatal(vp);
    assertDefinedFatal(fpsData);

    const text = fpsData.v.toFixed(2);
    const h = predictTextHeight(vp, text, BodyTextLines);
    drawTextLinesInViewport(
      vp,
      text,
      vv2(vp.vpWidth, -vp.vpHeight + h.total),
      'right',
      BodyTextLines,
      YellowRGBA
    );
  });

  // schedule a callback for a specified "best effort" time in the future.
  schedule((scheduledDelay, actualDelay) => {
    // destroy the entity after 3500 ms
    ces.destroy(e1);
    console.log('marked entity for destruction', e1);
  }, 3500);

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

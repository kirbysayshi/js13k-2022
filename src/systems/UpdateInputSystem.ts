import { add, rotate2d, solveDrag } from 'pocket-physics';
import { makePlayerPlacedObstacle } from '../blueprints/player-placed-obstacle';
import {
  activateCooldownCmp,
  makeCooldownCmp,
} from '../components/CooldownCmp';
import { vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';
import { getKeyInputs } from '../keys';
import { assertDefinedFatal } from '../utils';

export const UpdateInputSystem = () => (ces: CES3C, dt: number) => {
  const entities = ces.select(['v-movement', 'user-controlled']);
  const keyInputs = getKeyInputs();

  let angle = 0;
  if (keyInputs.KeyW && keyInputs.KeyD) angle = Math.PI / 4;
  else if (keyInputs.KeyW && keyInputs.KeyA) angle = Math.PI * (3 / 4);
  else if (keyInputs.KeyS && keyInputs.KeyD) angle = -Math.PI / 4;
  else if (keyInputs.KeyS && keyInputs.KeyA) angle = -Math.PI * (3 / 4);
  else if (keyInputs.KeyW) angle = Math.PI / 2;
  else if (keyInputs.KeyA) angle = Math.PI;
  else if (keyInputs.KeyS) angle = -Math.PI / 2;
  else if (keyInputs.KeyD) angle = 0;

  const origin = vv2();
  const maxAcel = vv2(0.2, 0);
  const acel = rotate2d(vv2(), maxAcel, origin, angle);
  const drag = 0.5;

  // TODO: add in on-screen stick controls like signal-decay
  const shouldAcceptMove = angle !== 0 || (angle === 0 && keyInputs.KeyD);

  for (const e of entities) {
    const mv = ces.data(e, 'v-movement');
    assertDefinedFatal(mv);
    if (shouldAcceptMove) add(mv.acel, mv.acel, acel);
    else solveDrag(mv, drag);

    // TODO: need the cooldown to be attached to an ability component
    if (keyInputs.Digit1) {
      let cmp = ces.has(e, 'cooldown');
      if (!cmp) {
        ces.add(e, makeCooldownCmp(100, 0));
        cmp = ces.has(e, 'cooldown');
      }

      assertDefinedFatal(cmp);

      if (cmp.remainingMs === 0) {
        makePlayerPlacedObstacle(ces, mv.cpos, 100, 1);
        activateCooldownCmp(cmp);
      }
    }
  }
};

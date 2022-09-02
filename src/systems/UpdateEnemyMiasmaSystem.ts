import {
  add,
  createAABBOverlapResult,
  distance2,
  normalize,
  overlapAABBAABB,
  scale,
  sub,
} from 'pocket-physics';
import { AssuredEntityId } from '../ces3';
import { BoundingBoxCmp } from '../components/BoundingBoxCmp';
import { decHealth } from '../components/HealthCmp';
import { MovementCmp } from '../components/MovementCmp';
import { EnemyTargetableCmp } from '../components/Tags';
import { ViewportUnits, vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';
import { assertDefinedFatal } from '../utils';

// BEGIN: Preallocate to avoid needing potentially hundreds of these per tick.
const dir = vv2();
const enemyAcel = vv2();
const closest: [
  AssuredEntityId<MovementCmp | EnemyTargetableCmp | BoundingBoxCmp> | null,
  number | null
] = [null, null];
const aabbOverlapResult = createAABBOverlapResult<ViewportUnits>();
// END: Preallocate

export const UpdateEnemyMiasmaSystem = () => (ces: CES3C, dt: number) => {
  const entities = ces.select(['v-movement', 'enemy-miasma', 'bounding-box']);
  const targets = ces.select([
    'v-movement',
    'enemy-targetable',
    'bounding-box',
  ]);

  const obstacles = ces.select([
    'v-movement',
    'enemy-impedance',
    'impedance-value',
    'bounding-box',
    'health-value',
  ]);

  entities.forEach((e) => {
    const emv = ces.data(e, 'v-movement');
    const ebb = ces.data(e, 'bounding-box');
    assertDefinedFatal(emv);
    assertDefinedFatal(ebb);

    // if enemy is colliding with an obstacle, apply impedance (0-1)!
    let impedance = 0;

    for (const oid of obstacles) {
      const omv = ces.data(oid, 'v-movement');
      const obb = ces.data(oid, 'bounding-box');
      const oim = ces.data(oid, 'impedance-value');
      const ohh = ces.data(oid, 'health-value');
      assertDefinedFatal(omv);
      assertDefinedFatal(obb);
      assertDefinedFatal(oim);
      assertDefinedFatal(ohh);

      const isOverlapping = overlapAABBAABB(
        emv.cpos.x,
        emv.cpos.y,
        ebb.wh.x,
        ebb.wh.y,
        omv.cpos.x,
        omv.cpos.y,
        obb.wh.x,
        obb.wh.y,
        aabbOverlapResult
      );

      if (isOverlapping) {
        // Use the "last" value only
        impedance = oim.value;

        // Decrement health of the obstacle, they are fragile :)
        const attack = 1; // TODO: make this part of the enemy data
        decHealth(ohh, attack);
      }
    }

    closest[0] = closest[1] = null;

    for (const t of targets) {
      const tmv = ces.data(t, 'v-movement');
      const tbb = ces.data(t, 'bounding-box');
      const thv = ces.has(t, 'health-value');
      assertDefinedFatal(tmv);
      assertDefinedFatal(tbb);
      const dist = distance2(tmv.cpos, emv.cpos);
      if (closest[1] === null || dist < closest[1]) {
        closest[0] = t;
        closest[1] = dist;
      }

      const isOverlapping = overlapAABBAABB(
        emv.cpos.x,
        emv.cpos.y,
        ebb.wh.x,
        ebb.wh.y,
        tmv.cpos.x,
        tmv.cpos.y,
        tbb.wh.x,
        tbb.wh.y,
        aabbOverlapResult
      );

      if (isOverlapping && thv) {
        // TODO: make this part of the enemy data
        const attack = 1;
        decHealth(thv, attack);
      }
    }

    if (!closest[0]) return;

    const mv = ces.data(closest[0], 'v-movement');
    assertDefinedFatal(mv);

    // find angle to target
    // make accel vector
    // scale based on "agility"
    // add to acel

    sub(dir, mv.cpos, emv.cpos);
    normalize(dir, dir);

    // TODO: probably want this attached to the enemy tag so it can be configurable
    const enemySpeed = 0.1 * (1 - impedance);
    scale(enemyAcel, dir, enemySpeed);
    add(emv.acel, emv.acel, enemyAcel);
  });
};

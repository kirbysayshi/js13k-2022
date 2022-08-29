import { add, distance2, normalize, scale, sub } from 'pocket-physics';
import { AssuredEntityId } from '../ces3';
import { MovementCmp } from '../components/MovementCmp';
import { EnemyTargetableCmp } from '../components/Tags';
import { vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';
import { assertDefinedFatal } from '../utils';

// Preallocate to avoid needing potentially hundreds of these per tick.
const dir = vv2();
const enemyAcel = vv2();
const closest: [
  AssuredEntityId<MovementCmp | EnemyTargetableCmp> | null,
  number | null
] = [null, null];

export const UpdateEnemyMiasmaSystem = () => (ces: CES3C, dt: number) => {
  const entities = ces.select(['v-movement', 'enemy-miasma']);
  const targets = ces.select(['v-movement', 'enemy-targetable']);

  entities.forEach((e) => {
    const emv = ces.data(e, 'v-movement');
    assertDefinedFatal(emv);

    closest[0] = closest[1] = null;

    for (const t of targets) {
      const mv = ces.data(t, 'v-movement');
      assertDefinedFatal(mv);
      const dist = distance2(mv.cpos, emv.cpos);
      if (closest[1] === null || dist < closest[1]) {
        closest[0] = t;
        closest[1] = dist;
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
    const enemySpeed = 0.1;
    scale(enemyAcel, dir, enemySpeed);
    add(emv.acel, emv.acel, enemyAcel);
  });
};

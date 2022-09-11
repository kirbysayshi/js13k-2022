import { scale } from 'pocket-physics';
import { animations, Assets } from '../asset-map';
import { incHealth, makeHealthCmp } from '../components/HealthCmp';
import { makeMovementCmp } from '../components/MovementCmp';
import { ViewportUnitVector2, vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';
import { getRandom } from '../rng';
import { assertDefinedFatal } from '../utils';
import { makeSingleFrameSprite } from './single-frame-sprite';

export function makeEnemy(
  ces: CES3C,
  assets: Assets,
  pos: ViewportUnitVector2,
  health = 100,
  attack = 1,
  speed = 0.1
) {
  ces.entity([
    makeMovementCmp(pos),
    { k: 'bounding-box', wh: vv2(1, 1) },
    { k: 'debug-drawable-rect' },
    { k: 'enemy-miasma', speed, attack },
    makeHealthCmp(health, (eid) => {
      // Generate a tombstone (plant) on death
      const currentPos = ces.has(eid, 'v-movement');
      const bb = ces.has(eid, 'bounding-box');
      if (currentPos && bb) {
        const assetChoices = Object.keys(animations).filter((k) =>
          k.match(/plants-/)
        ) as (keyof typeof animations)[];
        const rand = getRandom();
        const idx = Math.floor(assetChoices.length * rand);
        const name = assetChoices[idx];

        makeSingleFrameSprite(
          ces,
          currentPos.cpos,
          scale(bb.wh, bb.wh, 8),
          name
        );

        const players = ces.select(['player-abilities', 'health-value']);
        for (const pid of players) {
          const health = ces.data(pid, 'health-value');
          assertDefinedFatal(health);

          // This is a hack to do it in the enemy logic, but otherwise would
          // require a separate system... Give the player back health equal to
          // the enemy's attack.
          incHealth(health, attack);
        }
      }

      ces.destroy(eid);
    }),
    { k: 'drag-phys', drag: 0.5 },
    { k: 'collision-group-001' },
  ]);
}

import { Assets } from '../asset-map';
import { makeDefenseGoal } from '../blueprints/defense-goal';
import { makeEnemy } from '../blueprints/enemy';
import { makePlayer } from '../blueprints/player';
import { vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';
import { getRandom } from '../rng';

export function Level001(ces: CES3C, assets: Assets) {
  makePlayer(ces, vv2(25, 0));
  makeDefenseGoal(ces, vv2(25, 25), vv2(4, 4));
  // makeEnemy(ces, assets, vv2(60, 98), 100, 2);
  // makeEnemy(ces, assets, vv2(64, 98), 100, 1, 0.02);
  // makeEnemy(ces, assets, vv2(68, 98), 100, 1, 0.02);
  // makeEnemy(ces, assets, vv2(72, 98), 100, 1, 0.02);
  // makeEnemy(ces, assets, vv2(76, 98), 100, 1, 0.02);
  // makeEnemy(ces, assets, vv2(82, 98), 100, 1, 0.02);

  for (let i = 0; i < 1000; i++) {
    const x = getRandom() * 100;
    const y = getRandom() * 100;

    const minAttack = 1;
    const maxAttack = 5;
    const attack = minAttack + Math.floor(getRandom() * maxAttack);

    const minSpeed = 0.02;
    const maxSpeed = 0.1;
    const speed = minSpeed + Math.floor(getRandom() * maxSpeed);

    makeEnemy(ces, assets, vv2(x, y), 100, attack, speed);
  }
}

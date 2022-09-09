import { makeDefenseGoal } from '../blueprints/defense-goal';
import { makeEnemy } from '../blueprints/enemy';
import { makePlayer } from '../blueprints/player';
import { vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';

export function Level001(ces: CES3C) {
  makePlayer(ces, vv2(25, 0));
  makeDefenseGoal(ces, vv2(25, 25), vv2(4, 4));
  makeEnemy(ces, vv2(60, 98), 100, 2);
  makeEnemy(ces, vv2(64, 98), 100, 1, 0.02);
  makeEnemy(ces, vv2(68, 98), 100, 1, 0.02);
  makeEnemy(ces, vv2(72, 98), 100, 1, 0.02);
  makeEnemy(ces, vv2(76, 98), 100, 1, 0.02);
  makeEnemy(ces, vv2(82, 98), 100, 1, 0.02);
}

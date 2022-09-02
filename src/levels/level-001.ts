import { makeDefenseGoal } from '../blueprints/defense-goal';
import { makeEnemy } from '../blueprints/enemy';
import { makePlayer } from '../blueprints/player';
import { vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';

export function Level001(ces: CES3C) {
  makePlayer(ces, vv2(25, 0));
  makeDefenseGoal(ces, vv2(25, 25), vv2(4, 4));
  makeEnemy(ces, vv2(75, 98));
}

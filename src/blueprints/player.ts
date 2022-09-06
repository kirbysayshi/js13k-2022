import { makeHealthCmp } from '../components/HealthCmp';
import { makeMovementCmp } from '../components/MovementCmp';
import { makePlayerAbilitiesCmp } from '../components/PlayerAbilitiesCmp';
import { ViewportUnitVector2, vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';

export function makePlayer(ces: CES3C, pos: ViewportUnitVector2) {
  ces.entity([
    makeMovementCmp(pos),
    { k: 'user-controlled' },
    { k: 'bounding-box', wh: vv2(1, 1) },
    { k: 'debug-drawable-rect' },
    { k: 'enemy-targetable' },
    makeHealthCmp(1000),
    makePlayerAbilitiesCmp(),
  ]);
}

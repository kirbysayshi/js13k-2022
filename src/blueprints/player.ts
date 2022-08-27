import { makeMovementCmp } from '../components/MovementCmp';
import { vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';

export function makePlayer(ces: CES3C) {
  ces.entity([
    makeMovementCmp(vv2(25, 0)),
    { k: 'user-controlled' },
    { k: 'bounding-box', wh: vv2(1, 1) },
    { k: 'debug-drawable-rect' },
  ]);
}

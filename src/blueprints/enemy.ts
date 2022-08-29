import { makeMovementCmp } from '../components/MovementCmp';
import { ViewportUnitVector2, vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';

export function makeEnemy(ces: CES3C, pos: ViewportUnitVector2) {
  ces.entity([
    makeMovementCmp(pos),
    { k: 'bounding-box', wh: vv2(1, 1) },
    { k: 'debug-drawable-rect' },
    { k: 'enemy-miasma' },
    { k: 'drag-phys', drag: 0.5 },
  ]);
}

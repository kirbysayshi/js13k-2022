import { makeHealthCmp } from '../components/HealthCmp';
import { makeImpedanceCmp } from '../components/ImpedanceCmp';
import { makeMovementCmp } from '../components/MovementCmp';
import { ViewportUnitVector2, vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';

// TODO: better name...
export function makePlayerPlacedObstacle(
  ces: CES3C,
  pos: ViewportUnitVector2,
  health: number,
  impedance: number
) {
  ces.entity([
    makeMovementCmp(pos),
    { k: 'bounding-box', wh: vv2(2, 2) },
    { k: 'debug-drawable-circle' },
    makeHealthCmp(health),
    { k: 'enemy-impedance' },
    makeImpedanceCmp(impedance),
  ]);
}

import {
  add,
  collisionResponseAABB,
  createAABBOverlapResult,
  overlapAABBAABB,
  scale,
  sub,
} from 'pocket-physics';
import { AssuredEntityId, EntityId } from '../ces3';
import { BoundingBoxCmp } from '../components/BoundingBoxCmp';
import { MovementCmp } from '../components/MovementCmp';
import { vv2 } from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';
import { assertDefinedFatal } from '../utils';

const collision = createAABBOverlapResult();

export const UpdateSolveOverlapsSystem =
  (
    group: 'collision-group-001' | 'collision-group-002' = 'collision-group-001'
  ) =>
  (ces: CES3C, dt: number) => {
    const entities = [...ces.select(['v-movement', 'bounding-box', group])];

    solvePairWiseOverlaps(
      ces,
      // TODO: fix this, somehow. The issue is that `_assured: T` is incompatible.
      entities as AssuredEntityId<MovementCmp | BoundingBoxCmp>[],
      false
    );
  };

type HandledPairId = `${EntityId['id']}_${EntityId['id']}`;

function solvePairWiseOverlaps(
  ces: CES3C,
  entities: AssuredEntityId<MovementCmp | BoundingBoxCmp>[],
  includeCollisionResponse: boolean = false
) {
  // if two groups are used, this will be needed. if only one group is used for
  // inner collisions, then it is not due to the loop structure.
  const resolvedThisTick = new Set<HandledPairId>();

  for (let i = 0; i < entities.length; i++) {
    const e0 = entities[i];
    const mv0 = ces.data(e0, 'v-movement');
    const bb0 = ces.data(e0, 'bounding-box');
    const pm0 = ces.has(e0, 'p-mass');
    assertDefinedFatal(mv0);
    assertDefinedFatal(bb0);

    for (let j = i + 1; j < entities.length; j++) {
      const e1 = entities[j];
      const mv1 = ces.data(e1, 'v-movement');
      const bb1 = ces.data(e1, 'bounding-box');
      const pm1 = ces.has(e1, 'p-mass');
      assertDefinedFatal(mv1);
      assertDefinedFatal(bb1);

      const isOverlapping = overlapAABBAABB(
        mv0.cpos.x,
        mv0.cpos.y,
        bb0.wh.x,
        bb0.wh.y,
        mv1.cpos.x,
        mv1.cpos.y,
        bb1.wh.x,
        bb1.wh.y,
        collision
      );

      if (!isOverlapping) continue;

      // Do not handle overlaps more than once per tick
      const key0: HandledPairId = `${e0.id}_${e1.id}`;
      const key1: HandledPairId = `${e1.id}_${e0.id}`;

      if (resolvedThisTick.has(key0) || resolvedThisTick.has(key1)) continue;

      resolvedThisTick.add(key0);
      resolvedThisTick.add(key1);

      // move to non-overlapping position
      const overlapHalf = scale(vv2(), collision.resolve, 0.5);
      add(mv1.cpos, mv1.cpos, overlapHalf);
      add(mv1.ppos, mv1.ppos, overlapHalf);
      sub(mv0.cpos, mv0.cpos, overlapHalf);
      sub(mv0.ppos, mv0.ppos, overlapHalf);

      if (!includeCollisionResponse) continue;

      const mv0v = vv2();
      const mv1v = vv2();

      const restitution = 1;
      const staticFriction = 0.9;
      const dynamicFriction = 0.01;

      collisionResponseAABB(
        mv0.cpos,
        mv0.ppos,
        pm0?.mass ?? 1,
        restitution,
        staticFriction,
        dynamicFriction,
        mv1.cpos,
        mv1.ppos,
        pm1?.mass ?? 1,
        restitution,
        staticFriction,
        dynamicFriction,
        // Allow the response function to recompute a normal based on the
        // axis between the centers of the boxes. this produces a more
        // natural looking collision.
        // collision.normal,
        vv2(),
        mv0v,
        mv1v
      );

      // Apply the new velocity
      sub(mv0.ppos, mv0.cpos, mv0v);
      sub(mv1.ppos, mv1.cpos, mv1v);
    }
  }
}

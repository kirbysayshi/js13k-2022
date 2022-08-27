import { accelerate, inertia } from 'pocket-physics';
import { CES3C } from '../initialize-ces';

// Physics "system", updated at 10fps
export const UpdateMovementSystem = () => (ces: CES3C, dt: number) => {
  const entities = ces.select(['v-movement']);
  entities.forEach((e) => {
    const cmp = ces.data(e, 'v-movement');
    if (!cmp) return;
    accelerate(cmp, dt);
    inertia(cmp);
  });
};

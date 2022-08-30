import { CES3C } from '../initialize-ces';
import { assertDefinedFatal } from '../utils';

export const UpdateCooldownSystem = () => (ces: CES3C, dt: number) => {
  const entities = ces.select(['cooldown']);
  entities.forEach((e) => {
    const cmp = ces.data(e, 'cooldown');
    assertDefinedFatal(cmp);
    cmp.remainingMs = Math.max(0, cmp.remainingMs - dt);
  });
};

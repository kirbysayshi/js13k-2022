import { CES3C } from '../initialize-ces';
import { assertDefinedFatal } from '../utils';

export const UpdateHealthSystem = () => (ces: CES3C, dt: number) => {
  const entities = ces.select(['health-value']);
  for (const e of entities) {
    const cmp = ces.data(e, 'health-value');
    assertDefinedFatal(cmp);
    // TODO: probably want this to be a callback...
    if (cmp.value <= 0) ces.destroy(e);
  }
};

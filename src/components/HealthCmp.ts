import { AssuredEntityId } from '../ces3';

export type HealthCmp = {
  k: 'health-value';
  // How much health remains
  value: number;
  max: number;
  onHealthZero?: (eid: AssuredEntityId<HealthCmp>) => void;
};

export function makeHealthCmp(
  max: number,
  onHealthZero?: HealthCmp['onHealthZero'],
  value = max
): HealthCmp {
  return {
    k: 'health-value',
    max,
    value,
    onHealthZero,
  };
}

export function decHealth(cmp: HealthCmp, amount: number) {
  cmp.value = Math.max(cmp.value - amount, 0);
}

export function incHealth(cmp: HealthCmp, amount: number) {
  cmp.value = Math.min(cmp.value + amount, cmp.max);
}

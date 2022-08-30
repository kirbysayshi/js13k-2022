export type HealthCmp = {
  k: 'health-value';
  // How much health remains
  value: number;
  max: number;
};

export function makeHealthCmp(max: number, value = max): HealthCmp {
  return {
    k: 'health-value',
    max,
    value,
  };
}

export function decHealth(cmp: HealthCmp, amount: number) {
  cmp.value = Math.max(cmp.value - amount, 0);
}

export function incHealth(cmp: HealthCmp, amount: number) {
  cmp.value = Math.min(cmp.value + amount, cmp.max);
}

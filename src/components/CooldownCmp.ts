export type CooldownCmp = {
  k: 'cooldown';
  // How much time remains
  remainingMs: number;
  // What the max time is when initializing or resetting
  durationMs: number;
};

export function makeCooldownCmp(
  durationMs: number,
  remainingMs = durationMs
): CooldownCmp {
  return {
    k: 'cooldown',
    durationMs,
    remainingMs,
  };
}

export function activateCooldownCmp(cmp: CooldownCmp) {
  cmp.remainingMs = cmp.durationMs;
}

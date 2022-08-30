import { Integratable, normalize, scale, sub, v2 } from 'pocket-physics';

export function setVelocity(cmp: Integratable, mag: number) {
  const dir = sub(v2(), cmp.cpos, cmp.ppos);
  const norm = normalize(dir, dir);
  const vel = scale(norm, norm, mag);
  sub(cmp.ppos, cmp.cpos, vel);
}

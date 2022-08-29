import {
  add,
  Integratable,
  normalize,
  PointEdgeProjection,
  scale,
  sub,
  v2,
  Vector2,
} from 'pocket-physics';

export function setVelocity(cmp: Integratable, mag: number) {
  const dir = sub(v2(), cmp.cpos, cmp.ppos);
  const norm = normalize(dir, dir);
  const vel = scale(norm, norm, mag);
  sub(cmp.ppos, cmp.cpos, vel);
}

export function makePointEdgeProjectionResult(): PointEdgeProjection {
  return {
    distance: 0,
    similarity: 0,
    u: 0,
    projectedPoint: v2(),
    edgeNormal: v2(),
  };
}

// preallocations
const v = v2();
const direction = v2();
const radiusSegment = v2();

// Compute the leading edge of a circular moving object given a radius: cpos +
// radius in the direction of velocity.
export function projectCposWithRadius(
  out: Vector2,
  p: Integratable,
  radius: number
) {
  sub(v, p.cpos, p.ppos);
  normalize(direction, v);
  scale(radiusSegment, direction, radius);
  add(out, radiusSegment, p.cpos);
  return out;
}

import { CES3 } from './ces3';
import { Component } from './components';
export type CES3C = CES3<Component>;

export function initializeCES() {
  return new CES3<Component>();
}

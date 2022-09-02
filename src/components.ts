import type { AssuredEntityId, CES3, NarrowComponent } from './ces3';
import { AssetCmp } from './components/AssetCmp';
import { BoundingBoxCmp } from './components/BoundingBoxCmp';
import { CooldownCmp } from './components/CooldownCmp';
import { FPSCmp } from './components/FPSCmp';
import { GameDataCmp } from './components/GameCmp';
import { HealthCmp } from './components/HealthCmp';
import { ImpedanceCmp } from './components/ImpedanceCmp';
import { DragPhysCmp, MovementCmp } from './components/MovementCmp';
import { SpringConstraintCmp } from './components/SpringConstraintCmp';
import {
  DebugDrawableCircleCmp,
  DebugDrawableRectCmp,
  EnemyImpedanceCmp,
  EnemyMiasmaCmp,
  EnemyTargetableCmp,
  UserControlledCmp,
} from './components/Tags';
import { ViewportCmp } from './components/ViewportCmp';

export type Component =
  | FPSCmp
  | AssetCmp
  | SpringConstraintCmp
  | ViewportCmp
  | MovementCmp
  | UserControlledCmp
  | BoundingBoxCmp
  | DebugDrawableCircleCmp
  | DebugDrawableRectCmp
  | EnemyMiasmaCmp
  | EnemyTargetableCmp
  | DragPhysCmp
  | CooldownCmp
  | HealthCmp
  | ImpedanceCmp
  | EnemyImpedanceCmp
  | GameDataCmp;

// NOTE: you don't really need EntityDefSelector and DefToAssuredEntityId. It's
// easier to use AssuredEntityId<...> and keep references to the IDs. Plus the
// borrowing system allows for more complex relationships and lifecycles anyway.
// EntityDefSelector is really only useful for systems to define what they
// require.

// Mapped types are bonkers! The syntax... Without the second
// `extends Component` it would not allow indexing by `"k"`.
export type EntityDefSelector<T extends [Component] | Component[]> = Readonly<{
  [K in keyof T]: T[K] extends Component ? T[K]['k'] : never;
}>;

// Given a list of Components, return a Compatible AssuredEntityId. This allows
// a "Def" (what is passed to EntityDefSelector) to create matching
// AssuredEntityIds.
export type DefToAssuredEntityId<T extends Component[]> = AssuredEntityId<
  NarrowComponent<Component, T[number]['k']>
>;

export const DrawTimeHz = 60 as const;
export const UpdateTimeHz = 30 as const;

// A system of an entity-component-system framework is simply a function that
// is repeatedly called. We separate them into two types based on how often
// they are invoked: every frame or once every update step (10fps by default).
export type DrawStepSystem = (ces: CES3<Component>, interp: number) => void;
export type UpdateStepSystem = (ces: CES3<Component>, dt: number) => void;

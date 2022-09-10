import { Assets } from '../asset-map';
import { DrawStepSystem, UpdateStepSystem } from '../components';
import { CES3C } from '../initialize-ces';
import { Level001 } from '../levels/level-001';
import { UpdateGameTickSystem } from '../systems/UpdateGameTickSystem';

type GameState = 'boot' | 'level' | 'died';

export type GameDataCmp = {
  k: 'game-data';
  ticks: number;
  prevState: null | GameState;
  currState: GameState;
  level: number;
  levels: ((ces: CES3C, assets: Assets) => void)[];
  drawStepSystems: DrawStepSystem[];
  updateStepSystems: UpdateStepSystem[];
  gameTickSystem: UpdateStepSystem;
};

export function makeGameCmp(assets: Assets): GameDataCmp {
  return {
    k: 'game-data',
    ticks: 0,
    prevState: null,
    currState: 'boot',
    level: 0,
    levels: [Level001],
    drawStepSystems: [],
    updateStepSystems: [],
    gameTickSystem: UpdateGameTickSystem(assets),
  };
}

export function toGameState(cmp: GameDataCmp, next: GameState) {
  cmp.prevState = cmp.currState;
  cmp.currState = next;
  cmp.ticks = 0;
}

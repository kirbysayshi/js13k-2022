import { AsepriteAtlasAnimatedSprite } from '../asset-map';
import { EntityDefSelector } from '../components';
import { MovementCmp } from './MovementCmp';
import { ViewportUnits, vv2 } from './ViewportCmp';

export type AssetCmp = {
  k: 'asset';
  asset: AsepriteAtlasAnimatedSprite['tag'];
  width: ViewportUnits;
  height: ViewportUnits;
};

export type DrawableAssetDef = [MovementCmp, AssetCmp];
export const drawableAssetSelector: EntityDefSelector<DrawableAssetDef> = [
  'v-movement',
  'asset',
] as const;

export function drawableAssetDef(
  x: ViewportUnits,
  y: ViewportUnits,
  width: AssetCmp['width'],
  height: AssetCmp['height'],
  asset: AssetCmp['asset']
): DrawableAssetDef {
  return [
    {
      k: 'v-movement',
      cpos: vv2(x, y),
      ppos: vv2(x, y),
      acel: vv2(),
    },
    {
      k: 'asset',
      asset: asset,
      width,
      height,
    },
  ];
}

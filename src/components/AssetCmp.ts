import { AsepriteAtlasAnimatedSprite } from '../asset-map';

export type AssetCmp = {
  k: 'asset';
  asset: AsepriteAtlasAnimatedSprite['tag'];
  // wh: ViewportUnitVector2;
};

export function makeAssetCmp(
  asset: AssetCmp['asset']
  // wh: ViewportUnitVector2
): AssetCmp {
  return {
    k: 'asset',
    asset: asset,
    // wh: copy(vv2(), wh),
  };
}

// export type DrawableAssetDef = [MovementCmp, AssetCmp];
// export const drawableAssetSelector: EntityDefSelector<DrawableAssetDef> = [
//   'v-movement',
//   'asset',
// ] as const;

// export function drawableAssetDef(
//   pos: ViewportUnitVector2,
//   wh: ViewportUnitVector2,
//   asset: AssetCmp['asset']
// ): DrawableAssetDef {
//   return [
//     {
//       k: 'v-movement',
//       cpos: vv2(x, y),
//       ppos: vv2(x, y),
//       acel: vv2(),
//     },
//     {
//       k: 'asset',
//       asset: asset,
//       width,
//       height,
//     },
//   ];
// }

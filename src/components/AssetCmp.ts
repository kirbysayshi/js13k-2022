import { AsepriteAtlasAnimatedSprite } from '../asset-map';

export type AssetCmp = {
  k: 'asset';
  asset: AsepriteAtlasAnimatedSprite['tag'];
};

export function makeAssetCmp(asset: AssetCmp['asset']): AssetCmp {
  return {
    k: 'asset',
    asset: asset,
  };
}

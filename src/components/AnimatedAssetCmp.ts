import { AsepriteAtlasAnimatedSprite } from '../asset-map';

export type AnimatedAssetCmp = {
  k: 'animated-asset';
  animSprite: AsepriteAtlasAnimatedSprite;
};

export function makeAnimatedAssetCmp(
  asset: AsepriteAtlasAnimatedSprite['tag']
): AnimatedAssetCmp {
  return {
    k: 'animated-asset',
    animSprite: new AsepriteAtlasAnimatedSprite(asset),
  };
}

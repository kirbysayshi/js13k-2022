import { AsepriteAtlasAnimatedSprite, Assets } from '../asset-map';
import { DrawTimeHz } from '../components';
import {
  asPixels,
  asViewportUnits,
  drawSheetAssetPx,
  drawSheetAssetVp,
  vv2,
} from '../components/ViewportCmp';
import { CES3C } from '../initialize-ces';
import { assertDefinedFatal } from '../utils';

export const DrawTestSpriteSystem =
  (
    assets: Assets,
    testSprite = new AsepriteAtlasAnimatedSprite('player-16x16#flick')
  ) =>
  (ces: CES3C, interp: number) => {
    const vp = ces.selectFirstData('viewport');
    assertDefinedFatal(vp);
    testSprite.tick(1000 / DrawTimeHz);
    const frame = testSprite.getFrame();
    if (!frame) return;

    drawSheetAssetPx(
      vp,
      assets.getAtlas(),
      interp,
      vv2(0, 0),
      vv2(0, 0),
      frame.frame.x,
      frame.frame.y,
      frame.frame.w,
      frame.frame.h,
      asPixels(frame.spriteSourceSize.x),
      asPixels(frame.spriteSourceSize.y),
      asPixels(frame.sourceSize.w),
      asPixels(frame.sourceSize.h),
      true
    );

    drawSheetAssetVp(
      vp,
      assets.getAtlas(),
      interp,
      vv2(50, 0),
      vv2(50, 0),
      frame.frame.x,
      frame.frame.y,
      frame.frame.w,
      frame.frame.h,
      asPixels(frame.spriteSourceSize.x),
      asPixels(frame.spriteSourceSize.y),
      asPixels(frame.sourceSize.w),
      asPixels(frame.sourceSize.h),
      true,
      asViewportUnits(50),
      asViewportUnits(50)
    );
  };

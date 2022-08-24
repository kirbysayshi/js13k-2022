import AtlasJson from '../assets/pipeline-output-aseprite/atlas';
import AtlasImg from '../assets/pipeline-output-aseprite/atlas.png';
import { loadImage } from './load-image';

// TODO: probably don't need asset registry at all, since it's a sprite atlas...

const AssetRegistry = [{ path: AtlasImg, name: 'atlas' }] as const;

type AssetNames = typeof AssetRegistry[number]['name'];

export type LoadedAsset = {
  path: string;
  name: string;
  img: HTMLImageElement;
};

export class AssetMap {
  loadedAssets: { [key: string]: LoadedAsset } = {};

  async preload(opt_onlyLoad: Set<AssetNames> = new Set()): Promise<void> {
    await Promise.all(
      AssetRegistry.map(async (u) => {
        if (
          this.loadedAssets[u.name] ||
          (opt_onlyLoad.size > 0 && !opt_onlyLoad.has(u.name))
        )
          return;

        const img = await loadImage(u.path);
        this.loadedAssets[u.name] = { path: u.path, name: u.name, img };
      })
    );
  }

  getImage(name: AssetNames): HTMLImageElement {
    const asset = this.loadedAssets[name];
    if (!asset) throw new Error(`LD_${name}`);
    return asset.img;
  }
}

type FrameTag<Name extends string> = {
  name: Name;
  from: number;
  to: number;
  direction: 'forward' | 'reverse' | 'pingpong';
};

type Frame = {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  duration: number;
};

type AsepriteJSON<filename extends string, TagNames extends string> = {
  frames: { [K in `${TagNames}_${number}`]: Frame };
  meta: {
    app: string;
    version: string;
    image: filename;
    format: 'RGBA8888';
    size: { w: number; h: number };
    scale: string;
    frameTags: FrameTag<TagNames>[][];
  };
};

type Animation = {
  frames: Frame[];
  direction: 'forward' | 'reverse' | 'pingpong';
};

function collectAsepriteAtlasJSON<
  J extends typeof AtlasJson,
  Names extends J['meta']['frameTags'][number]['name']
>(
  json: typeof AtlasJson
): {
  [K in Names]: Animation;
} {
  const out: { [K in Names]?: Animation } = {};

  for (const tagData of json.meta.frameTags) {
    const start = tagData.from;
    const end = tagData.to;
    const frames = [];

    // TS is not importing as const...
    for (let i = start; i <= end; i++) {
      const name = `${tagData.name}_${i}` as `${Names}_${number}`;
      const all = AtlasJson.frames as unknown as {
        [K in `${Names}_${number}`]: Frame;
      };
      const frame = all[name];
      frames.push(frame);
    }

    out[tagData.name as Names] = {
      frames,
      ...tagData,
    };
  }

  return out as {
    [K in Names]: Animation;
  };
}

const animations = collectAsepriteAtlasJSON(AtlasJson);

export class AsepriteAtlasAnimatedSprite {
  private frame = 0;
  private accum = 0;
  constructor(
    private tag: keyof typeof animations,
    private anim = animations[tag]
  ) {}

  tick(dtMs: number): void {
    this.accum += dtMs;
    const f = this.anim.frames[this.frame];
    if (this.accum > f.duration) {
      this.accum -= f.duration;
      this.frame += 1;
      if (this.frame >= this.anim.frames.length) {
        this.frame = 0;
      }
    }
  }

  getFrame(): Frame | null {
    const f = this.anim.frames[this.frame];
    return f;
  }
}

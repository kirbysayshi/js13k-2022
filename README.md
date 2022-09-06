# game-bucket

Common game utilities + rollup config, suitable for a small game competition. Like [JS13k](http://js13kgames.com/)! In TypeScript!

Examples:

- [Signal Decay, JS13K-2020](https://github.com/kirbysayshi/js13k-2020/)
- [Health Alchemy (Incomplete), JS13K-2019](https://github.com/kirbysayshi/js13k-2019)
- [Ghost High Fiver (Incomplete), JS13K-2018](https://github.com/kirbysayshi/ghost-high-fiver)
- [Night Shift Barisa, JS13K-2016](https://github.com/kirbysayshi/night-shift-barista)

Includes:

- [Component Entity System](lib/ces.js)
- [Stable Game Loop with interpolation and panic modes](lib/loop.js)
- [Scheduling, for game-time dependent time events](lib/time.js)
- JS13K-compatible zip creation + notice of how close you are to the limit: `yarn zip`
- Rollup, so you still get to use modules and separate files.
- More? You should make a PR!

[Rollup](https://github.com/rollup/rollup/) bundles JS using ES2015 modules, but does not leave any of the import/export syntax in the resulting bundle. It pulls everything into the same lexical scope, uniquely named. This makes it excellent for a size-based competition, because by its very nature it emits the smallest representation of code! Combined with UglifyJS this gets us very close to a nice base size.

## Usage

Fork this repo, then add / change code in src/index.js as you see fit! There are dependencies included, but you can remove those. Rollup ensures that only code you `import` is included!

- Static files can be configured for copying in [rollup.config.js](./rollup.config.js). Default is just [`src/index.html`](src/index.html)
- Static files that are `import`ed are automatically copied into the `dist/` folder by rollup.
- [Roadroller](https://github.com/lifthrasiir/roadroller) is ready! Check [tools/zip.sh](./tools/zip.sh).
- PNG/ZIP optimizations are handled by [Efficient-Compression-Tool](https://github.com/fhanau/Efficient-Compression-Tool) (ect).

### `yarn start`

Run type checking, rollup, and a local http server in watch mode.

### `yarn zip`

How close are you to the limit? Compiles in production mode, and creates a zip suitable for JS13K in `/dist`!

### `yarn deploy`

Build a zip, then deploy the `dist` folder to `gh-pages` seamlessly! Best for testing your game on multiple devices.

### `yarn http-server dist/`

Done automatically by `yarn start`, but perhaps you just ran `yarn zip` and want to run the actual compiled/mangled code.

## LICENSE

MIT


## DevLog

### 2022-08-21 - 2022-08-24

TexturePacker removed animation support from their JSON output, so I decided to switch to Aseprite for now. But it's a benefit because Aseprite allows for trimming of the sprite sheet! It makes for more complex extraction, while gaining sprite atlas space savings.

### 2022-08-25

Use pixels for drawing sprites

### 2022-08-26

Got some entities in there and debug draw them! Keyboard control is working. Refactored systems into separate files.

### 2022-08-28

Found a bug where the sprite sheet was drawing at the wrong (flipped) y, resulting in completely wrong results.

Aseprite has some missing behavior where frame tags are embedded in the atlas without any filename data. So the collection code needed to be rewritten to instead iterate through the frames and track how many times a specific tag had been encountered. Luckily the frame tags are still ordered!

Added an enemy that moves towards a target and the player. It's kite-able by the player!

### 2022-08-29

Added a super basic "ability" that puts a dot on the field whenever you hit `1`.

An enemy is slowed down and can damage an obstacle! Eventually the obstacle becomes destroyed.

Brought in analog sticks again.

### 2022-08-30

The player and defense targets can die.

The game will restart! There are levels, and the systems are initialized by the levels themselves rather than being global.

I think I'm going to call this "Paint a Picture of Death", and the goal will be to create a nice painting as you replace all the miasma with plants.

### 2022-09-04

Took a few days diversion to look into spatial hashing (got a bit nerd sniped...). Found a cool series of videos and felt the need to investigate further. https://www.youtube.com/watch?v=oewDaISQpw0

Discovered that the author had used `Map` wrong, so I made a PR. https://github.com/simondevyoutube/Tutorial_SpatialHashGrid_Optimized/pull/1

Not even sure of the benchmark, tbh. After writing my own, and also doing basic benchmarks, I doubt that Set/Map are as slow as the simondev benchmarks imply.

`Set`s seem incredibly fast:

- https://jsbench.me/zfl7ogu64g
- https://jsbench.me/1al7oha7ln

### 2022-09-05

Basic collision overlaps are working! The miasma is clumping.

### 2022-09-06

Created a player abilities component to hold a future offensive ability.
const json = { "frames": {
   "walk_0": {
    "frame": { "x": 9, "y": 0, "w": 9, "h": 12 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 4, "y": 2, "w": 9, "h": 12 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "walk_1": {
    "frame": { "x": 9, "y": 12, "w": 7, "h": 13 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 5, "y": 1, "w": 7, "h": 13 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "walk_2": {
    "frame": { "x": 18, "y": 0, "w": 8, "h": 12 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 4, "y": 2, "w": 8, "h": 12 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "walk_3": {
    "frame": { "x": 16, "y": 12, "w": 7, "h": 13 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 5, "y": 1, "w": 7, "h": 13 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "flick_4": {
    "frame": { "x": 0, "y": 0, "w": 9, "h": 13 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 4, "y": 1, "w": 9, "h": 13 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "flick_5": {
    "frame": { "x": 18, "y": 0, "w": 8, "h": 12 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 4, "y": 2, "w": 8, "h": 12 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "test_6": {
    "frame": { "x": 0, "y": 13, "w": 8, "h": 8 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 0, "y": 0, "w": 8, "h": 8 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "test_7": {
    "frame": { "x": 0, "y": 13, "w": 8, "h": 8 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 8, "y": 0, "w": 8, "h": 8 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "test_8": {
    "frame": { "x": 0, "y": 13, "w": 8, "h": 8 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 8, "y": 8, "w": 8, "h": 8 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   },
   "test_9": {
    "frame": { "x": 0, "y": 13, "w": 8, "h": 8 },
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": { "x": 0, "y": 8, "w": 8, "h": 8 },
    "sourceSize": { "w": 16, "h": 16 },
    "duration": 200
   }
 },
 "meta": {
  "app": "https://www.aseprite.org/",
  "version": "1.2.39-arm64",
  "image": "atlas.png",
  "format": "RGBA8888",
  "size": { "w": 26, "h": 25 },
  "scale": "1",
  "frameTags": [
   { "name": "walk", "from": 0, "to": 3, "direction": "forward" },
   { "name": "flick", "from": 4, "to": 5, "direction": "forward" },
   { "name": "test", "from": 6, "to": 9, "direction": "forward" }
  ]
 }
} as const; export default json;
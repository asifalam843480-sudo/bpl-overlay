# BPL Premium OBS — Stable Multi-Image Build

This build is tuned for OBS Custom Browser Docks + Browser Source.

Key stability fixes:
- image references stay independent for every player/logo/profile/versus image
- text/score state updates never intentionally erase already visible photos
- lightweight BroadcastChannel state cannot blank images while SharedWorker image bytes are still arriving
- the last successfully rendered photo is retained until a replacement image is ready
- multiple image relay packets are cached by unique reference
- existing HD photo storage and crop fallback are preserved

OBS URLs remain unchanged when this package is uploaded to GitHub Pages.

Important: replace the repository files with the complete contents of this package. Keep `sync-worker.js` in the repository root.

# BPL Premium OBS — Photo Save Stable Final

This build keeps the existing BPL overlay/admin design and fixes the OBS photo-save path.

Key fixes:
- OBS-safe JPEG canvas encoding with a hard timeout.
- Synchronous dataURL fallback when embedded Chromium `toBlob()` is unreliable.
- Original File fallback if cropping/encoding fails, so a selected photo is not lost.
- Images are staged in memory immediately; IndexedDB/Cache persistence is best-effort.
- Unique image references prevent one photo from overwriting another.
- SharedWorker relay remains the live Admin Dock → Scoreboard transport.
- Redundant second SharedWorker admin relay removed to avoid duplicate/racing state transport.
- Existing match engine, Profile, Versus, Winner and scoreboard behavior preserved.

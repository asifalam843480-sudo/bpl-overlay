# BPL Premium OBS Image-Safe Final

Use the extracted files directly in the GitHub Pages repository root.
Important files: index.html, admin.html, script.js, style.css, sync-worker.js.
This build uses an independent per-image ArrayBuffer relay through SharedWorker so multiple player/profile/versus photos can coexist across OBS Custom Browser Dock and Browser Source contexts without relying on shared IndexedDB.

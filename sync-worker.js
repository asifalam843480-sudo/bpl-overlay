// BPL OBS LIVE RELAY — robust multi-image SharedWorker
// Keeps state and every image independently, so adding a second/third photo never replaces the first.
const ports = new Set();
let latestState = null;
const latestImages = new Map(); // ref -> {field, mime, buffer}

function safePost(port, msg, transfer=[]) { try { port.postMessage(msg, transfer); } catch(e) {} }
function broadcast(msg, except=null) { for (const p of ports) if (p !== except) safePost(p, msg); }
function sendImage(port, ref, item) {
  if (!item || !item.buffer) return;
  const copy = item.buffer.slice(0);
  safePost(port, {type:'imageArrayBuffer', ref, field:item.field || '', mime:item.mime || 'image/webp', buffer:copy}, [copy]);
}
function snapshotTo(port) {
  if (latestState) safePost(port, {type:'state', data:latestState});
  for (const [ref,item] of latestImages) sendImage(port, ref, item);
}

onconnect = function(event) {
  const port = event.ports[0];
  ports.add(port);
  port.start();
  snapshotTo(port);
  port.onmessage = async function(ev) {
    const m = ev && ev.data;
    if (!m) return;
    if (m.type === 'hello') { snapshotTo(port); return; }
    if (m.type === 'state' && m.data) {
      latestState = m.data;
      broadcast({type:'state', data:m.data}, port);
      return;
    }
    if (m.type === 'imageArrayBuffer' && m.ref && m.buffer) {
      // Clone into worker-owned memory before broadcasting so the cached copy stays valid.
      const buffer = m.buffer.slice(0);
      latestImages.set(m.ref, {field:m.field || '', mime:m.mime || 'image/webp', buffer});
      for (const p of ports) {
        if (p === port) continue;
        const copy = buffer.slice(0);
        safePost(p, {type:'imageArrayBuffer', ref:m.ref, field:m.field || '', mime:m.mime || 'image/webp', buffer:copy}, [copy]);
      }
      return;
    }
    if (m.type === 'clearImages') { latestImages.clear(); broadcast({type:'clearImages'}, port); return; }
    if (m.type === 'clearAll') { latestState = null; latestImages.clear(); broadcast({type:'clearAll'}, port); return; }
  };
  port.addEventListener('messageerror', () => {});
};

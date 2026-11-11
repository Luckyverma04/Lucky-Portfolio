// The hero 3D scene calls markHeroReady() after its first frames are drawn.
// The loader waits for it, so the robot is already there when the loader lifts.
export function markHeroReady() {
  if (window.__heroReady) return;
  window.__heroReady = true;
  window.dispatchEvent(new Event("hero-ready"));
}
export const heroReady = () => !!window.__heroReady;

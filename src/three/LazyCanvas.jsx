import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { heroReady } from "../lib/ready";

// Three.js loads only when a 3D scene is needed, so the text of the page shows first.
const Canvas = lazy(() => import("@react-three/fiber").then((m) => ({ default: m.Canvas })));

export function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

// One shared "is the page scrolling right now" flag for every canvas.
const subs = new Set();
let scrolling = false, timer;
function onScroll() {
  if (!scrolling) { scrolling = true; subs.forEach((f) => f(true)); }
  clearTimeout(timer);
  timer = setTimeout(() => { scrolling = false; subs.forEach((f) => f(false)); }, 140);
}
function useScrolling() {
  const [s, set] = useState(false);
  useEffect(() => {
    if (!subs.size) window.addEventListener("scroll", onScroll, { passive: true });
    subs.add(set);
    return () => { subs.delete(set); if (!subs.size) window.removeEventListener("scroll", onScroll); };
  }, []);
  return s;
}

/**
 * A Canvas that
 * - draws only while it is on screen,
 * - holds still while the page is scrolling (scroll stays smooth, the 3D picks up right after),
 * - with `preload`, gets built in a quiet moment after the hero is ready, so its shaders are
 *   compiled before you scroll to it instead of stalling the scroll.
 */
export default function LazyCanvas({ children, className = "", fallback = null, preload = false, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(!preload);
  const [ok] = useState(hasWebGL);
  const busy = useScrolling();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); if (e.isIntersecting) setMounted(true); }, { rootMargin: "150px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!preload || mounted) return;
    let id, t;
    const go = () => { t = setTimeout(() => { id = (window.requestIdleCallback || ((f) => setTimeout(f, 1)))(() => setMounted(true), { timeout: 3000 }); }, 1200); };
    if (heroReady() || window.location.pathname !== "/") go(); else window.addEventListener("hero-ready", go, { once: true });
    return () => { clearTimeout(t); window.cancelIdleCallback?.(id); window.removeEventListener("hero-ready", go); };
  }, [preload, mounted]);

  // off screen: "demand" draws once when built (compiles shaders) and then waits
  const frameloop = visible ? (busy ? "never" : "always") : "demand";
  return (
    <div ref={ref} className={className}>
      {ok && mounted ? (
        <Suspense fallback={fallback}>
          <Canvas
            frameloop={frameloop}
            dpr={[1, Math.min(1.25, window.devicePixelRatio || 1)]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            {...props}
          >
            {children}
          </Canvas>
        </Suspense>
      ) : fallback}
    </div>
  );
}

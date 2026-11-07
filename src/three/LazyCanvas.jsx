import { lazy, Suspense, useEffect, useRef, useState } from "react";

// Three.js loads only when a 3D scene is needed, so the text of the page shows first.
const Canvas = lazy(() => import("@react-three/fiber").then((m) => ({ default: m.Canvas })));

export function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

/** A Canvas that only renders frames while it is on screen, so several scenes on one page stay cheap. */
export default function LazyCanvas({ children, className = "", fallback = null, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ok] = useState(hasWebGL);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {ok ? (
        <Suspense fallback={fallback}>
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, Math.min(1.5, window.devicePixelRatio || 1)]}
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

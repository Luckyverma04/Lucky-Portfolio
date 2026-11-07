import { useEffect, useRef } from "react";

/** A soft dot that trails the mouse and grows over links and buttons. Hidden on touch screens. */
export default function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const el = ref.current;
    el.style.opacity = "0"; // hidden until the mouse first moves
    let x = -100, y = -100, cx = x, cy = y, raf;
    let running = false;
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.3) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const move = (e) => {
      if (el.style.opacity === "0") { cx = e.clientX; cy = e.clientY; el.style.opacity = ""; }
      x = e.clientX; y = e.clientY;
      el.classList.toggle("big", !!e.target.closest?.("a, button, [data-cursor]"));
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
    };
    const out = () => { el.style.opacity = "0"; };
    const over = () => { el.style.opacity = ""; };
    document.documentElement.addEventListener("mouseleave", out);
    document.documentElement.addEventListener("mouseenter", over);
    window.addEventListener("mousemove", move, { passive: true });
    return () => { window.removeEventListener("mousemove", move); document.documentElement.removeEventListener("mouseleave", out); document.documentElement.removeEventListener("mouseenter", over); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor" aria-hidden="true" />;
}

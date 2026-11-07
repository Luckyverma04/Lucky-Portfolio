import { useEffect, useRef } from "react";

/** A soft dot that trails the mouse and grows over links and buttons. Hidden on touch screens. */
export default function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const el = ref.current;
    let x = -100, y = -100, cx = x, cy = y, raf;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      el.classList.toggle("big", !!e.target.closest?.("a, button, [data-cursor]"));
    };
    const loop = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const out = () => { el.style.opacity = "0"; };
    const over = () => { el.style.opacity = ""; };
    document.documentElement.addEventListener("mouseleave", out);
    document.documentElement.addEventListener("mouseenter", over);
    window.addEventListener("mousemove", move, { passive: true });
    loop();
    return () => { window.removeEventListener("mousemove", move); document.documentElement.removeEventListener("mouseleave", out); document.documentElement.removeEventListener("mouseenter", over); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor" aria-hidden="true" />;
}

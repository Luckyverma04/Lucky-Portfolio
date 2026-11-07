import { useRef } from "react";

/** Tilts its child in 3D toward the mouse and adds a moving shine. */
export default function Tilt({ children, className = "", max = 7 }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1100px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
    el.style.setProperty("--sx", `${px * 100}%`);
    el.style.setProperty("--sy", `${py * 100}%`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} className={`relative h-full transition-transform duration-200 ease-out will-change-transform ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {children}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-300 [div:hover>&]:opacity-100"
        style={{ background: "radial-gradient(500px circle at var(--sx) var(--sy), rgb(var(--brand) / .10), transparent 40%)" }} />
    </div>
  );
}

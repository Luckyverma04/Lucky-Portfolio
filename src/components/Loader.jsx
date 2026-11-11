import { useEffect, useRef, useState } from "react";
import { heroReady } from "../lib/ready";
import { hasWebGL } from "../three/LazyCanvas";

const STEPS = [
  [0, "Booting up…"],
  [25, "Waking up the robot…"],
  [55, "Loading the 3D scene…"],
  [80, "Polishing the glow…"],
  [100, "Ready!"],
];
const MIN_MS = 1200; // never just a flash
const MAX_MS = 6000; // never keeps anyone waiting longer than this

/**
 * Intro screen that shows real progress: page files, then the hero 3D scene. It lifts once the
 * robot is drawn, so the first thing people see is the finished hero, not a blank one.
 */
export default function Loader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState(false);
  const target = useRef(10);
  const finish = useRef(() => {});

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDone(true); setGone(true); return; }
    document.documentElement.style.overflow = "hidden";
    const t0 = performance.now();
    // only the home page has the 3D hero to wait for
    const wait3D = window.location.pathname === "/" && hasWebGL();
    const bump = (v) => { target.current = Math.max(target.current, v); };

    const onLoad = () => bump(wait3D ? 70 : 100);
    const onHero = () => bump(100);
    if (document.readyState === "complete") onLoad(); else window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => bump(35));
    if (heroReady()) onHero(); else window.addEventListener("hero-ready", onHero);

    let cur = 0, raf;
    finish.current = () => { target.current = 100; cur = 100; setN(100); };
    const tick = () => {
      const t = performance.now() - t0;
      if (t > MAX_MS) target.current = 100;
      // ease toward the target, and creep slowly so it never looks frozen
      cur += (target.current - cur) * 0.06 + (cur < target.current - 1 ? 0.12 : 0);
      if (target.current < 100) cur = Math.min(cur, 97);
      setN(Math.min(100, Math.round(cur)));
      if (cur >= 99.5 && t > MIN_MS) { setN(100); setTimeout(() => setDone(true), 250); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const s = setTimeout(() => setSkip(true), 2000);
    return () => { cancelAnimationFrame(raf); clearTimeout(s); window.removeEventListener("load", onLoad); window.removeEventListener("hero-ready", onHero); };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;
  const status = [...STEPS].reverse().find(([v]) => n >= v)[1];

  return (
    <div className={`loader ${done ? "done" : ""}`} role="status" aria-live="polite" aria-label={`Loading, ${n} percent`}>
      <div className="loader-panel" aria-hidden="true" />
      <div className="loader-inner flex w-[min(320px,80vw)] flex-col items-center text-center">
        {/* little robot face, same character as the 3D one */}
        <div className="loader-bot" aria-hidden="true">
          <span className="loader-antenna" />
          <div className="loader-face">
            <span className="loader-eye" /><span className="loader-eye" />
            <span className="loader-smile" />
          </div>
        </div>
        <p className="mt-7 text-2xl font-extrabold uppercase tracking-tight">Lucky <span className="grad-text">Verma</span></p>
        <p className="mt-1 text-xs uppercase tracking-[.25em] text-muted">Backend &amp; MERN developer</p>

        <div className="mt-8 flex w-full items-end justify-between">
          <span className="text-left text-sm text-ink/80">{status}</span>
          <span className="font-mono text-3xl font-bold tabular-nums text-brand">{n}<span className="text-base text-muted">%</span></span>
        </div>
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
          <div className="loader-bar h-full rounded-full" style={{ width: `${n}%` }} />
        </div>

        <button type="button" onClick={() => finish.current()}
          className={`mt-8 text-xs uppercase tracking-[.2em] text-muted transition-opacity duration-500 hover:text-brand ${skip && !done ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          Skip intro →
        </button>
      </div>
    </div>
  );
}

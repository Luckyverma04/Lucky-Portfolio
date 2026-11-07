import { useEffect, useState } from "react";

/** Short intro screen with a counter. Fades away once the page has loaded (max ~2.5s). */
export default function Loader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDone(true); return; }
    let loaded = document.readyState === "complete";
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);
    const t0 = performance.now();
    const id = setInterval(() => {
      setN((v) => {
        const cap = loaded || performance.now() - t0 > 2500 ? 100 : 90;
        const next = Math.min(cap, v + Math.ceil(Math.random() * 7));
        if (next >= 100) { clearInterval(id); setTimeout(() => setDone(true), 300); }
        return next;
      });
    }, 40);
    return () => { clearInterval(id); window.removeEventListener("load", onLoad); };
  }, []);
  return (
    <div className={`loader ${done ? "done" : ""}`} aria-hidden="true">
      <div className="w-56 text-center">
        <p className="text-3xl font-extrabold tracking-tight">L<span className="text-brand">V</span></p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[.3em] text-muted">Loading {n}%</p>
        <div className="mt-3 h-[2px] w-full bg-ink/10"><div className="loader-bar" style={{ width: `${n}%` }} /></div>
      </div>
    </div>
  );
}

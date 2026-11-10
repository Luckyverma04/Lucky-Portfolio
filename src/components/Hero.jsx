import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LazyCanvas from "../three/LazyCanvas";
import { profile, mailHref } from "../data/content";

const HeroScene = lazy(() => import("../three/HeroScene"));
const ROLES = ["Backend", "MERN Stack", "Next.js", "Full-Stack"];
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Letters({ text, start = 0 }) {
  return (
    <span className="rise" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ animationDelay: `${start + i * 45}ms` }}>{ch === " " ? " " : ch}</span>
      ))}
    </span>
  );
}

function Swap() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(() => setI((x) => (x + 1) % ROLES.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="swap">
      {ROLES.map((r, k) => <span key={r} className={"grad-text " + (k === i ? "on" : k === (i - 1 + ROLES.length) % ROLES.length ? "off" : "")} aria-hidden={k !== i}>{r}</span>)}
    </span>
  );
}

function useMobile() {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    const on = () => setM(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return m;
}

export default function Hero() {
  const ref = useRef(null);
  const mobile = useMobile();
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.open(mailHref, "_blank", "noopener"); }
  };

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* 3D character behind the text */}
      <LazyCanvas
        className="absolute inset-0"
        camera={{ position: [0, 0.2, 8], fov: 35 }}
        eventSource={ref}
        eventPrefix="client"
      >
        <Suspense fallback={null}><HeroScene mobile={mobile} /></Suspense>
      </LazyCanvas>

      <div className="wrap pointer-events-none relative flex h-full flex-col justify-between pb-10 pt-24 md:justify-center md:pb-0 md:pt-0">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
          <div>
            <p className="text-lg font-medium text-brand md:text-2xl">Hello! I'm</p>
            <h1 className="h-display mt-1 text-[clamp(44px,8vw,104px)] text-ink/90">
              <Letters text="Lucky" start={300} /><br /><Letters text="Verma" start={550} />
            </h1>
          </div>
          <div className="md:pt-24 md:text-right">
            <p className="text-base font-medium text-pink md:text-2xl">Developer for</p>
            <p className="h-display mt-1 text-[clamp(34px,5.4vw,72px)] text-ink/90">
              <Swap /><span className="sr-only">Backend, MERN Stack, Next.js and Full-Stack</span>
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-center gap-4 md:absolute md:inset-x-0 md:bottom-10">
          <p className="max-w-[34ch] text-center text-sm leading-relaxed text-ink/75 [text-shadow:0_1px_12px_rgb(9_12_20),0_0_2px_rgb(9_12_20)] md:max-w-none md:text-[15px]">
            Node.js · Express · MongoDB · React <span className="text-ink/40">—</span> APIs, databases and the screens on top.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/projects" className="btn btn-primary">See my work</Link>
            <button type="button" onClick={copyEmail} className="btn">{copied ? "Email copied ✓" : "Copy email"}</button>
          </div>
          <span className="sr-only" role="status">{copied ? "Email address copied" : ""}</span>
          <a href="#work" aria-label="Scroll down" className="scroll-hint mt-2 hidden md:block" />
        </div>
      </div>
    </section>
  );
}

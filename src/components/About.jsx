import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { about, education, profile, projects } from "../data/content";

// Only numbers that can be checked in the repos or in the sections below.
const since = new Date(2025, 8, 1);
const now = new Date();
const months = Math.max(1, (now.getFullYear() - since.getFullYear()) * 12 + now.getMonth() - since.getMonth() + 1);
const FACTS = [
  { n: 1 + projects.length, label: "projects with public code" },
  { n: 13, label: "small React apps in one repo" },
  { n: 31, label: "platforms the BGV search can cover", pre: "up to " },
  { n: months, label: months === 1 ? "month at Trazoo" : "months at Trazoo" },
];

function Count({ to }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf, started = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      const t0 = performance.now();
      const tick = (t) => {
        const f = Math.min(1, (t - t0) / 1300);
        setV(Math.round(to * (1 - Math.pow(1 - f, 3))));
        if (f < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{v}</span>;
}

/** The first paragraph lights up word by word as you scroll past it. */
function ScrollText({ text }) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setP(1); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = Math.round(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35))) * 60) / 60;
      setP((old) => (old === v ? old : v));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-[clamp(22px,3.2vw,40px)] font-semibold leading-[1.25] tracking-tight">
      {words.map((w, i) => (
        <span key={i} style={{ color: i / words.length < p ? "rgb(var(--ink))" : "rgb(var(--ink) / .16)", transition: "color .25s" }}>{w} </span>
      ))}
    </p>
  );
}

export default function About() {
  const [hasPhoto, setHasPhoto] = useState(true);
  return (
    <section id="about" className="wrap relative py-24 md:py-32" aria-labelledby="about-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Reveal>
            <p className="eyebrow">About me</p>
            <h2 id="about-title" className="h-display mt-3 text-5xl md:text-6xl">Who<br /><span className="grad-text">am I?</span></h2>
            {hasPhoto && (
              <img src={profile.photo} alt={`Portrait of ${profile.name}`} onError={() => setHasPhoto(false)}
                className="frame mt-8 aspect-[4/5] w-full max-w-[260px] rounded-2xl object-cover" loading="lazy" />
            )}
          </Reveal>
        </div>
        <div className="lg:col-span-9">
          <ScrollText text={about[0]} />
          <Reveal className="mt-10 grid gap-6 text-[17px] leading-relaxed text-muted md:grid-cols-2">
            {about.slice(1).map((t) => <p key={t}>{t}</p>)}
          </Reveal>
          <Reveal className="mt-8">
            <p className="text-sm text-muted"><span className="text-brand">🎓</span> {education.degree} · {education.school}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {FACTS.map((f, i) => (
              <Reveal key={f.label} delay={i * 90}>
                <div className="card card-hover h-full p-5">
                  <p className="text-4xl font-extrabold tracking-tight md:text-5xl">
                    {f.pre && <span className="text-base font-medium text-muted">{f.pre}</span>}
                    <span className="grad-text"><Count to={f.n} /></span>
                  </p>
                  <p className="mt-2 text-sm text-muted">{f.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

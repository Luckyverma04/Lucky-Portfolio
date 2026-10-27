import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { Section } from "./Shared";
import { about, education, profile, projects } from "../data/content";

// Only numbers that can be checked in the repos or in the sections below.
const since = new Date(2026, 0, 1);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setV(to); return; }
    let raf, started = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      const t0 = performance.now();
      const tick = (t) => {
        const f = Math.min(1, (t - t0) / 1100);
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

export default function About() {
  const [hasPhoto, setHasPhoto] = useState(true);
  return (
    <Section n="01" id="about" eyebrow="About" title="A bit about me">
      <div className="grid gap-8 md:grid-cols-12">
        <Reveal className={hasPhoto ? "md:col-span-5 lg:col-span-4" : "hidden"}>
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            onError={() => setHasPhoto(false)}
            className="aspect-[4/5] w-full max-w-sm rounded-2xl border border-line object-cover"
          />
        </Reveal>
        <Reveal className={hasPhoto ? "md:col-span-7 lg:col-span-8" : "md:col-span-8"}>
          <div className="space-y-5 text-[17px] leading-relaxed text-ink/90">{about.map((t) => <p key={t}>{t}</p>)}</div>
          {hasPhoto && <div className="mt-8 max-w-md"><EduCard /></div>}
        </Reveal>
        {!hasPhoto && (
          <Reveal className="md:col-span-4" delay={100}>
            <EduCard />
          </Reveal>
        )}
      </div>

      <Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FACTS.map((f) => (
            <li key={f.label} className="card p-5">
              <p className="font-display text-5xl leading-none text-[rgb(var(--h1))] md:text-6xl">
                {f.pre && <span className="mr-1 align-middle font-mono text-xs normal-case tracking-normal text-muted">{f.pre}</span>}
                <Count to={f.n} />
              </p>
              <p className="mt-3 text-sm leading-snug text-muted">{f.label}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

// Card that tilts a little towards the pointer (CSS 3D, no library). Off for touch and reduced motion.
function EduCard() {
  const ref = useRef(null);
  const move = (e) => {
    if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave}
      className="card space-y-5 p-6 transition-transform duration-200 ease-out will-change-transform">
      <div><p className="eyebrow">Education</p><h3 className="mt-2 font-semibold leading-snug">{education.degree}</h3><p className="mt-1 text-sm text-muted">{education.school}</p></div>
      <hr className="border-line" />
      <div><p className="eyebrow">Based in</p><p className="mt-2 text-sm text-muted">{profile.location}</p></div>
    </div>
  );
}
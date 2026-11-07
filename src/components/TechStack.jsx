import { lazy, Suspense } from "react";
import Reveal from "./Reveal";
import LazyCanvas from "../three/LazyCanvas";
import { skills } from "../data/content";

const TechBalls = lazy(() => import("../three/TechBalls"));
const ALL = [...new Set(skills.flatMap((g) => g.items))];

function Row({ items, rev }) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className={`marquee ${rev ? "rev" : ""}`}>
        {[...items, ...items].map((s, i) => (
          <span key={i} className="mx-2 whitespace-nowrap rounded-full border border-line bg-surface/60 px-5 py-2 text-sm text-ink/80">{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function TechStack() {
  const half = Math.ceil(ALL.length / 2);
  return (
    <section id="skills" className="relative py-20 md:py-28" aria-labelledby="skills-title">
      <Reveal className="wrap text-center">
        <p className="eyebrow">Tech stack</p>
        <h2 id="skills-title" className="h-display mt-3 text-[clamp(40px,7vw,88px)]">My <span className="grad-text">techstack</span></h2>
        <p className="mt-4 text-muted">Move your mouse through the balls and push them around.</p>
      </Reveal>
      <LazyCanvas className="mx-auto mt-6 h-[460px] max-w-6xl md:h-[520px]" camera={{ position: [0, 0, 9], fov: 45 }} data-cursor>
        <Suspense fallback={null}><TechBalls /></Suspense>
      </LazyCanvas>
      <div className="mt-6 space-y-3">
        <Row items={ALL.slice(0, half)} />
        <Row items={ALL.slice(half)} rev />
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { Section, Stack, Links, Bullets } from "./Shared";
import { job } from "../data/content";
import Gallery from "./Gallery";
import { gallery } from "../data/gallery";
import logo from "../assets/trazoo-logo.png";

/** Vertical line that fills with light as you scroll through the lifecycle steps. */
function useFill() {
  const ref = useRef(null);
  const [f, setF] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const v = Math.round(Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height)) * 100) / 100;
      setF((old) => (old === v ? old : v));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return [ref, f];
}

export default function Experience() {
  const [ref, fill] = useFill();
  return (
    <Section id="experience" eyebrow="Career" title="My career" accent="& experience">
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="inline-grid h-16 w-40 place-items-center rounded-xl bg-white p-3">
              <img src={logo} alt="Trazoo Global logo" className="max-h-full w-auto" />
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-brand">{job.period}</p>
            <h3 className="mt-2 text-3xl font-extrabold uppercase tracking-tight">{job.role}</h3>
            <p className="mt-1 text-lg text-ink/80">{job.company}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{job.about}</p>
            <div className="mt-6"><Stack items={job.stack} /></div>
            <div className="mt-6"><Links p={job} liveLabel="Live site" /></div>
            <p className="mt-6 text-[13px] leading-relaxed text-muted">{job.companyNote}</p>
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          <Reveal><p className="text-lg leading-relaxed text-ink/90">{job.intro}</p></Reveal>

          <div ref={ref} className="relative mt-10 pl-10">
            <span className="absolute left-[11px] top-0 h-full w-[2px] bg-line" aria-hidden="true" />
            <span className="glow-line absolute left-[11px] top-0 w-[2px] rounded" style={{ height: `${fill * 100}%` }} aria-hidden="true" />
            <ol aria-label="Lead lifecycle" className="space-y-6">
              {job.lifecycle.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 80} className="relative">
                  <span className={`absolute -left-[37px] top-5 grid h-6 w-6 place-items-center rounded-full border-2 text-[10px] font-bold transition-colors ${fill > (i + 0.3) / job.lifecycle.length ? "border-brand bg-brand text-bg" : "border-line bg-bg text-muted"}`} aria-hidden="true">{i + 1}</span>
                  <div className="card card-hover p-5">
                    <p className="text-xl font-bold uppercase tracking-tight">{s.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{s.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal className="mt-12">
            <p className="eyebrow mb-5">What I did</p>
            <Bullets items={job.points} />
          </Reveal>
        </div>
      </div>

      {gallery(job.slug).length > 0 && (
        <Reveal className="mt-14">
          <p className="eyebrow mb-4">Screens from the platform</p>
          <Gallery images={gallery(job.slug)} title="Trazoo Global" thumbsOnly />
        </Reveal>
      )}
    </Section>
  );
}

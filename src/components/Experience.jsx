import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";
import { Section, Stack, Links, Bullets } from "./Shared";
import { job } from "../data/content";
import Gallery from "./Gallery";
import { gallery } from "../data/gallery";
import logo from "../assets/trazoo-logo.png";

const LeadFlow3D = lazy(() => import("./LeadFlow3D"));
function webgl() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

export default function Experience() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);
  const [noGl, setNoGl] = useState(() => typeof window !== "undefined" && !webgl());
  const onFail = useCallback(() => setNoGl(true), []);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return (
    <Section n="03" id="experience" eyebrow="Work" title="Where I work">
      <Reveal>
        <article className="card p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="inline-grid h-20 w-48 place-items-center rounded-xl bg-white p-3">
                <img src={logo} alt="Trazoo Global logo" className="max-h-full w-auto" />
              </div>
              <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">{job.period}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{job.role}</h3>
              <p className="mt-1 text-muted">{job.company}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{job.about}</p>
              <div className="mt-6"><Stack items={job.stack} /></div>
              <div className="mt-6"><Links p={job} liveLabel="Live site" /></div>
              <p className="mt-6 text-[13px] leading-relaxed text-muted">{job.companyNote}</p>
              {wide && !noGl && (
                <div className="mt-8 border-t border-line pt-6">
                  <p className="eyebrow">How a lead moves</p>
                  <Suspense fallback={<div className="h-[360px]" />}><LeadFlow3D onFail={onFail} /></Suspense>
                </div>
              )}
            </div>

            <div className="lg:col-span-8">
              <p className="eyebrow">Lead management</p>
              <p className="mt-3 leading-relaxed text-ink/90">{job.intro}</p>

              <ol className="mt-6 border-l border-line" aria-label="Lead lifecycle">
                {job.lifecycle.map((s, i) => (
                  <li key={s.title} className="relative grid gap-1 pb-5 pl-6 last:pb-0 sm:grid-cols-[110px_1fr] sm:gap-6">
                    <span className="absolute -left-[5px] top-[7px] h-[9px] w-[9px] rounded-full border border-brand bg-bg" aria-hidden="true" />
                    <p className="font-medium"><span className="mr-2 font-mono text-xs text-brand-soft">0{i + 1}</span>{s.title}</p>
                    <p className="text-[15px] leading-relaxed text-muted">{s.detail}</p>
                  </li>
                ))}
              </ol>

              <p className="eyebrow mb-4 mt-10">What I did</p>
              <Bullets items={job.points} />
            </div>
          </div>

          {gallery(job.slug).length > 0 && (
            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow mb-4">Screens from the platform</p>
              <Gallery images={gallery(job.slug)} title="Trazoo Global" thumbsOnly />
            </div>
          )}
        </article>
      </Reveal>
    </Section>
  );
}
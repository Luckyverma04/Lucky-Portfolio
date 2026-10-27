import Reveal from "./Reveal";
import { Section, Stack, Links, Bullets, ML } from "./Shared";
import Gallery from "./Gallery";
import { gallery } from "../data/gallery";
import { bgv, projects } from "../data/content";

function Featured() {
  return (
    <Reveal>
      <article className="card relative overflow-hidden p-6 md:p-10" style={{ borderColor: "rgb(var(--violet) / .35)" }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, var(--glow-b), transparent 70%)" }} aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow !text-violet-soft">{bgv.kicker}</span>
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{bgv.status}</span>
          </div>
          <h3 className="h-display mt-3 text-3xl md:text-4xl">{bgv.title}</h3>
          <p className="mt-4 max-w-3xl text-[16.5px] leading-relaxed text-muted">{bgv.summary}</p>

          {gallery(bgv.slug).length > 0 && <div className="mt-8"><Gallery images={gallery(bgv.slug)} title={bgv.title} /></div>}

          <ol className="mt-8 grid gap-2 sm:grid-cols-5" aria-label="How the pipeline runs">
            {bgv.pipeline.map((s, i) => (
              <li key={s.step} className="rounded-xl border border-line bg-bg/60 p-4">
                <span className={`font-mono text-xs ${i === 3 ? "text-violet-soft" : "text-brand-soft"}`}>0{i + 1}</span>
                <p className="mt-1 font-medium">{s.step}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{s.detail}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="eyebrow !text-muted">What I built</p>
              <div className="mt-4"><Bullets items={bgv.built} /></div>
            </div>
            <aside className="md:col-span-4">
              <div className="rounded-xl border border-line bg-bg/60 p-5">
                <p className="eyebrow !text-violet-soft">A match is not a verification</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{bgv.caveat}</p>
              </div>
            </aside>
          </div>

          <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
            <Stack items={bgv.stack} ml={ML} />
            <div className="shrink-0"><Links p={bgv} /></div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Card({ p, wide, delay }) {
  return (
    <Reveal delay={delay} className={wide ? "md:col-span-2" : ""}>
      <article className={`card card-hover spot grid h-full gap-5 p-5 md:p-6 ${wide ? "lg:grid-cols-2 lg:items-center lg:gap-8" : ""}`}>
        <div className="self-start"><Gallery images={gallery(p.slug)} title={p.title} stacked /></div>
        <div className="flex flex-col justify-between gap-5">
          <div>
            <p className="eyebrow">{p.kicker}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.summary}</p>
            <div className="mt-4"><Bullets items={p.points} /></div>
          </div>
          <div className="space-y-4"><Stack items={p.stack} /><Links p={p} /></div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <Section  id="projects" eyebrow="Projects" title="Things I've built" intro="Personal projects. The work I do at Trazoo is in the section above.">
      <div className="space-y-5">
        <Featured />
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => <Card key={p.title} p={p} wide={i === 0} delay={i * 80} />)}
        </div>
      </div>
    </Section>
  );
}
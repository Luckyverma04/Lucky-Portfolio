import Reveal from "./Reveal";
import { Arrow, Github, Mail } from "./Icons";
import { profile } from "../data/content";

function Flow({ label, violet = false, h = 44 }) {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center" style={{ height: h }} aria-hidden="true">
      <div className="relative h-full w-3">
        <svg width="12" height="100%" className="absolute inset-0" preserveAspectRatio="none">
          <line x1="6" y1="0" x2="6" y2="100%" stroke={violet ? "rgb(var(--violet))" : "rgb(var(--brand))"} strokeWidth="1.5" className="flow-line" />
        </svg>
        <span className={`packet ${violet ? "v" : ""}`} />
      </div>
      <span className="absolute left-1/2 ml-5 rounded-md border border-line bg-bg px-2 py-0.5 font-mono text-[11px] text-muted">{label}</span>
    </div>
  );
}

function Node({ label, sub, violet = false }) {
  return (
    <div className="spot card flex items-center justify-between !rounded-xl px-4 py-3" style={{ background: "rgb(var(--bg) / .6)" }}>
      <span className="flex items-center gap-3 font-medium">
        <span className={`live-dot h-2 w-2 rounded-full ${violet ? "bg-violet" : "bg-brand"}`} />
        {label}
      </span>
      <span className="font-mono text-xs text-muted">{sub}</span>
    </div>
  );
}

function StackGraphic() {
  return (
    <div className="card p-5 md:p-6" role="img" aria-label="Stack I work across: a React app calls an Express API, which uses MongoDB and, in the BGV project, a Python ML service">
      <p className="eyebrow !text-muted">Stack I work across</p>
      <div className="mt-5">
        <Node label="React" sub="Interface" />
        <Flow label="POST /api/enquiry" />
        <Node label="Express API" sub="REST · JWT auth" />
        <Flow label="Mongoose" />
        <Node label="MongoDB" sub="Leads, bookings, runs" />
        <div className="my-4 flex items-center gap-3 text-[11px] text-muted"><span className="h-px flex-1 bg-line" />BGV project<span className="h-px flex-1 bg-line" /></div>
        <Node label="Express API" sub="Node.js" />
        <Flow label="similarity request" violet h={36} />
        <Node label="ML service" sub="Python · FastAPI · BGE-M3" violet />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="hero-glow relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="flex items-center gap-2.5 font-mono text-sm text-muted">
              <span className="live-dot h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              Hi, I'm {profile.name}..
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="h-display mt-4 text-[clamp(36px,5.8vw,64px)]">
              Building Reliable <span className="grad-text grad-move">Backend Systems</span> &amp; Practical Web Applications
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              I'm a backend-leaning full-stack developer working with Node.js, Express, MongoDB and React. Most of what I build is APIs, databases and the screens on top of them. At Trazoo I work on the lead system the sales team uses every day. On my own, I've been building a background-verification tool that uses an embedding model to rank search results.
            </p>
          </Reveal>
          <Reveal delay={210} className="mt-8 flex flex-wrap gap-3">
            <a href="#experience" className="btn btn-primary">See my work <Arrow /></a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn"><Github /> GitHub</a>
            <a href="#contact" className="btn"><Mail /> Contact me</a>
          </Reveal>
        </div>
        <Reveal delay={200} className="lg:col-span-5"><StackGraphic /></Reveal>
      </div>
    </section>
  );
}

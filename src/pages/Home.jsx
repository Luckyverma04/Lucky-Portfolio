import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import WhatIDo from "../components/WhatIDo";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";
import usePageTitle from "../components/usePageTitle";
import { allProjects } from "../data/projects";
import { job } from "../data/content";
import logo from "../assets/trazoo-logo.png";

export default function Home() {
  usePageTitle("");
  return (
    <>
      <Hero />
      <WhatIDo />

      {/* a few projects, the rest live on /projects */}
      <section className="wrap py-20 md:py-24" aria-labelledby="work-preview">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-preview" className="h-display mt-3 text-[clamp(40px,7vw,88px)]">Recent <span className="grad-text">projects</span></h2>
          </div>
          <Link to="/projects" className="btn">All {allProjects.length} projects →</Link>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allProjects.slice(0, 3).map((p, i) => <Reveal key={p.slug} delay={i * 80}><ProjectCard p={p} /></Reveal>)}
        </div>
      </section>

      <section className="wrap pb-20 md:pb-24" aria-label="Current job">
        <Reveal>
          <Link to="/experience" className="card card-hover group grid items-center gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:p-8">
            <span className="inline-grid h-16 w-40 place-items-center rounded-xl bg-white p-3"><img src={logo} alt="Trazoo Global logo" className="max-h-full w-auto" /></span>
            <span>
              <span className="eyebrow">Currently · {job.period}</span>
              <span className="mt-2 block text-2xl font-extrabold uppercase tracking-tight md:text-3xl">{job.role} at {job.company}</span>
              <span className="mt-1 block text-muted">Lead and enquiry system for a live B2B gifting platform.</span>
            </span>
            <span className="text-sm font-semibold text-brand">My career <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
          </Link>
        </Reveal>
      </section>

      <section className="wrap pb-24 text-center md:pb-32" aria-label="Contact">
        <Reveal>
          <p className="h-display text-[clamp(52px,10vw,130px)]">Let's <span className="grad-text">talk</span></p>
          <p className="mx-auto mt-4 max-w-md text-muted">Open to backend and full-stack roles. Got a project or a question? Send a note.</p>
          <Link to="/contact" className="btn btn-primary mt-8 !px-7 !py-3.5">Get in touch →</Link>
        </Reveal>
      </section>
    </>
  );
}

import { lazy, Suspense, useState } from "react";
import Reveal from "./Reveal";
import LazyCanvas from "../three/LazyCanvas";
import { Stack } from "./Shared";
import { skills } from "../data/content";

const DeskScene = lazy(() => import("../three/DeskScene"));

const AREAS = [
  {
    title: "Backend", sub: "APIs and data that hold up",
    text: "REST APIs in Express on MongoDB: data models, JWT auth, background emails, caching, retries and fallbacks when another service is slow.",
    tools: skills.find((s) => s.group === "Backend").items,
  },
  {
    title: "Frontend", sub: "Screens people use every day",
    text: "React dashboards for admins and associates, responsive layouts in Tailwind, and SEO setup for live sites.",
    tools: skills.find((s) => s.group === "Frontend").items,
  },
  {
    title: "ML & AI", sub: "Models behind an API",
    text: "Wrapping models like BGE-M3 in a small Python service and calling it safely from Node, with caching and a circuit breaker.",
    tools: skills.find((s) => s.ml).items, ml: true,
  },
];

export default function WhatIDo() {
  const [open, setOpen] = useState(0);
  return (
    <section id="work" className="relative overflow-hidden py-20 md:py-28" aria-labelledby="work-title">
      <div className="wrap grid items-center gap-10 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <Reveal className="relative z-10">
            <p className="eyebrow">What I do</p>
            <h2 id="work-title" className="h-display mt-3 text-[clamp(52px,9vw,120px)]">What<br />I <span className="grad-text">do</span></h2>
          </Reveal>
          <LazyCanvas className="-mt-16 h-[380px] md:-mt-28 md:h-[560px]" camera={{ position: [6.2, 2.6, 6.2], fov: 32 }}>
            <Suspense fallback={null}><DeskScene /></Suspense>
          </LazyCanvas>
        </div>
        <div className="space-y-4 lg:col-span-5">
          {AREAS.map((a, i) => {
            const on = open === i;
            return (
              <Reveal key={a.title} delay={i * 100}>
                <div className={`card frame overflow-hidden transition-colors ${on ? "border-brand/40" : ""}`}>
                  <button type="button" onClick={() => setOpen(on ? -1 : i)} aria-expanded={on}
                    className="flex w-full items-start justify-between gap-4 p-6 text-left">
                    <span>
                      <span className="block text-2xl font-extrabold uppercase tracking-tight md:text-3xl">{a.title}</span>
                      <span className={`mt-1 block text-sm ${a.ml ? "text-violet-soft" : "text-brand"}`}>{a.sub}</span>
                    </span>
                    <span className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line transition-transform ${on ? "rotate-180" : ""}`} aria-hidden="true">⌄</span>
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6">
                        <p className="text-[15px] leading-relaxed text-muted">{a.text}</p>
                        <div className="mt-4"><Stack items={a.tools} ml={a.ml ? a.tools : []} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

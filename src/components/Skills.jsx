import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import Reveal from "./Reveal";
import { Section, Stack } from "./Shared";
import { skills } from "../data/content";

const SkillSphere3D = lazy(() => import("./SkillSphere3D"));

// Shorter names so they fit on the globe. The cards below keep the full wording.
const SHORT = {
  "Data Structures & Algorithms": "DSA", "JWT Authentication": "JWT", "Database Design": "DB design",
  "Embeddings (BGE-M3)": "BGE-M3", "ML service integration": "ML service", "Semantic similarity": "Similarity",
  "Model evaluation": "Model eval", "CNN fundamentals": "CNN basics", "Machine Learning": "ML",
};
const toneOf = (g) => (g.ml ? "violet" : g.group === "Backend" || g.group === "Programming & CS" ? "brand" : "ink");

function webgl() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

const LEGEND = [
  ["bg-brand", "Backend and CS"],
  ["bg-ink", "Frontend and tools"],
  ["bg-violet", "ML (studied, not run in production)"],
];

export default function Skills() {
  const [noGl, setNoGl] = useState(() => typeof window !== "undefined" && !webgl());
  const onFail = useCallback(() => setNoGl(true), []);
  const items = useMemo(() => {
    const seen = new Set(), out = [];
    skills.forEach((g) => g.items.forEach((label) => {
      if (seen.has(label)) return;
      seen.add(label); out.push({ label: SHORT[label] || label, tone: toneOf(g) });
    }));
    return out;
  }, []);

  return (
    <Section n="02" id="skills" eyebrow="Skills" title="Tools I use">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {!noGl && (
          <Reveal className="md:col-span-2 lg:col-span-6">
            <div className="card overflow-hidden p-6 md:p-8">
              <div className="grid items-center gap-6 md:grid-cols-12">
                <div className="md:col-span-5">
                  <p className="eyebrow">The whole toolbox</p>
                  <h3 className="font-display mt-3 text-4xl leading-none text-[rgb(var(--h1))] md:text-5xl">Everything I've used, on one globe</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted">Drag it to turn it, or hover a name. The cards below list the same tools by area.</p>
                  <ul className="mt-5 space-y-2 text-sm text-muted">
                    {LEGEND.map(([dot, text]) => <li key={text} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${dot}`} />{text}</li>)}
                  </ul>
                </div>
                <div className="md:col-span-7">
                  <Suspense fallback={<div className="h-[340px] md:h-[420px]" />}><SkillSphere3D items={items} onFail={onFail} /></Suspense>
                </div>
              </div>
            </div>
          </Reveal>
        )}
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 60} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="card card-hover spot h-full p-6">
              <p className="eyebrow">{g.group}</p>
              <div className="mt-4"><Stack items={g.items} ml={g.ml ? g.items : []} /></div>
              {g.note && <p className="mt-4 text-[13px] leading-relaxed text-muted">{g.note}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
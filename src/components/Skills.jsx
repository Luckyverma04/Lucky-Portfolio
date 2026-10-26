import Reveal from "./Reveal";
import { Section, Stack } from "./Shared";
import { skills } from "../data/content";

export default function Skills() {
  return (
    <Section  id="skills" eyebrow="Skills" title="Tools I use">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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

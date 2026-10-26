import { useState } from "react";
import Reveal from "./Reveal";
import { Section } from "./Shared";
import { about, education, profile } from "../data/content";

export default function About() {
  const [hasPhoto, setHasPhoto] = useState(true);
  return (
    <Section id="about" eyebrow="About" title="A bit about me">
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
    </Section>
  );
}

function EduCard() {
  return (
    <div className="card space-y-5 p-6">
      <div><p className="eyebrow">Education</p><h3 className="mt-2 font-semibold leading-snug">{education.degree}</h3><p className="mt-1 text-sm text-muted">{education.school}</p></div>
      <hr className="border-line" />
      <div><p className="eyebrow">Based in</p><p className="mt-2 text-sm text-muted">{profile.location}</p></div>
    </div>
  );
}

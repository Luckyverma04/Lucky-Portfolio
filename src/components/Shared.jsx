import Reveal from "./Reveal";
import { Arrow, Github } from "./Icons";

export const ML = ["Python", "FastAPI", "BGE-M3", "sentence-transformers"];

export const Stack = ({ items, ml = [] }) => (
  <ul className="flex flex-wrap gap-2">
    {items.map((t) => <li key={t} className={`chip ${ml.includes(t) ? "chip-ml" : ""}`}>{t}</li>)}
  </ul>
);

export const Links = ({ p, liveLabel = "Live demo" }) => (
  <div className="flex flex-wrap gap-2">
    {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary !py-2.5">{liveLabel} <Arrow /></a>}
    {p.code && <a href={p.code} target="_blank" rel="noreferrer" className="btn !py-2.5"><Github /> {p.backend ? "Frontend" : "GitHub"}</a>}
    {p.backend && <a href={p.backend} target="_blank" rel="noreferrer" className="btn !py-2.5"><Github /> Backend</a>}
  </div>
);

export const Bullets = ({ items }) => (
  <ul className="space-y-2.5 text-[15px] leading-relaxed">
    {items.map((pt) => (
      <li key={pt} className="flex gap-3">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_10px_rgb(var(--brand))]" />
        <span className="text-ink/90">{pt}</span>
      </li>
    ))}
  </ul>
);

export function Section({ id, eyebrow, title, accent, intro, children, className = "" }) {
  return (
    <section id={id} className={`wrap relative py-20 md:py-28 ${className}`} aria-labelledby={`${id}-title`}>
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="h-display mt-3 text-[clamp(40px,7vw,88px)]">
          {title} {accent && <span className="grad-text">{accent}</span>}
        </h2>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      </Reveal>
      <div className="mt-12 md:mt-16">{children}</div>
    </section>
  );
}

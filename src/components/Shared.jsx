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
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
        <span className="text-ink/90">{pt}</span>
      </li>
    ))}
  </ul>
);

export function Section({ id, n, eyebrow, title, intro, children }) {
  return (
    <section id={id} className="wrap py-16 md:py-20" aria-labelledby={`${id}-title`}>
      <p className="eyebrow"><span className="text-muted">{n}</span> <span className="mx-1 text-muted">/</span> {eyebrow}</p>
      <h2 id={`${id}-title`} className="h-display mt-3 text-3xl md:text-5xl">{title}</h2>
      {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      <div className="mt-10 md:mt-12">{children}</div>
    </section>
  );
}

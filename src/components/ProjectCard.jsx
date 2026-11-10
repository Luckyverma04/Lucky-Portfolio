import { Link } from "react-router-dom";
import Tilt from "./Tilt";
import { gallery } from "../data/gallery";
import { ML } from "./Shared";

/** Short project card: picture, number, title, one-line summary and a few tools. Opens the project page. */
export default function ProjectCard({ p }) {
  const img = gallery(p.slug)[0];
  const tools = p.stack.slice(0, 4);
  const more = p.stack.length - tools.length;
  return (
    <Tilt>
      <Link to={`/projects/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden" aria-label={`${p.title}: view project`}>
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
          {img ? (
            <img src={img.src} alt="" loading="lazy" className="h-full w-full object-cover object-left-top transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center" style={{ background: "radial-gradient(circle at 30% 30%, rgb(var(--violet) / .25), transparent 60%), radial-gradient(circle at 70% 70%, rgb(var(--brand) / .2), transparent 60%)" }}>
              <span className="font-mono text-7xl font-bold text-ink/15">{p.n}</span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-bg/85 px-2.5 py-1 font-mono text-xs text-brand">{p.n}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className={`eyebrow ${p.ml || p.featured ? "!text-violet-soft" : ""}`}>{p.kicker}</p>
          <h3 className="mt-2 text-2xl font-extrabold uppercase tracking-tight">{p.title}</h3>
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{p.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tools.map((t) => <li key={t} className={`chip ${ML.includes(t) || p.ml ? "chip-ml" : ""}`}>{t}</li>)}
            {more > 0 && <li className="chip text-muted">+{more}</li>}
          </ul>
          <span className="mt-auto pt-5 text-sm font-semibold text-brand">View project <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
        </div>
      </Link>
    </Tilt>
  );
}

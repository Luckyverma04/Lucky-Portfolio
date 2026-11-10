import { Link, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import Gallery from "../components/Gallery";
import { Stack, Links, Bullets, ML } from "../components/Shared";
import usePageTitle from "../components/usePageTitle";
import { gallery } from "../data/gallery";
import { allProjects, findProject } from "../data/projects";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = findProject(slug);
  usePageTitle(p ? p.title : "Not found");
  if (!p) return <NotFound />;

  const i = allProjects.indexOf(p);
  const prev = allProjects[(i - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(i + 1) % allProjects.length];
  const images = gallery(p.slug);
  const violet = p.ml || p.featured;

  return (
    <article className="wrap pb-20 pt-28 md:pt-32">
      <Link to="/projects" className="link-u text-sm text-muted hover:text-ink">← All projects</Link>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-5xl font-bold text-ink/15" aria-hidden="true">{p.n}</span>
          <span className={`eyebrow ${violet ? "!text-violet-soft" : ""}`}>{p.kicker}</span>
          {p.status && <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{p.status}</span>}
        </div>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,84px)]">{p.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{p.summary}</p>
        <div className="mt-6"><Links p={p} /></div>
      </Reveal>

      {images.length > 0 && <Reveal className="mt-12"><Gallery images={images} title={p.title} lead={2} /></Reveal>}

      {p.pipeline && (
        <Reveal className="mt-12">
          <p className="eyebrow mb-4">How it runs</p>
          <ol className="grid gap-3 sm:grid-cols-5" aria-label="How the pipeline runs">
            {p.pipeline.map((s, k) => (
              <li key={s.step} className="relative rounded-2xl border border-line bg-surface/60 p-4">
                <span className={`font-mono text-xs ${k === 3 ? "text-violet-soft" : "text-brand"}`}>0{k + 1}</span>
                <p className="mt-1 font-bold uppercase">{s.step}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{s.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <p className="eyebrow mb-5">What I built</p>
          <Bullets items={p.points} />
        </Reveal>
        <Reveal className="space-y-6 lg:col-span-4" delay={100}>
          <div className="card p-5">
            <p className="eyebrow mb-4 !text-muted">Built with</p>
            <Stack items={p.stack} ml={p.ml ? p.stack : ML} />
          </div>
          {p.caveat && (
            <div className="card p-5">
              <p className="eyebrow !text-violet-soft">A match is not a verification</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.caveat}</p>
            </div>
          )}
        </Reveal>
      </div>

      <nav className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2" aria-label="More projects">
        <Link to={`/projects/${prev.slug}`} className="card card-hover p-5">
          <span className="text-xs text-muted">← Previous</span>
          <span className="mt-1 block font-bold uppercase">{prev.n} · {prev.title}</span>
        </Link>
        <Link to={`/projects/${next.slug}`} className="card card-hover p-5 text-right">
          <span className="text-xs text-muted">Next →</span>
          <span className="mt-1 block font-bold uppercase">{next.n} · {next.title}</span>
        </Link>
      </nav>
    </article>
  );
}

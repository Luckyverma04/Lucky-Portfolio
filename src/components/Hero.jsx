import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";

import { profile } from "../data/content";

function Flow({ label, violet = false }) {
  return (
    <div className="relative flex min-h-[34px] flex-1 items-stretch justify-center" aria-hidden="true">
      <div className="relative w-3 self-stretch">
        <svg width="12" height="100%" className="absolute inset-0" preserveAspectRatio="none">
          <line x1="6" y1="0" x2="6" y2="100%" stroke={violet ? "rgb(var(--violet))" : "rgb(var(--brand))"} strokeWidth="1.5" className="flow-line" />
        </svg>
        <span className={`packet ${violet ? "v" : ""}`} />
      </div>
      <span className="absolute left-1/2 top-1/2 ml-5 -translate-y-1/2 whitespace-nowrap rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted" style={{ background: "rgb(var(--bg) / .7)" }}>{label}</span>
    </div>
  );
}

function Node({ label, sub, violet = false }) {
  return (
    <div className="spot card flex items-center justify-between !rounded-2xl px-5 py-4" style={{ background: "rgb(var(--bg) / .55)" }}>
      <span className="flex items-center gap-3 text-lg font-medium">
        <span className={`live-dot h-2.5 w-2.5 rounded-full ${violet ? "bg-violet" : "bg-brand"}`} />
        {label}
      </span>
      <span className="font-mono text-xs text-muted sm:text-sm">{sub}</span>
    </div>
  );
}

/** Vertical request path. On big screens it stretches to the full height of the hero. */
function StackGraphic() {
  return (
    <div className="card flex flex-col p-6 backdrop-blur-md lg:h-full lg:min-h-[480px]" style={{ background: "rgb(var(--bg) / .45)" }}
      role="img" aria-label="Stack I work across: a React app calls an Express API, which uses MongoDB and, in the BGV project, a Python ML service">
      <p className="eyebrow !text-muted" aria-hidden="true">Stack I work across</p>
      <div className="mt-5 flex flex-1 flex-col" aria-hidden="true">
        <Node label="React" sub="Interface" />
        <Flow label="POST /api/enquiry" />
        <Node label="Express API" sub="REST · JWT auth" />
        <Flow label="Mongoose" />
        <Node label="MongoDB" sub="Leads, bookings, runs" />
        <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />BGV project<span className="h-px flex-1 bg-line" /></div>
        <Node label="Express API" sub="Node.js" violet />
        <Flow label="similarity request" violet />
        <Node label="ML service" sub="Python · FastAPI · BGE-M3" violet />
      </div>
    </div>
  );
}

const Hero3D = lazy(() => import("./Hero3D"));

// 3D stack on desktop widths when WebGL works; the flat diagram everywhere else.
function webgl() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}
function RightSide() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);
  const [failed, setFailed] = useState(() => typeof window !== "undefined" && !webgl());
  const onFail = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  if (!wide || failed) return <StackGraphic />;
  return (
    <div className="relative lg:h-full lg:min-h-[480px]">
      <div className="hero-band" aria-hidden="true" />
      <span className="hero-outline" aria-hidden="true">Build</span>
      <Suspense fallback={null}><Hero3D onFail={onFail} /></Suspense>
    </div>
  );
}

const GREETING = "Glad you stopped by. Pick a place to start.";
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useTypewriter(text, speed = 38, startDelay = 600) {
  const [n, setN] = useState(() => (reduced() ? text.length : 0));
  useEffect(() => {
    if (reduced()) { setN(text.length); return; }
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => setN((c) => { if (c >= text.length) { clearInterval(timer); return c; } return c + 1; }), speed);
    }, startDelay);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [text, speed, startDelay]);
  return { displayed: text.slice(0, n), done: n >= text.length };
}

const pill = "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-line bg-surface px-4 py-[0.3em] mx-[0.2em] mb-[0.4em] text-[13px] text-ink transition-colors duration-200 hover:bg-brand hover:text-[var(--btn-ink)] sm:px-5 sm:text-[15px]";

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" /><rect x="3" y="3" width="12" height="12" rx="2" />
    </svg>
  );
}

export default function Hero() {
  const [pillsOn, setPillsOn] = useState(() => reduced());
  const [copied, setCopied] = useState(false);
  const { displayed, done } = useTypewriter(GREETING);

  useEffect(() => {
    if (reduced()) return;
    const t = setTimeout(() => setPillsOn(true), 400);
    return () => clearTimeout(t);
  }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${profile.email}`; }
  };

  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center gap-8 overflow-hidden pb-12 pt-24 md:pb-8 md:pt-24">
      <div className="wrap relative grid w-full items-center gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12">
        <div className="flex max-w-2xl flex-col gap-7 lg:min-h-[calc(100vh-8rem)] lg:max-w-none lg:justify-between lg:gap-6">
          <Reveal delay={70}>
            <h1 className="font-display text-[clamp(52px,12vw,88px)] leading-[.92] text-[rgb(var(--h1))] lg:text-[clamp(44px,9vh,70px)]">
              Building Reliable <span className="grad-text grad-move">Backend Systems</span> &amp; Practical Web Applications
            </h1>
          </Reveal>
          <div>
            <p className="min-h-[40px] text-[clamp(18px,4vw,24px)] leading-[1.35] lg:text-[clamp(18px,3.4vh,28px)]" aria-label={GREETING}>
              <span aria-hidden="true">{displayed}</span>
              {!done && <span className="type-caret ml-[2px] inline-block h-[1.1em] w-[2px] bg-ink align-middle" aria-hidden="true" />}
            </p>
            <Reveal delay={140}>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink/85 lg:text-[clamp(14px,2.2vh,18px)]">
                I'm a backend-leaning full-stack developer working with Node.js, Express, MongoDB and React. Most of what I build is APIs, databases and the screens on top of them. At Trazoo I work on the lead system the sales team uses every day. On my own, I've been building a background-verification tool that uses an embedding model to rank search results.
              </p>
            </Reveal>
          </div>
          <div className="flex flex-wrap gap-y-1" style={{ opacity: pillsOn ? 1 : 0, transform: pillsOn ? "none" : "translateY(8px)", transition: "opacity .4s ease, transform .4s ease" }}>
            <a href="#experience" className={pill}>See my work</a>
            <a href="#projects" className={pill}>Things I've built</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className={pill}>My GitHub</a>
            <a href="#contact" className={pill}>Send a note</a>
            <button type="button" onClick={copyEmail}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink bg-transparent px-4 py-[0.3em] text-[13px] text-ink transition-colors duration-200 hover:bg-ink hover:text-bg sm:gap-3 sm:px-5 sm:text-[15px]">
              <span>{copied ? "Copied to clipboard" : <>Email: <span className="underline underline-offset-1">{profile.email}</span></>}</span>
              <CopyIcon />
            </button>
            <span className="sr-only" role="status">{copied ? "Email address copied" : ""}</span>
          </div>
        </div>
        <Reveal delay={250}><RightSide /></Reveal>
      </div>
    </section>
  );
}
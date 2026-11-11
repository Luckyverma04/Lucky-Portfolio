import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { profile, mailHref } from "../data/content";
import { Mail } from "./Icons";

const links = [["/", "Home"], ["/about", "About"], ["/projects", "Projects"], ["/experience", "Career"], ["/contact", "Contact"]];
const cls = ({ isActive }) => `link-u text-[13px] font-semibold uppercase tracking-wider ${isActive ? "text-brand" : "text-ink/80 hover:text-ink"}`;

const s = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
const ICONS = {
  "/": <svg {...s}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>,
  "/about": <svg {...s}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  "/projects": <svg {...s}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  "/experience": <svg {...s}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></svg>,
  "/contact": <svg {...s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
};

/** On phones the pages live in a tab bar at the bottom of the screen, like an app. */
function TabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-bg md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} aria-label="Pages">
      <ul className="grid grid-cols-5">
        {links.map(([to, l]) => (
          <li key={to}>
            <NavLink to={to} end={to === "/"} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${isActive ? "text-brand" : "text-ink/60"}`}>
              {({ isActive }) => (<>
                <span className={`grid h-8 w-12 place-items-center rounded-full transition-colors ${isActive ? "bg-brand/15" : ""}`}>{ICONS[to]}</span>
                {l}
              </>)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-line" : ""}`} style={{ background: scrolled ? "var(--nav-bg)" : "transparent" }}>
        <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
          <Link to="/" className="text-lg font-extrabold tracking-tight" aria-label="Lucky Verma, home">
            L<span className="text-brand">V</span>
          </Link>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-u hidden text-sm text-ink/80 hover:text-ink lg:block">
            {profile.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {links.map(([to, l]) => <li key={to}><NavLink to={to} end={to === "/"} className={cls}>{l}</NavLink></li>)}
          </ul>
          <a href={mailHref} target="_blank" rel="noreferrer" className="btn !px-4 !py-2 text-[13px] md:hidden"><Mail /> Email me</a>
        </nav>
      </header>
      <TabBar />
    </>
  );
}

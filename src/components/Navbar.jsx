import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Close } from "./Icons";
import { profile } from "../data/content";

const links = [["/", "Home"], ["/about", "About"], ["/projects", "Projects"], ["/experience", "Career"], ["/contact", "Contact"]];
const cls = ({ isActive }) => `link-u text-[13px] font-semibold uppercase tracking-wider ${isActive ? "text-brand" : "text-ink/80 hover:text-ink"}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line" : ""}`} style={{ background: scrolled || open ? "var(--nav-bg)" : "transparent" }}>
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
        <button className="btn !px-3 !py-2 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <Close /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="wrap pb-5 md:hidden">
          <ul>{links.map(([to, l]) => (
            <li key={to} className="border-t border-line"><NavLink to={to} end={to === "/"} className={({ isActive }) => `block py-3.5 text-[15px] font-semibold uppercase tracking-wider ${isActive ? "text-brand" : "text-ink/80 hover:text-ink"}`}>{l}</NavLink></li>
          ))}</ul>
        </div>
      )}
    </header>
  );
}

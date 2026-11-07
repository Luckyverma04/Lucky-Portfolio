import { useEffect, useState } from "react";
import { Menu, Close } from "./Icons";
import { profile } from "../data/content";

const links = [["about", "About"], ["work", "What I do"], ["experience", "Career"], ["projects", "Projects"], ["contact", "Contact"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line backdrop-blur-xl" : ""}`} style={{ background: scrolled || open ? "var(--nav-bg)" : "transparent" }}>
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
        <a href="#top" className="text-lg font-extrabold tracking-tight" onClick={() => setOpen(false)} aria-label="Lucky Verma, back to top">
          L<span className="text-brand">V</span>
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-u hidden text-sm text-ink/80 hover:text-ink lg:block">
          {profile.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map(([id, l]) => <li key={id}><a href={`#${id}`} className="link-u text-[13px] font-semibold uppercase tracking-wider text-ink/80 hover:text-ink">{l}</a></li>)}
        </ul>
        <button className="btn !px-3 !py-2 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <Close /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="wrap pb-5 md:hidden">
          <ul>{links.map(([id, l]) => (
            <li key={id} className="border-t border-line"><a href={`#${id}`} onClick={() => setOpen(false)} className="block py-3.5 text-[15px] font-semibold uppercase tracking-wider text-ink/80 hover:text-ink">{l}</a></li>
          ))}</ul>
        </div>
      )}
    </header>
  );
}

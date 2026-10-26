import { useEffect, useState } from "react";
import { Menu, Close, Sun, Moon } from "./Icons";

const links = [["about", "About"], ["skills", "Skills"], ["experience", "Work"], ["projects", "Projects"], ["contact", "Contact"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "dark");

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

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch { /* ignore */ }
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? "border-b border-line backdrop-blur-xl" : ""}`} style={{ background: scrolled || open ? "var(--nav-bg)" : "transparent" }}>
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg text-sm text-white" style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>LV</span>
          Lucky Verma
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map(([id, l]) => <li key={id}><a href={`#${id}`} className="link-u text-sm text-muted transition-colors hover:text-ink">{l}</a></li>)}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="btn !px-3 !py-2" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button className="btn !px-3 !py-2 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="wrap pb-5 md:hidden">
          <ul>{links.map(([id, l]) => (
            <li key={id} className="border-t border-line"><a href={`#${id}`} onClick={() => setOpen(false)} className="block py-3.5 text-[15px] text-muted hover:text-ink">{l}</a></li>
          ))}</ul>
        </div>
      )}
    </header>
  );
}

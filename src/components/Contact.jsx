import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import Reveal from "./Reveal";
import { Section } from "./Shared";
import { Mail, Github, Linkedin, Arrow } from "./Icons";
import { profile } from "../data/content";

const Envelope3D = lazy(() => import("./Envelope3D"));

const field = "mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted/60 focus:border-brand";
const row = "btn w-full !justify-between";

// Tap one to start the message. Only fills the box while it is empty or still holds another starter.
const STARTERS = {
  "A project": "Hi Lucky, I have a project I'd like to talk about: ",
  "A role": "Hi Lucky, I'm reaching out about a role: ",
  "A question": "Hi Lucky, I had a question about your work: ",
};

function webgl() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [typing, setTyping] = useState(false);
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  const [noGl, setNoGl] = useState(() => typeof window !== "undefined" && !webgl());
  const onFail = useCallback(() => setNoGl(true), []);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const start = (k) => setForm((f) => (!f.message || Object.values(STARTERS).includes(f.message) ? { ...f, message: STARTERS[k] } : f));

  const onSubmit = async (e) => {
    e.preventDefault();
    const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setStatus({ type: "error", text: `The form isn't set up yet. Please email me at ${profile.email}.` });
      return;
    }
    setStatus({ type: "loading", text: "" });
    try {
      await emailjs.send(serviceId, templateId, {
        from_name: form.name.trim(), to_name: profile.name,
        from_email: form.email.trim(), to_email: profile.email, message: form.message.trim(),
      }, publicKey);
      setStatus({ type: "success", text: "Thanks, I'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "error", text: `That didn't send. Please email me at ${profile.email}.` });
    }
  };

  return (
    <Section id="contact" eyebrow="Contact" title="Say hello" intro="Got a project, a role to fill or a question about my work? Write a few lines and I'll reply.">
      <div className="grid gap-8 md:grid-cols-12 md:items-start">
        <Reveal className="md:col-span-5">
          {wide && !noGl && <Suspense fallback={null}><Envelope3D open={typing} onFail={onFail} /></Suspense>}
          <ul className="space-y-3">
            <li><a href={`mailto:${profile.email}`} className={row}><span className="flex items-center gap-2"><Mail /> {profile.email}</span><Arrow /></a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noreferrer" className={row}><span className="flex items-center gap-2"><Linkedin /> LinkedIn</span><Arrow /></a></li>
            <li><a href={profile.github} target="_blank" rel="noreferrer" className={row}><span className="flex items-center gap-2"><Github /> GitHub</span><Arrow /></a></li>
          </ul>
        </Reveal>
        <Reveal className="md:col-span-7" delay={100}>
          <form
            onSubmit={onSubmit}
            onFocus={() => setTyping(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setTyping(false); }}
            className="card space-y-5 p-6 md:p-8"
            style={{ borderColor: "rgb(var(--brand) / .5)" }}
          >
            <div>
              <p className="font-display text-4xl leading-none text-[rgb(var(--h1))] md:text-5xl">Tell me what you're building</p>
              <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Start your message with">
                <span className="text-sm text-muted">It's about</span>
                {Object.keys(STARTERS).map((k) => (
                  <button key={k} type="button" onClick={() => start(k)} className="chip cursor-pointer transition-colors hover:border-brand hover:text-ink">{k}</button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="eyebrow !text-muted">Name</span><input name="name" value={form.name} onChange={onChange} required autoComplete="name" placeholder="Your name" className={field} /></label>
              <label className="block"><span className="eyebrow !text-muted">Email</span><input name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" placeholder="you@example.com" className={field} /></label>
            </div>
            <label className="block"><span className="eyebrow !text-muted">Message</span><textarea name="message" rows={5} value={form.message} onChange={onChange} required placeholder="What's on your mind?" className={`${field} resize-none`} /></label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status.type === "loading"} className="btn btn-primary !px-6 !py-3.5 disabled:opacity-60">{status.type === "loading" ? "Sending…" : "Send message"} <Arrow /></button>
              <p role="status" aria-live="polite" className={`text-sm ${status.type === "error" ? "text-red-500" : "text-muted"}`}>{status.text}</p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
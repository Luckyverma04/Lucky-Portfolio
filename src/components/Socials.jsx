import { Github, Linkedin, Mail } from "./Icons";
import { profile } from "../data/content";

/** Fixed icons on the left edge (desktop), like a sidebar. */
export default function Socials() {
  const items = [
    [profile.github, "GitHub", <Github key="g" />],
    [profile.linkedin, "LinkedIn", <Linkedin key="l" />],
    [`mailto:${profile.email}`, "Email", <Mail key="m" />],
  ];
  return (
    <div className="fixed bottom-0 left-6 z-40 hidden flex-col items-center gap-5 lg:flex">
      {items.map(([href, label, icon]) => (
        <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-all hover:-translate-y-1 hover:text-brand [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </a>
      ))}
      <span className="h-24 w-px bg-gradient-to-b from-ink/40 to-transparent" />
    </div>
  );
}

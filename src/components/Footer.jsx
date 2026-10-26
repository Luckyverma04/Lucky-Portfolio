import { profile } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col justify-between gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {profile.name}. Built with React and Tailwind CSS.</p>
        <ul className="flex gap-6">
          <li><a className="link-u hover:text-ink" href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a className="link-u hover:text-ink" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a className="link-u hover:text-ink" href={`mailto:${profile.email}`}>Email</a></li>
        </ul>
      </div>
    </footer>
  );
}

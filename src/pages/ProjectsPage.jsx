import Reveal from "../components/Reveal";
import { Section } from "../components/Shared";
import ProjectCard from "../components/ProjectCard";
import usePageTitle from "../components/usePageTitle";
import { allProjects } from "../data/projects";

export default function ProjectsPage() {
  usePageTitle("Projects");
  return (
    <Section id="projects" eyebrow="Projects" title="Things" accent="I've built" className="pt-28 md:pt-32"
      intro={`${allProjects.length} projects: personal builds, a client trial and my ML notebooks. Open any card for the details.`}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allProjects.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 80}><ProjectCard p={p} /></Reveal>)}
      </div>
    </Section>
  );
}

import { bgv, projects } from "./content";

// Every project in display order, numbered 01, 02, ... The BGV project comes first.
export const allProjects = [
  { ...bgv, featured: true, points: bgv.built },
  ...projects,
].map((p, i) => ({ ...p, n: String(i + 1).padStart(2, "0") }));

export const findProject = (slug) => allProjects.find((p) => p.slug === slug);

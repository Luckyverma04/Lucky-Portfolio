// Every image in src/assets/gallery/<project>/ is picked up automatically, in filename order.
const files = import.meta.glob("../assets/gallery/*/*.{png,jpg,jpeg,webp,avif}", { eager: true, query: "?url", import: "default" });

const byProject = {};
Object.keys(files).sort().forEach((path) => {
  const slug = path.split("/").slice(-2)[0];
  const name = path.split("/").pop().replace(/\.[^.]+$/, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ");
  (byProject[slug] ||= []).push({ src: files[path], caption: name });
});

export const gallery = (slug) => byProject[slug] || [];

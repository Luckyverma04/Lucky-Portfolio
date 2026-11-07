// Picks up every file in src/assets/gallery/<project>/ whatever the extension or its case.
const files = import.meta.glob("../assets/gallery/*/*", { eager: true, query: "?url", import: "default" });

const IMG = /\.(png|jpe?g|webp|avif|gif|jfif|bmp|svg)$/i;
const byProject = {};

Object.keys(files)
  .filter((p) => IMG.test(p))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  .forEach((path) => {
    const slug = path.split("/").slice(-2)[0];
    const name = path.split("/").pop().replace(/\.[^.]+$/, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ");
    (byProject[slug] ||= []).push({ src: files[path], caption: name });
  });


export const gallery = (slug) => byProject[slug] || [];
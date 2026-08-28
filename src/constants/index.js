import {
  mobile,
  backend,
  web,
  javascript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  trazoo,
  trazooProject,
  staynearev,
  mergx,
  reactprojects,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Full Stack Developer",
    icon: web,
  },
  {
    title: "MERN Stack Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "git",
    icon: git,
  },
];

const experiences = [
  {
    title: "Web Developer Intern",
    company_name: "Trazoo Global LLP",
    icon: trazoo,
    iconBg: "#ffffff",
    date: "January 2026 - May 2026",
    points: [
      "Built and shipped production features for a B2B corporate gifting platform using React, Vite and Tailwind CSS on the frontend, with Node.js, Express and MongoDB powering the API.",
      "Redesigned the hero and product range sections with category grouping and a responsive two-column layout, making the catalogue easier to browse on mobile and desktop.",
      "Implemented a user behaviour tracking and lead management system in MongoDB, including anonymous ID generation and A/B tested engagement popups.",
      "Added full SEO infrastructure across every page — meta tags, JSON-LD structured data, sitemap and robots.txt — through a reusable useSEO hook.",
      "Deployed and maintained the platform on Render with a custom domain, debugging CORS, DNS and MongoDB connection issues along the way.",
    ],
  },
];

const projects = [
  {
    name: "Trazoo Global",
    description:
      "Production B2B corporate gifting and merchandise platform serving 20+ enterprise clients with 30,000+ kits shipped. Built the complete stack: product catalogue with category grouping, a booking and customisation flow, an admin dashboard, and a MongoDB-based lead tracking system. Fully SEO-optimised and live on a custom domain.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "node.js",
        color: "green-text-gradient",
      },
      {
        name: "express.js",
        color: "green-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: trazooProject,
    source_code_link: "https://github.com/Luckyverma04/TrazooProductsFrontend",
    backend_code_link: "https://github.com/Luckyverma04/Trazoo-products-backend",
    live_site_link: "https://www.trazooglobal.com",
  },
  {
    name: "StayNearEV",
    description:
      "EV charging station booking platform where drivers find nearby stations and reserve charging slots. Implemented OTP-based email verification, consolidated the separate host and customer roles into a single role across models, controllers and UI, wrote the database migration for it, and fixed a set of mobile layout and touch-interaction bugs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "node.js",
        color: "green-text-gradient",
      },
      {
        name: "express.js",
        color: "green-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: staynearev,
    source_code_link: "https://github.com/Luckyverma04/StayNearEvFrontend",
    backend_code_link: "https://github.com/Luckyverma04/StayNearEv",
    live_site_link: "https://staynearevfrontend.onrender.com",
  },
  {
    name: "Mergx — PDF & Image Utility",
    description:
      "Web application for merging, converting and compressing PDF and image files with multi-format support. Built an optimised file upload pipeline with asynchronous processing so large files never block the UI, wrapped in a responsive, cross-browser interface.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "node.js",
        color: "green-text-gradient",
      },
      {
        name: "file-processing",
        color: "pink-text-gradient",
      },
    ],
    image: mergx,
    source_code_link: "https://github.com/Luckyverma04/minor",
    live_site_link: "https://imapdf.vercel.app",
  },
  {
    name: "React Projects Collection",
    description:
      "A set of 13 React applications built while going deep on the ecosystem — password generator, currency converter, background changer, theme switcher, todo list and more. Covers hooks, Context API, Redux Toolkit, React Router, Tailwind and Vite across a single repository.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "redux-toolkit",
        color: "blue-text-gradient",
      },
      {
        name: "react-router",
        color: "green-text-gradient",
      },
      {
        name: "context-api",
        color: "pink-text-gradient",
      },
    ],
    image: reactprojects,
    source_code_link: "https://github.com/Luckyverma04/React",
  },
];

export { services, technologies, experiences, projects };
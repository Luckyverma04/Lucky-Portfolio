
const GH = "https://github.com/Luckyverma04";

export const profile = {
  name: "Lucky Verma",
  location: "Bengaluru, India",
  email: "lv001490@gmail.com",
  github: GH,
  linkedin: "https://www.linkedin.com/in/lucky-verma-886547307/",
  // Put your photo at public/profile.jpg and it shows up in the About section.
  photo: "/profile.jpg",
};

// Opens a Gmail compose window in the browser. A plain mailto: link does nothing when no mail app is set up.
export const mailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`;

export const about = [
  "I'm a software engineer with a B.Tech in Computer Science. Backend is what I enjoy most: shaping the data, building the API, and thinking through what happens when something goes wrong. I'm comfortable on the React side too, so I can take a feature from the database all the way to the screen.",
  "At Trazoo Global I work on a live B2B gifting platform, mostly the lead and enquiry system the sales team uses. On my own time I built StayNearEV (EV charger booking), Mergx (PDF and image tools) a background-verification backend that mixes simple matching rules with BGE-M3 similarity, and most recently a Next.js website for the Lore app.",
  "I'm early in my career, so I'd rather show the code than talk it up. Every project below links to its repo.",
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore",
};

export const skills = [
  { group: "Backend", items: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Mongoose", "JWT Authentication", "Database Design", "API Integration"] },
  { group: "Frontend", items: ["React.js", "Next.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Axios"] },
  { group: "Programming & CS", items: ["JavaScript", "Java", "C++", "C", "SQL", "Data Structures & Algorithms", "OOP", "DBMS"] },
  {
    group: "Machine Learning & AI",
    ml: true,
    items: ["Python", "Machine Learning", "CNN fundamentals", "Model evaluation", "Semantic similarity", "Embeddings (BGE-M3)", "ML service integration"]
  },
  { group: "Tools", items: ["Git", "GitHub", "Postman", "Vite", "Render", "Vercel"] },
];

export const bgv = {
  slug: "background-verification",
  title: "Background Verification Software",
  kicker: "Featured project · Backend + ML",
  status: "In development, not deployed",
  summary:
    "A backend and review dashboard that helps a person check a candidate's public online presence. It reads candidates from a Google Sheet, finds public profiles across up to 31 platforms, scores each result with matching rules plus BGE-M3 similarity, and ranks a shortlist for the reviewer to confirm or reject.",
  pipeline: [
    { step: "Import", detail: "Candidates come from a Google Sheet and are reviewed before any search runs." },
    { step: "Discover", detail: "Serper and Tavily search, with per-platform targets and a call budget." },
    { step: "Match", detail: "Name first, then company, education, location and title." },
    { step: "Embed", detail: "BGE-M3 similarity from a small Python FastAPI service." },
    { step: "Review", detail: "A ranked shortlist. A person decides." },
  ],
  built: [
    "Express 5 REST API on MongoDB and Mongoose: candidates, runs, search results, evidence, identity groups and reviewer logs.",
    "Rule-based scoring where the name is a gate and company, education, location and title add support. Results come out as STRONG, POSSIBLE, REVIEW_REQUIRED, WEAK or CONFLICT, and anything left off the review list keeps a recorded reason.",
    "BGE-M3 runs in its own Python FastAPI service. On the Node side I added caching, bounded concurrency, a circuit breaker and one retry. If the ML call fails, the result is marked UNAVAILABLE instead of scored 0, and ranking falls back to the rules.",
    "A search provider layer with a concurrency limit, response caching and a per-run call budget. A new run reuses stored profiles and never overwrites earlier reviewer decisions.",
    "Node tests, Python tests for the ML service, and benchmark scripts for matching precision and timing.",
  ],
  caveat: "Match scores only help the reviewer decide. They don't prove who someone is, and a person makes the final call.",
  stack: ["Node.js", "Express", "MongoDB", "Mongoose", "Python", "FastAPI", "BGE-M3", "sentence-transformers", "React", "REST APIs", "Cloudinary"],
  code: `${GH}/Background_verification_software`,
};

export const projects = [
  {
    title: "LORE Website",
    kicker: "Next.js site for an Android app",
    slug: "lore",
    summary: "A redesign of the website for Lore: Viral Star Bano, an Android app that turns a photo into a share-ready video. Built to be fast and easy for Google and AI assistants to read.",
    points: [
      "Next.js 16 App Router with every page pre-rendered as static HTML, so crawlers get the full text without running JavaScript.",
      "PageSpeed 100 on performance, accessibility, best practices and SEO for the home page on mobile and desktop. Mobile LCP 1.0 s.",
      "JSON-LD for Organization, WebSite, MobileApplication and FAQPage, with the FAQ schema matching the visible text word for word.",
      "3D phone preview in React Three Fiber, loaded only after the first interaction, plus a 3D template wall and GSAP scroll animations.",
      "FAQ written in English and Hinglish. All facts come from the Play Store listing, kept in one file.",
    ],
    stack: ["Next.js", "React 19", "Tailwind CSS v4", "GSAP", "React Three Fiber", "Vercel"],
    live: "https://lore-website-rho.vercel.app",
    code: `${GH}/LORE_Website`,
  },
  {
    title: "StayNearEV",
    kicker: "EV charging station listing and booking",
    slug: "staynearev",
    summary: "Drivers find charging stations nearby and book a slot. Admins manage stations and bookings from a dashboard.",
    points: [
      "Express and MongoDB REST API with separate user, station and booking modules, plus JWT authentication.",
      "OTP email verification that can be switched on or off with a flag.",
      "Station photos upload through Cloudinary.",
      "Merged the separate host and customer roles into one across models, controllers and UI, and wrote the migration for existing data.",
      "Fixed mobile bugs: overflow, a clipped navbar, and tap versus hover behaviour.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind", "Cloudinary"],
    live: "https://staynearevfrontend.onrender.com",
    code: `${GH}/StayNearEvFrontend`,
    backend: `${GH}/StayNearEv`,
  },
  {
    title: "Mergx",
    kicker: "PDF and image utility",
    slug: "mergx",
    summary: "Merge, convert and compress PDF and image files in the browser.",
    points: [
      "Uploads are processed asynchronously, so a large file doesn't freeze the page.",
      "Works across formats with a responsive layout. Deployed on Vercel.",
    ],
    stack: ["React", "Node.js", "File processing"],
    live: "https://imapdf.vercel.app",
    code: `${GH}/minor`,
  },
  {
    title: "React Projects Collection",
    kicker: "13 small apps, one repo",
    slug: "react-projects",
    summary: "Password generator, currency converter, background changer, theme switcher, todo list and more.",
    points: ["My practice repo for hooks, Context API, Redux Toolkit, React Router, Tailwind and Vite."],
    stack: ["React", "Redux Toolkit", "React Router", "Context API"],
    code: `${GH}/React`,
  },
  {
    title: "ML Journey",
    kicker: "Learning ML in public, one notebook a day",
    slug: "ml-journey",
    ml: true,
    summary: "My day-by-day machine learning notebooks, two mini projects, and a small face-matching service that grew out of them for the BGV project.",
    points: [
      "Data cleaning with pandas and NumPy, then linear regression on a small dataset (Mini Project 1).",
      "Classifiers compared side by side: logistic regression, KNN, decision tree and random forest, scored with precision, recall, F1 and a confusion matrix.",
      "Spam detector (Mini Project 2): four models trained on the same data to see which one holds up.",
      "Scaling and pipelines in scikit-learn, then first neural networks in PyTorch (nn.Sequential on the digits dataset) and image work in OpenCV.",
      "bgv_face_service: a FastAPI endpoint that finds the face in a reference photo and in up to 15 candidate photos (OpenCV YuNet + SFace), scores each pair, and labels it ACCEPT, HUMAN_REVIEW or REJECT. Tested with pytest.",
    ],
    stack: ["Python", "pandas", "NumPy", "scikit-learn", "PyTorch", "OpenCV", "FastAPI", "Jupyter"],
    code: `${GH}/ml-journey`,
  },
];

export const job = {
  slug: "trazoo",
  role: "Web Developer",
  company: "Trazoo Global LLP",
  period: "September 2025 – Present",
  about: "A B2B corporate gifting and merchandise platform (trazooglobal.com).",
  companyNote: "The business reports 20+ enterprise clients and 30,000+ kits shipped. Those are company figures, not my results.",
  intro:
    "The part of the platform I care most about is the lead system. Every enquiry is a possible large order, so each one needs an owner, a status and a record of what happened. I built the backend for that and the admin and associate screens that use it.",
  lifecycle: [
    { title: "Capture", detail: "Website enquiries, kit and customisation requests, proposal requests, manual entry or a CSV upload. Each lead records where it came from." },
    { title: "Assign", detail: "An admin assigns a lead to an associate, one at a time or in bulk. That moves it from PENDING to ACTIVE." },
    { title: "Work", detail: "The associate sets the call outcome, marks it a prospect or not, and logs WhatsApp, email or call notes." },
    { title: "Close", detail: "Each lead ends as CONVERTED or NOT_INTERESTED, or stays IN_PROCESS. Every change goes into its history." },
  ],
  points: [
    "Designed the lead model in MongoDB: contact and company details, requirement, quantity, required-by date, budget, source, status, call outcome, assignee, a communication log and an activity history.",
    "Public enquiry endpoint that saves the lead and replies straight away. The customer confirmation and admin notification emails go out in the background, so a slow mail server never blocks the form.",
    "Separate endpoints for kit enquiries, customisation requests (with product, customisation type and logo upload checks) and proposal requests, whose list is admin-only.",
    "Admin side: dashboard totals, a paginated list searchable by name, email, phone and company, an assigned or unassigned filter, manual lead entry, CSV upload and bulk assignment.",
    "Associate side: a 'my leads' view, status updates with a comment, and a communication log for each lead.",
    "JWT-protected routes, and React admin and associate dashboards on top.",
    "Also built the redesigned hero and product range sections, behaviour tracking with anonymous IDs and A/B-tested popups, the SEO setup (useSEO hook, JSON-LD, sitemap, robots.txt), and the Render deployment with a custom domain.",
  ],
  stack: ["React", "Vite", "Tailwind", "Node.js", "Express", "MongoDB", "JWT", "Nodemailer"],
  live: "https://www.trazooglobal.com",
  code: `${GH}/TrazooProductsFrontend`,
  backend: `${GH}/Trazoo-products-backend`,
};

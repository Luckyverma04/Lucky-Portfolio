# Lucky Verma — Portfolio

Single-page React portfolio (React 18, Vite, Tailwind) with dark and light themes.

## Run locally
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in dist/
    npm run preview

## Add your photo
Save a portrait as `public/profile.jpg` (4:5 works best, about 800x1000). It appears in the About section automatically. Without the file, the photo slot is simply hidden.

## Add screenshots
Put images in `src/assets/gallery/<project>/` (folders: `trazoo`, `staynearev`, `mergx`, `react-projects`, `background-verification`). They appear in filename order (`01-...`, `02-...`), with click-to-enlarge. No code changes needed. Use .webp or .jpg, about 1400px wide.

## Environment variables (contact form, EmailJS)
Copy your existing `.env` into this folder, or copy `.env.example` and fill in:
- `VITE_APP_EMAILJS_SERVICE_ID`
- `VITE_APP_EMAILJS_TEMPLATE_ID`
- `VITE_APP_EMAILJS_PUBLIC_KEY`
`.env` is git-ignored. Add the same three variables on your host.

## Deploy (Render static site)
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add the three environment variables above.
(`render.yaml` is included if you prefer a Blueprint.)

## Edit content
Everything lives in `src/data/content.js`.
No resume button yet: put a PDF in `public/` and link it when you have one.

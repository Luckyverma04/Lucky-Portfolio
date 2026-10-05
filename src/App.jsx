import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  About,
  Contact,
  Hero,
  Navbar,
  Tech,
} from "./components";

// Lazy load heavier sections
const Experience = lazy(() => import("./components/Experience"));

const Works = lazy(() => import("./components/Works"));

const StarsCanvas = lazy(() =>
  import("./components/canvas/Stars")
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        {/* Hero */}
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>

        {/* About */}
        <About />

        {/* Experience */}
        <Suspense fallback={null}>
          <Experience />
        </Suspense>

        {/* Tech Stack */}
        <Tech />

        {/* Projects */}
        <Suspense fallback={null}>
          <Works />
        </Suspense>

        {/* Contact + Stars */}
        <div className="relative z-0">
          <Contact />

          <Suspense fallback={null}>
            <StarsCanvas />
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
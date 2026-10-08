import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { Hero, Navbar } from "./components";

const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

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
        <Suspense fallback={null}>
          <About />
        </Suspense>

        {/* Experience */}
        <Suspense fallback={null}>
          <Experience />
        </Suspense>

        {/* Tech Stack */}
        <Suspense fallback={null}>
          <Tech />
        </Suspense>

        {/* Projects */}
        <Suspense fallback={null}>
          <Works />
        </Suspense>

        {/* Contact + Stars */}
        <div className="relative z-0">
          <Suspense fallback={null}>
            <Contact />
          </Suspense>

          <Suspense fallback={null}>
            <StarsCanvas />
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
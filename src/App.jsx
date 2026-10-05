import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  Tech,
  Works,
} from "./components";

// Load the heavy star background only when needed
const StarsCanvas = lazy(() =>
  import("./components/canvas").then((module) => ({
    default: module.StarsCanvas,
  }))
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

        {/* Main sections */}
        <About />
        <Experience />
        <Tech />
        <Works />

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
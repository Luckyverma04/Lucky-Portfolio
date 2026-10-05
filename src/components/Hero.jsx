import { useEffect, useState, lazy, Suspense } from "react";

import { styles } from "../styles";

const ComputersCanvas = lazy(() => import("./canvas/Computers"));

const Hero = () => {
  const [showComputer, setShowComputer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const updateDevice = () => {
      setIsMobile(mobileQuery.matches);
    };

    updateDevice();

    mobileQuery.addEventListener("change", updateDevice);

    return () => {
      mobileQuery.removeEventListener("change", updateDevice);
    };
  }, []);

  // Load heavy 3D computer after the Hero has rendered
  useEffect(() => {
    // Never load the heavy 3D computer on mobile
    if (isMobile) {
      setShowComputer(false);
      return;
    }

    // Give the Hero content priority
    const timer = setTimeout(() => {
      setShowComputer(true);
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [isMobile]);

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      {/* Hero content */}
      <div
        className={`absolute inset-0 top-[120px] z-10 pointer-events-none max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        {/* Vertical line */}
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />

          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        {/* Hero text */}
        <div className="md:max-w-[52%] w-full">
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm{" "}
            <span className="text-[#915EFF]">
              Lucky Verma
            </span>
          </h1>

          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I build full-stack web apps with <strong>MERN</strong>
            <br className="sm:block hidden" />
            from database to deployment
          </p>
        </div>
      </div>

      {/* Desktop 3D Computer */}
      {!isMobile && (
        <div className="absolute inset-0 md:left-[52%] md:top-0 left-0 top-[45%]">
          {showComputer && (
            <Suspense fallback={null}>
              <ComputersCanvas />
            </Suspense>
          )}
        </div>
      )}

      {/* Mobile Developer Card */}
      {isMobile && (
        <div className="absolute left-0 right-0 bottom-[8%] flex justify-center pointer-events-none">
          <div className="relative w-[280px] h-[180px]">
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-[#100d25]/80 blur-xl" />

            {/* Card */}
            <div className="relative w-full h-full rounded-2xl border border-[#915EFF]/30 bg-[#100d25]/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[#915EFF] text-5xl font-bold">
                  {"</>"}
                </div>

                <p className="mt-3 text-white text-sm font-medium">
                  Full Stack Developer
                </p>

                <p className="mt-1 text-secondary text-xs">
                  React • Node • MongoDB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center p-2 z-10">
        <a
          href="#about"
          aria-label="Scroll to About section"
        >
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <div className="scroll-dot w-3 h-3 rounded-full bg-secondary mb-1" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
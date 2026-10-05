import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";

// Load the 3D computer only after the main page becomes idle
const ComputersCanvas = lazy(() =>
  import("./canvas").then((module) => ({
    default: module.ComputersCanvas,
  }))
);

const Hero = () => {
  const [showComputer, setShowComputer] = useState(false);

  useEffect(() => {
    let timer;

    const load3D = () => {
      setShowComputer(true);
    };

    // Don't load Three.js during the critical initial page render.
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(load3D, {
        timeout: 2500,
      });

      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    // Fallback for browsers without requestIdleCallback
    timer = setTimeout(load3D, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      {/* ---------- LEFT: text ---------- */}
      <div
        className={`absolute inset-0 top-[120px] z-10 pointer-events-none max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <div className="md:max-w-[52%] w-full">
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#915EFF]">Lucky Verma</span>
          </h1>

          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I build full-stack web apps with <strong>MERN</strong>
            <br className="sm:block hidden" />
            from database to deployment
          </p>
        </div>
      </div>

      {/* ---------- RIGHT: 3D computer ---------- */}
      <div className="absolute inset-0 md:left-[52%] md:top-0 left-0 top-[45%]">
        {showComputer && (
          <Suspense fallback={null}>
            <ComputersCanvas />
          </Suspense>
        )}
      </div>

      {/* ---------- scroll indicator ---------- */}
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center p-2 z-10">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
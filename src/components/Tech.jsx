import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { textVariant } from "../utils/motion";

// Load only the Ball component that Tech section needs
const BallCanvas = lazy(() => import("./canvas/Ball"));

const Tech = () => {
  const sectionRef = useRef(null);
  const [shouldLoadTech, setShouldLoadTech] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadTech(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "400px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          What I work with
        </p>

        <h2 className={styles.sectionHeadText}>
          Tech Stack.
        </h2>
      </motion.div>

      <div className="mt-14 flex flex-row flex-wrap justify-center gap-10">
        {technologies.map((technology) => (
          <div
            className="w-28 h-28"
            key={technology.name}
          >
            {shouldLoadTech ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="canvas-loader" />
                  </div>
                }
              >
                <BallCanvas icon={technology.icon} />
              </Suspense>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "");
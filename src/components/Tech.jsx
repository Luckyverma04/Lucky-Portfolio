import React, { useEffect, useRef, useState } from "react";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px 0px",
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
      <div>
        <p className={styles.sectionSubText}>
          What I work with
        </p>

        <h2 className={styles.sectionHeadText}>
          Tech Stack.
        </h2>
      </div>

      <div className="mt-14 flex flex-row flex-wrap justify-center gap-8 sm:gap-10">
        {technologies.map((technology) => (
          <div
            key={technology.name}
            className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
          >
            {isVisible && (
              <img
                src={technology.icon}
                alt={`${technology.name} technology`}
                title={technology.name}
                width={112}
                height={112}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "");
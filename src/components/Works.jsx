import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  backend_code_link,
  live_site_link,
}) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
    >
      <Tilt
        options={{
          max: 25,
          scale: 1,
          speed: 400,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        {/* Project Image */}
        <div
          className="relative w-full h-[230px] rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#100d25" }}
        >
          <img
            src={image}
            alt={`${name} project screenshot`}
            loading="lazy"
            decoding="async"
            width="360"
            height="230"
            className="w-full h-full object-contain"
          />

          {/* GitHub Icon */}
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <a
              href={source_code_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${name} source code`}
              title="View source code"
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt=""
                loading="lazy"
                decoding="async"
                width="20"
                height="20"
                className="w-1/2 h-1/2 object-contain"
              />
            </a>
          </div>
        </div>

        {/* Project Details */}
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">
            {name}
          </h3>

          <p className="mt-2 text-secondary text-[14px] leading-[22px]">
            {description}
          </p>
        </div>

        {/* Project Links */}
        <div className="mt-5 flex flex-wrap gap-3">
          {live_site_link && (
            <a
              href={live_site_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-[#915EFF] hover:bg-[#7a45e6] transition-colors duration-200"
            >
              Live Demo ↗
            </a>
          )}

          <a
            href={source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-white border border-[#915EFF] hover:bg-[#915EFF] transition-colors duration-200"
          >
            {backend_code_link ? "Frontend Code" : "Source Code"} ↗
          </a>

          {backend_code_link && (
            <a
              href={backend_code_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-white border border-[#915EFF] hover:bg-[#915EFF] transition-colors duration-200"
            >
              Backend Code ↗
            </a>
          )}
        </div>

        {/* Technologies */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My work</p>

        <h2 className={styles.sectionHeadText}>
          Projects.
        </h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          A mix of production platforms I have shipped and projects I built
          to go deeper on the MERN stack. Each one includes links to the
          source code, and a live demo where the app is deployed.
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            {...project}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
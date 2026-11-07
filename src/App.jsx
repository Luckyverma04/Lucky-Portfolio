import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Socials from "./components/Socials";
import Hero from "./components/Hero";
import About from "./components/About";
import WhatIDo from "./components/WhatIDo";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Loader />
      <Cursor />
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <Socials />
      <main>
        <Hero />
        <About />
        <WhatIDo />
        <Experience />
        <Projects />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

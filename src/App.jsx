import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import StarsCanvas from "./canvas/Stars";

export default function App() {
  return (
    <div className="app">
      <StarsCanvas />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Lucky Verma · Built with React & Three.js
      </footer>
    </div>
  );
}

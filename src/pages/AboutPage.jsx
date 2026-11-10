import About from "../components/About";
import TechStack from "../components/TechStack";
import usePageTitle from "../components/usePageTitle";

export default function AboutPage() {
  usePageTitle("About");
  return (
    <div className="pt-12">
      <About />
      <TechStack />
    </div>
  );
}

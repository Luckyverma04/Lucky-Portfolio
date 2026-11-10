import Experience from "../components/Experience";
import usePageTitle from "../components/usePageTitle";

export default function ExperiencePage() {
  usePageTitle("Career");
  return <div className="pt-12"><Experience /></div>;
}

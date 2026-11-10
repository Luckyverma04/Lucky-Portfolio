import Contact from "../components/Contact";
import usePageTitle from "../components/usePageTitle";

export default function ContactPage() {
  usePageTitle("Contact");
  return <div className="pt-12"><Contact /></div>;
}

import { Link } from "react-router-dom";
import usePageTitle from "../components/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="wrap grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <p className="h-display text-[clamp(80px,16vw,180px)] grad-text">404</p>
        <p className="mt-4 text-lg text-muted">This page doesn't exist.</p>
        <Link to="/" className="btn btn-primary mt-8">Back to home</Link>
      </div>
    </section>
  );
}

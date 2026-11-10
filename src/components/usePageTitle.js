import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Lucky Verma` : "Lucky Verma | Backend & MERN Stack Developer";
  }, [title]);
}

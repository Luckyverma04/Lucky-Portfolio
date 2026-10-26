import { useCallback, useEffect, useRef, useState } from "react";
import { Close } from "./Icons";

function Lightbox({ images, index, onClose, onIndex }) {
  const closeRef = useRef(null);
  const n = images.length;
  const go = useCallback((d) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; prev?.focus?.(); };
  }, [go, onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4 backdrop-blur-sm" onClick={onClose}>
      <button ref={closeRef} onClick={onClose} aria-label="Close" className="btn absolute right-4 top-4 !bg-black/50 !px-3 !py-2 text-white"><Close /></button>
      {n > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous image" className="btn absolute left-3 top-1/2 !-translate-y-1/2 !bg-black/50 !px-3 !py-3 text-white">←</button>
          <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next image" className="btn absolute right-3 top-1/2 !-translate-y-1/2 !bg-black/50 !px-3 !py-3 text-white">→</button>
        </>
      )}
      <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={images[index].src} alt={images[index].caption} className="max-h-[80vh] w-auto rounded-lg object-contain" />
        <figcaption className="mt-3 text-center text-sm capitalize text-white/80">{images[index].caption} <span className="text-white/50">· {index + 1}/{n}</span></figcaption>
      </figure>
    </div>
  );
}

// Shows the first image large, thumbnails below when there is more than one. Click to enlarge.
export default function Gallery({ images, title, thumbsOnly = false }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  if (!images.length) return null;

  return (
    <div className="space-y-2">
      {!thumbsOnly && (
        <button type="button" onClick={() => setOpen(true)} className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-bg" aria-label={`Enlarge ${title} image: ${images[active].caption}`}>
          <img src={images[active].src} alt={`${title}: ${images[active].caption}`} loading="lazy" className="project-img w-full" />
        </button>
      )}
      {(images.length > 1 || thumbsOnly) && (
        <ul className={`grid gap-2 ${thumbsOnly ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-4 sm:grid-cols-5"}`}>
          {images.map((im, i) => (
            <li key={im.src}>
              <button
                type="button"
                onClick={() => (thumbsOnly ? (setActive(i), setOpen(true)) : setActive(i))}
                aria-label={`${thumbsOnly ? "Enlarge" : "Show"} ${im.caption}`}
                aria-current={!thumbsOnly && i === active}
                className={`block w-full overflow-hidden rounded-lg border bg-bg transition-opacity ${!thumbsOnly && i !== active ? "border-line opacity-60 hover:opacity-100" : "border-brand/60"} ${thumbsOnly ? "cursor-zoom-in" : ""}`}
              >
                <img src={im.src} alt="" loading="lazy" className="aspect-video w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && <Lightbox images={images} index={active} onClose={close} onIndex={setActive} />}
    </div>
  );
}

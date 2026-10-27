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

/**
 * The first `lead` images stay on screen all the time, side by side. The rest play in one frame
 * below and change by themselves every 3 seconds. Hovering or focusing the frame, the Pause
 * button or reduced-motion stops the auto-change. The small thumbnails jump to any image.
 */
function Showcase({ images, title, lead }) {
  const first = images.slice(0, lead);
  const rest = images.slice(lead);
  const n = rest.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const play = !reduce && !paused && !hover && n > 1;

  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 3000);
    return () => clearInterval(t);
  }, [play, n]);

  const cur = rest[i];

  return (
    <div className="space-y-3">
      <style>{`.gal-fade{animation:galfade .5s ease}@keyframes galfade{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.gal-fade{animation:none}}`}</style>

      <ul className="grid grid-cols-2 gap-2">
        {first.map((im) => (
          <li key={im.src} className="overflow-hidden rounded-xl border border-line bg-bg">
            <img src={im.src} alt={`${title}: ${im.caption}`} loading="lazy" className="project-img aspect-video w-full object-contain" />
          </li>
        ))}
      </ul>

      <div className="mx-auto max-w-3xl space-y-2" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
        <div className="aspect-[2/1] overflow-hidden rounded-xl border border-line bg-bg">
          <img key={cur.src} src={cur.src} alt={`${title}: ${cur.caption}`} className="gal-fade h-full w-full object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <ul className="flex flex-1 gap-2">
            {rest.map((im, k) => (
              <li key={im.src} className="w-14 sm:w-16">
                <button type="button" onClick={() => setI(k)} aria-label={`Show ${im.caption}`} aria-current={k === i}
                  className={`block w-full overflow-hidden rounded-lg border bg-bg transition-opacity ${k === i ? "border-brand/60" : "border-line opacity-60 hover:opacity-100"}`}>
                  <img src={im.src} alt="" loading="lazy" className="aspect-video w-full object-contain" />
                </button>
              </li>
            ))}
          </ul>
          {n > 1 && !reduce && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="btn !px-3 !py-1.5 text-xs">{paused ? "Play" : "Pause"}</button>
          )}
        </div>
        <p className="text-xs capitalize text-muted">{cur.caption} · {i + 1}/{n}</p>
      </div>
    </div>
  );
}

// Shows the first image large, thumbnails below when there is more than one. Click to enlarge.
export default function Gallery({ images, title, thumbsOnly = false, stacked = false, lead = 0 }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  if (!images.length) return null;

  if (lead > 0 && images.length > lead) return <Showcase images={images} title={title} lead={lead} />;

  // stacked: every image shown full size, one below the other. Click any to enlarge.
  if (stacked) {
    return (
      <div className="space-y-3">
        {images.map((im, i) => (
          <button key={im.src} type="button" onClick={() => { setActive(i); setOpen(true); }} className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-bg" aria-label={`Enlarge ${title} image: ${im.caption}`}>
            <img src={im.src} alt={`${title}: ${im.caption}`} loading="lazy" className="project-img w-full" />
          </button>
        ))}
        {open && <Lightbox images={images} index={active} onClose={close} onIndex={setActive} />}
      </div>
    );
  }

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
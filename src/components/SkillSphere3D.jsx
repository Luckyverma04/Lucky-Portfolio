import { useEffect, useRef } from "react";
import * as THREE from "three";

const rgb = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
const css = (name) => { const [r, g, b] = rgb(name); return `rgb(${r},${g},${b})`; };

function labelTexture(text, color) {
  const c = document.createElement("canvas");
  const x0 = c.getContext("2d");
  const font = "600 52px ui-sans-serif, system-ui, sans-serif";
  x0.font = font;
  const w = Math.ceil(x0.measureText(text).width) + 24;
  c.width = w; c.height = 84;
  const x = c.getContext("2d");
  x.font = font; x.textBaseline = "middle"; x.fillStyle = color; x.fillText(text, 12, 46);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return { t, ratio: w / 84 };
}

/**
 * A globe of tool names. It turns by itself, drag to spin it, hover a name to pick it out.
 * Names at the back fade and shrink so it reads as 3D. Only runs while on screen.
 * With reduced motion it does not turn by itself but still responds to drag and hover.
 * items: [{ label, tone }] where tone is "brand" | "ink" | "violet".
 */
export default function SkillSphere3D({ items, onFail }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
    catch { onFail?.(); return; }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const cv = renderer.domElement;
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";
    el.appendChild(cv);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const globe = new THREE.Group(); scene.add(globe);
    const R = 3.1, n = items.length, golden = Math.PI * (3 - Math.sqrt(5));

    const tags = items.map((it, i) => {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * golden;
      const pos = new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
      sp.position.copy(pos); globe.add(sp);
      return { sp, it, pos, ratio: 1, base: 0.5 };
    });

    const paint = () => {
      tags.forEach((g) => {
        g.sp.material.map?.dispose();
        const { t, ratio } = labelTexture(g.it.label, css(g.it.tone === "brand" ? "--brand" : g.it.tone === "violet" ? "--violet" : "--ink"));
        g.sp.material.map = t; g.sp.material.needsUpdate = true; g.ratio = ratio;
      });
    };
    paint();

    // a faint ring of dots so the globe has a shape even between names
    const dotGeo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 160; i++) {
      const y = 1 - (i / 159) * 2, r = Math.sqrt(1 - y * y), th = i * golden;
      pts.push(Math.cos(th) * r * R * 0.985, y * R * 0.985, Math.sin(th) * r * R * 0.985);
    }
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const dotMat = new THREE.PointsMaterial({ size: 0.045, transparent: true, opacity: 0.35, depthTest: false });
    globe.add(new THREE.Points(dotGeo, dotMat));
    const dotColor = () => dotMat.color.set(css("--muted"));
    dotColor();

    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
    let hover = null, dragging = false, last = { x: 0, y: 0 }, vel = { x: 0, y: 0 }, inside = false;
    const tmp = new THREE.Vector3();

    const update = () => {
      globe.updateMatrixWorld();
      tags.forEach((g) => {
        tmp.copy(g.pos).applyMatrix4(globe.matrixWorld);
        const d = (tmp.z + R) / (2 * R);
        const hot = g === hover;
        const s = (0.4 + 0.22 * d) * (hot ? 1.35 : 1);
        g.sp.scale.set(s * g.ratio, s, 1);
        g.sp.material.opacity = hot ? 1 : 0.22 + 0.78 * d;
        g.sp.renderOrder = hot ? 999 : Math.round(d * 100);
      });
    };
    const render = () => { update(); renderer.render(scene, camera); };

    const frame = () => {
      if (!dragging) {
        vel.y += ((still || hover || inside ? 0 : 0.0035) - vel.y) * 0.05;
        vel.x *= 0.92;
      }
      globe.rotation.y += vel.y; globe.rotation.x = Math.max(-0.9, Math.min(0.9, globe.rotation.x + vel.x));
      render();
    };

    const pick = (e) => {
      const b = cv.getBoundingClientRect();
      ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      update();
      const hit = ray.intersectObjects(tags.map((g) => g.sp), false).filter((h) => h.object.material.opacity > 0.45)[0];
      hover = hit ? tags.find((g) => g.sp === hit.object) : null;
      cv.style.cursor = dragging ? "grabbing" : hover ? "pointer" : "grab";
    };
    const onDown = (e) => { dragging = true; last = { x: e.clientX, y: e.clientY }; cv.setPointerCapture?.(e.pointerId); cv.style.cursor = "grabbing"; };
    const onMove = (e) => {
      if (dragging) {
        const dx = e.clientX - last.x, dy = e.clientY - last.y; last = { x: e.clientX, y: e.clientY };
        vel.y = dx * 0.006; vel.x = dy * 0.004;
        globe.rotation.y += vel.y; globe.rotation.x = Math.max(-0.9, Math.min(0.9, globe.rotation.x + vel.x));
        if (still) render();
      } else { pick(e); if (still) render(); }
    };
    const onUp = () => { dragging = false; cv.style.cursor = hover ? "pointer" : "grab"; };
    const onEnter = () => { inside = true; };
    const onLeave = () => { inside = false; hover = null; dragging = false; if (still) render(); };
    cv.addEventListener("pointerdown", onDown); cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp); cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerenter", onEnter); cv.addEventListener("pointerleave", onLeave);

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const t = Math.tan((camera.fov * Math.PI) / 360);
      camera.position.set(0, 0, Math.max(9.5, 4.0 / t / Math.min(1, camera.aspect)));
      camera.updateProjectionMatrix();
      render();
    };

    let raf = 0, visible = true;
    const loop = () => { frame(); raf = requestAnimationFrame(loop); };
    const start = () => { if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const ro = new ResizeObserver(resize); ro.observe(el);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }); io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(() => { paint(); dotColor(); render(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    globe.rotation.set(0.25, 0.6, 0);
    resize(); start();

    return () => {
      stop(); ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("pointerdown", onDown); cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp); cv.removeEventListener("pointercancel", onUp);
      cv.removeEventListener("pointerenter", onEnter); cv.removeEventListener("pointerleave", onLeave);
      tags.forEach((g) => { g.sp.material.map?.dispose(); g.sp.material.dispose(); });
      dotGeo.dispose(); dotMat.dispose(); renderer.dispose(); cv.remove();
    };
  }, [items, onFail]);

  return <div ref={host} className="relative h-[340px] w-full md:h-[420px]" role="img" aria-label="A rotating globe of the tools I use. The same tools are listed in the cards below." />;
}
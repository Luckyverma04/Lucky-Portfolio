import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// The four steps of the lead lifecycle on the Trazoo platform (same as the list beside it).
const STEPS = [
  { label: "Capture", sub: "Web, CSV or manual" },
  { label: "Assign", sub: "PENDING to ACTIVE" },
  { label: "Work", sub: "Calls and notes" },
  { label: "Close", sub: "Converted or not" },
];

const rgb = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
const toColor = (name) => { const [r, g, b] = rgb(name); return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace); };

/**
 * Four pads on a diagonal, one per step. Small cubes (leads) hop from pad to pad and each pad
 * lights up as a lead lands on it. The step names are real HTML next to each pad (sharp text, easy
 * to read). Only runs while on screen; with reduced motion it is one still frame.
 */
export default function LeadFlow3D({ onFail }) {
  const host = useRef(null);
  const tags = useRef([]);

  useEffect(() => {
    const el = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
    catch { onFail?.(); return; }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    el.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(4, 8, 7); scene.add(key);

    const world = new THREE.Group(); scene.add(world);
    const padGeo = new RoundedBoxGeometry(1.5, 0.22, 1.5, 3, 0.08);
    const padEdge = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 0.22, 1.5));
    const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const cubeEdge = new THREE.EdgesGeometry(cubeGeo);
    const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 });

    const pts = STEPS.map((_, i) => new THREE.Vector3(-1.7 + i * 0.45, 2.2 - i * 1.45, 0));
    const pads = STEPS.map((_, i) => {
      const mat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
      const mesh = new THREE.Mesh(padGeo, mat); mesh.position.copy(pts[i]);
      mesh.add(new THREE.LineSegments(padEdge, lineMat));
      world.add(mesh);
      return { mesh, mat, glow: 0, anchor: new THREE.Vector3(pts[i].x + 0.95, pts[i].y, 0) };
    });

    const pathGeo = new THREE.BufferGeometry().setFromPoints(pts.slice(0, -1).flatMap((p, i) => [p.clone().setY(p.y - 0.05), pts[i + 1].clone().setY(pts[i + 1].y - 0.05)]));
    const pathMat = new THREE.LineDashedMaterial({ dashSize: 0.12, gapSize: 0.12, transparent: true, opacity: 0.8 });
    const path = new THREE.LineSegments(pathGeo, pathMat); path.computeLineDistances(); world.add(path);

    const cubeMat = new THREE.MeshStandardMaterial({ roughness: 0.5 });
    const cubes = [0, 1, 2].map(() => {
      const m = new THREE.Mesh(cubeGeo, cubeMat); m.add(new THREE.LineSegments(cubeEdge, lineMat)); world.add(m); return m;
    });

    const theme = () => {
      const pad = toColor("--band"), cube = toColor("--slab-a"), edge = toColor("--slab-edge");
      pads.forEach((p) => { p.mat.color.copy(pad); p.mat.emissive.copy(cube); });
      cubeMat.color.copy(cube);
      lineMat.color.copy(edge);
      pathMat.color.copy(toColor("--muted"));
    };
    theme();

    const mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = (e.clientY / window.innerHeight) * 2 - 1; };
    if (!still) window.addEventListener("pointermove", onMove, { passive: true });

    const L = 4.8, ease = (f) => f * f * (3 - 2 * f), v = new THREE.Vector3();
    const draw = (t) => {
      cur.x += (mouse.x - cur.x) * 0.06; cur.y += (mouse.y - cur.y) * 0.06;
      world.rotation.y = -0.55 + cur.x * 0.18;
      world.rotation.x = 0.32 + cur.y * 0.05;
      const us = cubes.map((_, k) => (still ? [0.4, 1.5, 2.6][k] : (((t * 0.5 + k * (L / 3)) % L) + L) % L));
      pads.forEach((p) => { p.glow = 0; });
      cubes.forEach((m, k) => {
        const u = us[k];
        const seg = Math.min(2, Math.floor(u)), f = u >= 3 ? 1 : ease(u - seg);
        const a = pts[Math.min(3, seg)], b = pts[Math.min(3, seg + 1)];
        m.position.lerpVectors(a, b, f);
        m.position.y += 0.31 + (u < 3 ? Math.sin(Math.PI * (u - seg)) * 0.55 : 0);
        m.rotation.y = u * 1.2;
        const sc = u < 0.3 ? u / 0.3 : u > 3.4 ? Math.max(0, 1 - (u - 3.4) / 1.2) : 1;
        m.scale.setScalar(Math.max(0.001, sc));
        pads.forEach((p, i) => { p.glow = Math.max(p.glow, Math.max(0, 1 - Math.abs(Math.min(u, 3) - i) * 1.8) * (sc > 0.2 ? 1 : 0)); });
      });
      pads.forEach((p) => { p.mat.emissiveIntensity = p.glow * 0.45; });
      renderer.render(scene, camera);

      // keep the HTML step labels next to their pads
      world.updateMatrixWorld();
      const w = el.clientWidth, h = el.clientHeight;
      pads.forEach((p, i) => {
        const tag = tags.current[i]; if (!tag) return;
        v.copy(p.anchor).applyMatrix4(world.matrixWorld).project(camera);
        tag.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translateY(-50%)`;
        tag.style.opacity = "1";
      });
    };

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const tn = Math.tan((camera.fov * Math.PI) / 360);
      // pads take the left part of the box, the step names sit to their right
      camera.position.set(0.45, 0.2, Math.max(10, 3.4 / (camera.aspect * tn)));
      camera.lookAt(0.45, 0, 0);
      camera.updateProjectionMatrix();
      draw(0);
    };

    let raf = 0, visible = true;
    const clock = new THREE.Clock();
    const loop = () => { draw(clock.getElapsedTime()); raf = requestAnimationFrame(loop); };
    const start = () => { if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const ro = new ResizeObserver(resize); ro.observe(el);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }); io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(() => { theme(); draw(clock.getElapsedTime()); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    resize(); start();

    return () => {
      stop(); ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      pads.forEach((p) => p.mat.dispose());
      padGeo.dispose(); padEdge.dispose(); cubeGeo.dispose(); cubeEdge.dispose(); pathGeo.dispose();
      cubeMat.dispose(); lineMat.dispose(); pathMat.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [onFail]);

  return (
    <div ref={host} className="relative h-[360px] w-full overflow-hidden" role="img"
      aria-label="A small 3D animation of leads moving through four steps: capture, assign, work and close.">
      {STEPS.map((s, i) => (
        <div key={s.label} ref={(n) => { tags.current[i] = n; }} aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-lg px-3 py-1.5 opacity-0"
          style={{ background: "rgb(var(--chip-bg))", color: "rgb(var(--chip-ink))" }}>
          <p className="text-[15px] font-semibold leading-tight">{s.label}</p>
          <p className="mt-0.5 font-mono text-[11px] leading-tight" style={{ color: "rgb(var(--chip-sub))" }}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
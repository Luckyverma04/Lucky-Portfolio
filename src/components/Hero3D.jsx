import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// One slab per layer of the stack. g 0 = the main apps, g 1 = the BGV project.
const LAYERS = [
  { label: "React", sub: "Interface", g: 0 },
  { label: "Express API", sub: "REST · JWT auth", g: 0 },
  { label: "MongoDB", sub: "Leads, bookings, runs", g: 0 },
  { label: "Express API", sub: "BGV · Node.js", g: 1 },
  { label: "ML service", sub: "FastAPI · BGE-M3", g: 1 },
];

const rgb = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
const toColor = (name) => { const [r, g, b] = rgb(name); return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace); };
const css = (name) => { const [r, g, b] = rgb(name); return `rgb(${r},${g},${b})`; };

function labelTexture(text, sub, bg, ink, subc) {
  const c = document.createElement("canvas");
  c.width = 560; c.height = 170;
  const x = c.getContext("2d");
  x.textBaseline = "top";
  const t1 = "600 50px ui-sans-serif, system-ui, sans-serif", t2 = "400 30px ui-monospace, SFMono-Regular, Menlo, monospace";
  x.font = t1; const w1 = x.measureText(text).width;
  x.font = t2; const w2 = x.measureText(sub).width;
  const w = Math.min(550, Math.max(w1, w2) + 52);
  x.fillStyle = bg; x.beginPath(); x.roundRect(2, 14, w, 134, 24); x.fill();
  x.fillStyle = ink; x.font = t1; x.fillText(text, 26, 28);
  x.fillStyle = subc; x.font = t2; x.fillText(sub, 26, 92);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

/**
 * A small 3D stack of slabs (React > Express > MongoDB, then the BGV layers) that follows the
 * mouse a little and lights up one layer after another, like a request travelling down.
 * Only runs while on screen. With reduced motion it draws a single still frame.
 */
export default function Hero3D({ onFail }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
    catch { onFail?.(); return; }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 9, 7); scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 40, 40); rim.position.set(-7, 2, -3); scene.add(rim);

    const GAP = 1.5, H = 0.32, W = 3.6;
    const geo = new RoundedBoxGeometry(W, H, W, 3, 0.1);
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, W));
    const stack = new THREE.Group();
    stack.position.x = -1.35;
    scene.add(stack);

    const slabs = LAYERS.map((L, i) => {
      const y = ((LAYERS.length - 1) / 2 - i) * GAP;
      const mat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.05 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = y;
      const edge = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.85 }));
      mesh.add(edge);
      const label = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
      label.center.set(0, 0.5); label.scale.set(2.55, 0.774, 1); label.position.set(2.9, y, 0);
      stack.add(mesh, label);
      return { mesh, mat, edge, label, y, L, glow: 0 };
    });

    const theme = () => {
      const brand = toColor("--brand"), slabA = toColor("--slab-a"), slabB = toColor("--slab-b"), edge = toColor("--slab-edge");
      const bg = css("--chip-bg"), ink = css("--chip-ink"), sub = css("--chip-sub");
      rim.color.copy(brand);
      slabs.forEach((s) => {
        s.mat.color.copy(s.L.g === 0 ? slabA : slabB);
        s.mat.emissive.copy(brand);
        s.edge.material.color.copy(edge);
        s.label.material.map?.dispose();
        s.label.material.map = labelTexture(s.L.label, s.L.sub, bg, ink, sub);
        s.label.material.needsUpdate = true;
      });
    };
    theme();

    // mouse: small turn and tilt
    const mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = (e.clientY / window.innerHeight) * 2 - 1; };
    if (!still) window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const t = Math.tan((camera.fov * Math.PI) / 360);
      const dist = Math.max(12, 4.15 / (camera.aspect * t));
      camera.position.set(0, 2.6, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      draw(0);
    };

    const draw = (t) => {
      cur.x += (mouse.x - cur.x) * 0.06; cur.y += (mouse.y - cur.y) * 0.06;
      stack.rotation.y = -0.62 + cur.x * 0.28;
      stack.rotation.x = 0.1 + cur.y * 0.08;
      stack.position.y = -0.3 + (still ? 0 : Math.sin(t * 0.6) * 0.08);
      const active = still ? -1 : Math.floor(t * 1.1) % (LAYERS.length + 2);
      slabs.forEach((s, i) => {
        s.mesh.position.y = s.y + (still ? 0 : Math.sin(t * 0.8 + i) * 0.035);
        const target = i === active ? 0.55 : 0;
        s.glow += (target - s.glow) * 0.12;
        s.mat.emissiveIntensity = s.glow;
      });
      renderer.render(scene, camera);
    };

    let raf = 0, visible = true;
    const clock = new THREE.Clock();
    const loop = () => { draw(clock.getElapsedTime()); raf = requestAnimationFrame(loop); };
    const start = () => { if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const ro = new ResizeObserver(resize); ro.observe(el);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); });
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(() => { theme(); draw(clock.getElapsedTime()); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    resize(); start();

    return () => {
      stop(); ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      slabs.forEach((s) => { s.mat.dispose(); s.edge.material.dispose(); s.label.material.map?.dispose(); s.label.material.dispose(); });
      geo.dispose(); edgeGeo.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onFail]);

  return (
    <div className="absolute inset-0" role="img"
      aria-label="Stack I work across: a React app calls an Express API, which uses MongoDB and, in the BGV project, a Python ML service">
      <div ref={host} className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
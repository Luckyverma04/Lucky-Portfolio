import { useEffect, useRef } from "react";
import * as THREE from "three";

const rgb = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
const toColor = (name) => { const [r, g, b] = rgb(name); return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace); };

/**
 * A small 3D envelope. It turns a little with the mouse and floats. When `open` is true (the
 * visitor is typing in the form) the flap opens and a letter slides out. Only runs while on screen;
 * with reduced motion it just switches between a closed and an open still.
 */
export default function Envelope3D({ open, onFail }) {
  const host = useRef(null);
  const openRef = useRef(open);
  const api = useRef(null);
  openRef.current = open;

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
    camera.position.set(0, 0.4, 12.5);
    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 6, 8); scene.add(key);

    const W = 3.4, H = 2.2, T = 0.14;
    const env = new THREE.Group(); scene.add(env);
    const mats = {
      body: new THREE.MeshStandardMaterial({ roughness: 0.65 }),
      flap: new THREE.MeshStandardMaterial({ roughness: 0.65, side: THREE.DoubleSide }),
      paper: new THREE.MeshStandardMaterial({ roughness: 0.9, side: THREE.DoubleSide }),
      ink: new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide }),
    };
    const lineMat = new THREE.LineBasicMaterial();

    const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), mats.body);
    env.add(body);

    // letter sits inside the body and slides up out of it
    const letter = new THREE.Group(); env.add(letter);
    letter.add(new THREE.Mesh(new THREE.PlaneGeometry(W - 0.5, H - 0.4), mats.paper));
    [0.55, 0.2, -0.15, -0.5].forEach((y, i) => {
      const l = new THREE.Mesh(new THREE.PlaneGeometry(i === 3 ? 1.1 : 2.2, 0.09), mats.ink);
      l.position.set(i === 3 ? -0.55 : 0, y, 0.004); letter.add(l);
    });

    // V fold on the front
    const v = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-W / 2, H / 2, T / 2 + 0.003), new THREE.Vector3(0, -0.25, T / 2 + 0.003),
      new THREE.Vector3(0, -0.25, T / 2 + 0.003), new THREE.Vector3(W / 2, H / 2, T / 2 + 0.003),
      new THREE.Vector3(-W / 2, -H / 2, T / 2 + 0.003), new THREE.Vector3(0, -0.25, T / 2 + 0.003),
      new THREE.Vector3(0, -0.25, T / 2 + 0.003), new THREE.Vector3(W / 2, -H / 2, T / 2 + 0.003),
    ]);
    env.add(new THREE.LineSegments(v, lineMat));

    // flap hangs from the top edge and swings back when opened
    const pivot = new THREE.Group(); pivot.position.set(0, H / 2, T / 2 + 0.02); env.add(pivot);
    const shape = new THREE.Shape(); shape.moveTo(-W / 2, 0); shape.lineTo(W / 2, 0); shape.lineTo(0, -1.45); shape.closePath();
    const flap = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false }), mats.flap);
    pivot.add(flap);
    const seal = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), mats.ink);
    seal.position.set(0, -0.92, 0.05); pivot.add(seal);
    const flapEdge = new THREE.LineSegments(new THREE.EdgesGeometry(flap.geometry), lineMat); pivot.add(flapEdge);

    const theme = () => {
      const cream = toColor("--slab-a"), burg = toColor("--band"), edge = toColor("--slab-edge");
      mats.body.color.copy(cream).multiplyScalar(0.94);
      mats.flap.color.copy(cream).multiplyScalar(0.86);
      mats.paper.color.set(0xfbf6ec);
      mats.ink.color.copy(burg);
      lineMat.color.copy(edge);
    };
    theme();

    const mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = (e.clientY / window.innerHeight) * 2 - 1; };
    if (!still) window.addEventListener("pointermove", onMove, { passive: true });

    let openT = 0;
    const draw = (t) => {
      const target = openRef.current ? 1 : 0;
      openT = still ? target : openT + (target - openT) * 0.08;
      cur.x += (mouse.x - cur.x) * 0.06; cur.y += (mouse.y - cur.y) * 0.06;
      env.rotation.y = (still ? -0.3 : Math.sin(t * 0.5) * 0.25 - 0.2) + cur.x * 0.3;
      env.rotation.x = -0.12 + cur.y * 0.12;
      env.position.y = still ? -0.2 : Math.sin(t * 0.7) * 0.1 - 0.2;
      pivot.rotation.x = openT * Math.PI * 0.93;
      const lift = Math.max(0, (openT - 0.45) / 0.55);
      letter.position.set(0, lift * lift * 1.15 * (2 - lift), 0);
      renderer.render(scene, camera);
    };
    api.current = { draw };

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const t = Math.tan((camera.fov * Math.PI) / 360);
      camera.position.z = Math.max(8, 2.7 / (camera.aspect * t));
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
      api.current = null;
      stop(); ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => { o.geometry?.dispose(); });
      Object.values(mats).forEach((m) => m.dispose()); lineMat.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [onFail]);

  // with reduced motion there is no loop, so redraw when the state changes
  useEffect(() => { api.current?.draw(0); }, [open]);

  return <div ref={host} className="relative h-[240px] w-full md:h-[280px]" role="img" aria-label="A small 3D envelope that opens while you write a message" />;
}
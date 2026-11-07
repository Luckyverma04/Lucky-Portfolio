import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Decal, Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";

import js from "../assets/tech/javascript.png";
import node from "../assets/tech/nodejs.png";
import react from "../assets/tech/reactjs.png";
import mongo from "../assets/tech/mongodb.png";
import html from "../assets/tech/html.png";
import css from "../assets/tech/css.png";
import tw from "../assets/tech/tailwind.png";
import git from "../assets/tech/git.png";
import redux from "../assets/tech/redux.png";

// Next.js mark drawn inline (no image file in the repo for it).
const next = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 128 128"><circle cx="64" cy="64" r="62" fill="#000"/><path d="M45 40v48M45 40l42 54" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M84 40v30" stroke="#fff" stroke-width="9" stroke-linecap="round"/></svg>');

const ICONS = [node, react, next, mongo, js, tw, git, redux, html, css, node, react, next, mongo];
const R = 0.62;

/**
 * Glossy balls with tech logos. Each ball is pulled back to its home spot by a spring and pushed
 * away by the mouse and by the other balls, so you can shove them around.
 */
function Balls() {
  const tex = useTexture(ICONS);
  const { viewport, pointer } = useThree();
  const meshes = useRef([]);
  const sim = useMemo(() => {
    const cols = viewport.width < 7 ? 3 : 5;
    return ICONS.map((_, i) => {
      const row = Math.floor(i / cols), col = i % cols;
      const n = Math.min(cols, ICONS.length - row * cols);
      const home = new THREE.Vector3((col - (n - 1) / 2) * 1.6 + (row % 2) * 0.3, 1.5 - row * 1.45, (Math.random() - 0.5) * 0.6);
      return { home, pos: home.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, -3 - Math.random() * 2, 0)), vel: new THREE.Vector3(), seed: Math.random() * 10 };
    });
  }, [viewport.width]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const mouse = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 20);
    const t = clock.elapsedTime;
    mouse.set(pointer.x * viewport.width / 2, pointer.y * viewport.height / 2, 0);
    sim.forEach((b, i) => {
      // spring home
      tmp.copy(b.home).sub(b.pos).multiplyScalar(9);
      b.vel.addScaledVector(tmp, dt);
      // mouse push
      tmp.copy(b.pos).sub(mouse); tmp.z = 0;
      const d = tmp.length();
      if (d < 1.6) b.vel.addScaledVector(tmp.normalize(), (1.6 - d) * 40 * dt);
      // keep apart
      for (let j = i + 1; j < sim.length; j++) {
        const o = sim[j];
        tmp.copy(b.pos).sub(o.pos);
        const dd = tmp.length();
        if (dd < R * 2 && dd > 0.0001) {
          tmp.multiplyScalar((R * 2 - dd) / dd * 0.5);
          b.pos.add(tmp); o.pos.sub(tmp);
        }
      }
      b.vel.multiplyScalar(Math.exp(-3.2 * dt));
      b.pos.addScaledVector(b.vel, dt);
      const m = meshes.current[i];
      if (m) {
        m.position.copy(b.pos);
        // tilt with the push but keep the logo facing you
        m.rotation.x = THREE.MathUtils.damp(m.rotation.x, -b.vel.y * 0.25 + Math.sin(t + b.seed) * 0.08, 4, dt);
        m.rotation.y = THREE.MathUtils.damp(m.rotation.y, b.vel.x * 0.25 + Math.cos(t + b.seed) * 0.12, 4, dt);
      }
    });
  });

  return sim.map((b, i) => (
    <mesh key={i} ref={(el) => (meshes.current[i] = el)} position={b.pos}>
      <sphereGeometry args={[R, 32, 32]} />
      <meshPhysicalMaterial color="#f1f0f7" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
      <Decal position={[0, 0, R]} rotation={[0, 0, 0]} scale={0.75}>
        <meshStandardMaterial map={tex[i]} transparent polygonOffset polygonOffsetFactor={-10} roughness={0.3} toneMapped={false} />
      </Decal>
    </mesh>
  ));
}

export default function TechBalls() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 6]} intensity={1.5} />
      <pointLight position={[-5, 0, 3]} intensity={25} color="#5eead4" />
      <pointLight position={[5, 0, 3]} intensity={25} color="#f472b6" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 3, 5]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#5eead4" position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[5, 5, 1]} />
        <Lightformer form="rect" intensity={2} color="#f472b6" position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[5, 5, 1]} />
      </Environment>
      <Balls />
    </>
  );
}

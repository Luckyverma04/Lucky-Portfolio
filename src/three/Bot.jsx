import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * "LV-bot": a small developer robot built from basic shapes (no downloaded model).
 * The head turns toward the mouse, the eyes blink, the antenna light pulses.
 * typing = arms reach forward and tap, used in the desk scene.
 */
const shell = { color: "#eceaf4", roughness: 0.25, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.15 };
const visor = { color: "#05070d", roughness: 0.35, metalness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.4, envMapIntensity: 0.25 };
const hoodie = { color: "#1c2340", roughness: 0.6, metalness: 0.05 };
const TEAL = new THREE.Color("#5eead4").multiplyScalar(2.2);
const PINK = new THREE.Color("#f472b6").multiplyScalar(2);

function Eye({ x, eyeRef }) {
  return (
    <mesh ref={eyeRef} position={[x, 0.08, 0.7]}>
      <capsuleGeometry args={[0.09, 0.14, 6, 16]} />
      <meshBasicMaterial color={TEAL} toneMapped={false} />
    </mesh>
  );
}

function Arm({ side, armRef }) {
  return (
    <group ref={armRef} position={[side * 0.78, -1.05, 0]}>
      <mesh position={[0, -0.42, 0]}>
        <capsuleGeometry args={[0.16, 0.6, 8, 16]} />
        <meshStandardMaterial {...hoodie} />
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshPhysicalMaterial {...shell} />
      </mesh>
    </group>
  );
}

export default function Bot({ typing = false, follow = true, ...props }) {
  const head = useRef();
  const eyes = [useRef(), useRef()];
  const pupils = useRef();
  const arms = [useRef(), useRef()];
  const bulb = useRef();
  const body = useRef();
  const blink = useRef({ next: 2, t: 0 });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { x, y } = follow ? state.pointer : { x: 0, y: 0 };
    if (head.current) {
      const ty = typing ? -0.25 + Math.sin(t * 0.7) * 0.15 : x * 0.6;
      const tx = typing ? 0.25 : -y * 0.35;
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, ty, 5, dt);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tx, 5, dt);
    }
    if (pupils.current) {
      pupils.current.position.x = THREE.MathUtils.damp(pupils.current.position.x, typing ? 0 : x * 0.08, 8, dt);
      pupils.current.position.y = THREE.MathUtils.damp(pupils.current.position.y, typing ? -0.05 : y * 0.05, 8, dt);
    }
    // blink every few seconds
    const b = blink.current;
    b.t += dt;
    let s = 1;
    if (b.t > b.next) { const k = (b.t - b.next) / 0.16; s = k < 1 ? Math.abs(1 - 2 * k) + 0.05 : 1; if (k >= 1) { b.t = 0; b.next = 2 + Math.random() * 3; } }
    eyes.forEach((e) => e.current && (e.current.scale.y = s));
    if (bulb.current) bulb.current.material.color.copy(PINK).multiplyScalar(0.8 + Math.sin(t * 3) * 0.4);
    if (body.current && !typing) body.current.rotation.y = THREE.MathUtils.damp(body.current.rotation.y, x * 0.2, 3, dt);
    arms.forEach((a, i) => {
      if (!a.current) return;
      if (typing) {
        a.current.rotation.x = -1.15 + Math.sin(t * 14 + i * 2.1) * 0.06;
        a.current.rotation.z = (i ? 1 : -1) * -0.18;
      } else {
        a.current.rotation.x = Math.sin(t * 1.2 + i) * 0.06;
        a.current.rotation.z = (i ? 1 : -1) * -0.12 + Math.sin(t * 1.4) * 0.02;
      }
    });
  });

  return (
    <group {...props}>
      <group ref={body}>
        {/* torso */}
        <mesh position={[0, -1.55, 0]}>
          <capsuleGeometry args={[0.62, 0.7, 8, 24]} />
          <meshStandardMaterial {...hoodie} />
        </mesh>
        {/* hoodie collar */}
        <mesh position={[0, -0.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.08, 16, 40]} />
          <meshStandardMaterial {...hoodie} color="#232a42" />
        </mesh>
        {/* chest light */}
        <mesh position={[0, -1.4, 0.63]} rotation={[-0.1, 0, 0]}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshBasicMaterial color={TEAL} toneMapped={false} />
        </mesh>
        <Arm side={-1} armRef={arms[0]} />
        <Arm side={1} armRef={arms[1]} />
        {/* neck */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.3, 24]} />
          <meshStandardMaterial color="#9aa3b8" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      <group ref={head} position={[0, 0, 0]}>
        <RoundedBox args={[1.7, 1.35, 1.35]} radius={0.42} smoothness={6}>
          <meshPhysicalMaterial {...shell} />
        </RoundedBox>
        {/* face screen */}
        <RoundedBox args={[1.36, 0.9, 0.2]} radius={0.12} smoothness={6} position={[0, 0.02, 0.6]}>
          <meshPhysicalMaterial {...visor} />
        </RoundedBox>
        <group ref={pupils}>
          <Eye x={-0.3} eyeRef={eyes[0]} />
          <Eye x={0.3} eyeRef={eyes[1]} />
          {/* smile */}
          <mesh position={[0, -0.2, 0.71]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.12, 0.025, 8, 24, Math.PI]} />
            <meshBasicMaterial color={TEAL} toneMapped={false} />
          </mesh>
        </group>
        {/* headphones */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.88, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]}>
            <mesh>
              <cylinderGeometry args={[0.32, 0.32, 0.18, 32]} />
              <meshStandardMaterial color="#141a2b" roughness={0.4} metalness={0.4} />
            </mesh>
            <mesh position={[0, s * -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.22, 0.035, 12, 32]} />
              <meshBasicMaterial color={PINK} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.12, 0]}>
          <torusGeometry args={[0.9, 0.07, 12, 48, Math.PI]} />
          <meshStandardMaterial color="#141a2b" roughness={0.4} metalness={0.4} />
        </mesh>
        {/* antenna */}
        <mesh position={[0.35, 0.85, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
          <meshStandardMaterial color="#9aa3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh ref={bulb} position={[0.41, 1.07, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={PINK} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

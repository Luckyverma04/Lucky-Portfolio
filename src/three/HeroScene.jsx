import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import Bot from "./Bot";

function Halo() {
  const a = useRef(), b = useRef();
  useFrame((s, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.15;
    if (b.current) b.current.rotation.z -= dt * 0.1;
  });
  return (
    <group position={[0, 0.1, -1.6]}>
      <mesh ref={a}>
        <torusGeometry args={[2.3, 0.014, 8, 200]} />
        <meshBasicMaterial color={[0.7, 2.6, 2.3]} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[0.3, 0.2, 0]}>
        <torusGeometry args={[2.8, 0.008, 8, 160]} />
        <meshBasicMaterial color={[2.4, 0.8, 1.6]} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.4, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.2 + pointer.y * 0.25, 2, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ mobile }) {
  return (
    <>
      <color attach="background" args={["#090c14"]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <spotLight position={[0, 5, -3]} angle={0.6} penumbra={1} intensity={60} color="#a78bfa" />
      <pointLight position={[-4, 1, 2]} intensity={30} color="#5eead4" />
      <pointLight position={[4, -1, 2]} intensity={30} color="#f472b6" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={3} color="#5eead4" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={3} color="#f472b6" position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} />
      </Environment>
      <group position={mobile ? [0, -0.45, 0] : [0, 0.42, 0]} scale={mobile ? 0.46 : 0.8}>
        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.6}>
          <Bot position={[0, 0.7, 0]} />
        </Float>
        <Halo />
        <ContactShadows position={[0, -2.6, 0]} opacity={0.55} scale={8} blur={2.6} far={4} color="#000" />
      </group>
      <Sparkles count={45} scale={[10, 6, 4]} size={2.2} speed={0.35} color="#99f6e4" opacity={0.7} />
      <Rig />
      <EffectComposer multisampling={2}>
        <Bloom mipmapBlur levels={5} luminanceThreshold={1} intensity={1.1} radius={0.7} />
      </EffectComposer>
    </>
  );
}

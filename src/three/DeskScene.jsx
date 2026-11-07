import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import Bot from "./Bot";

const LINES = [
  ["const", " lead = ", "await", " Lead.create(body);"],
  ["router", ".post(", "'/api/enquiry'", ", save);"],
  ["if", " (!user) ", "return", " res.status(401);"],
  ["const", " score = ", "await", " embed(a, b);"],
  ["export", " default ", "function", " App() {"],
  ["  return", " <", "Dashboard", " />;"],
  ["db", ".leads.find({ ", "status", ": 'ACTIVE' })"],
];
const COLORS = ["#f472b6", "#e2e8f0", "#5eead4", "#e2e8f0"];

/** A floating "code editor" panel drawn on a canvas. */
function codeTexture(seed) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 320;
  const x = c.getContext("2d");
  x.fillStyle = "rgba(10,14,24,0.92)"; x.beginPath(); x.roundRect(0, 0, 512, 320, 26); x.fill();
  x.strokeStyle = "rgba(94,234,212,0.6)"; x.lineWidth = 3; x.stroke();
  ["#f87171", "#fbbf24", "#34d399"].forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.arc(30 + i * 24, 28, 7, 0, 7); x.fill(); });
  x.font = "500 22px ui-monospace, Menlo, monospace";
  for (let i = 0; i < 6; i++) {
    const parts = LINES[(i + seed) % LINES.length];
    let px = 28;
    x.fillStyle = "rgba(148,156,178,0.5)"; x.fillText(String(i + 1), px, 78 + i * 38); px += 34;
    parts.forEach((p, k) => { x.fillStyle = COLORS[k]; x.fillText(p, px, 78 + i * 38); px += x.measureText(p).width; });
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function Panel({ seed, ...props }) {
  const tex = useMemo(() => codeTexture(seed), [seed]);
  return (
    <Float speed={1.5} floatIntensity={0.5} rotationIntensity={0.2}>
      <mesh {...props}>
        <planeGeometry args={[1.6, 1]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  );
}

function Screen() {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) ref.current.material.opacity = 0.85 + Math.sin(clock.elapsedTime * 2) * 0.1; });
  return (
    <mesh ref={ref} position={[0, 0.02, -0.035]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[1.3, 0.8]} />
      <meshBasicMaterial color={[2, 0.7, 1.4]} transparent toneMapped={false} />
    </mesh>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, 6.2 + pointer.x * 0.8, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.6 + pointer.y * 0.4, 2, dt);
    camera.lookAt(0, -0.6, 0);
  });
  return null;
}

const dark = { color: "#151b2c", roughness: 0.5, metalness: 0.3 };
const white = { color: "#e9e7f2", roughness: 0.3, metalness: 0.05 };

export default function DeskScene() {
  return (
    <>
      <color attach="background" args={["#090c14"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.3} />
      <pointLight position={[0, 0.2, -0.3]} intensity={3} color="#f472b6" distance={3} />
      <pointLight position={[-3, 1, -2]} intensity={20} color="#5eead4" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#5eead4" position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#f472b6" position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} />
      </Environment>

      <group position={[0, 0.2, 0]}>
        {/* the bot sits behind the desk and types */}
        <Bot typing follow={false} position={[0, 0.45, -0.95]} scale={0.8} />
        {/* chair */}
        <mesh position={[0, -1.25, -1]}><boxGeometry args={[1.1, 0.12, 1]} /><meshStandardMaterial {...white} /></mesh>
        <mesh position={[0, -0.6, -1.5]} rotation={[-0.1, 0, 0]}><boxGeometry args={[1.1, 1.3, 0.1]} /><meshStandardMaterial {...white} /></mesh>
        <mesh position={[0, -1.9, -1]}><cylinderGeometry args={[0.06, 0.06, 1.2, 12]} /><meshStandardMaterial {...dark} /></mesh>

        {/* desk */}
        <RoundedBox args={[3.4, 0.1, 1.5]} radius={0.04} position={[0, -0.55, 0.15]}><meshStandardMaterial {...white} /></RoundedBox>
        {[-1.5, 1.5].flatMap((x) => [-0.4, 0.7].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -1.55, z]}><cylinderGeometry args={[0.04, 0.04, 2, 12]} /><meshStandardMaterial {...dark} /></mesh>
        )))}

        {/* laptop, screen facing the bot */}
        <group position={[0, -0.48, 0.3]}>
          <RoundedBox args={[1.45, 0.05, 0.95]} radius={0.02}><meshStandardMaterial color="#9aa3b8" metalness={0.8} roughness={0.25} /></RoundedBox>
          <group position={[0, 0.02, 0.45]} rotation={[-0.25, 0, 0]}>
            <group position={[0, 0.45, 0]}>
              <RoundedBox args={[1.45, 0.92, 0.05]} radius={0.02}><meshStandardMaterial color="#9aa3b8" metalness={0.8} roughness={0.25} /></RoundedBox>
              <Screen />
              {/* glowing logo on the back */}
              <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.09, 32]} /><meshBasicMaterial color={[0.8, 2.6, 2.3]} toneMapped={false} /></mesh>
            </group>
          </group>
        </group>
        {/* mug */}
        <mesh position={[1.15, -0.37, 0.4]}><cylinderGeometry args={[0.13, 0.11, 0.28, 24]} /><meshStandardMaterial color="#5eead4" roughness={0.4} /></mesh>
        {/* desk lamp light pool */}
        <mesh position={[-1.1, -0.49, 0.3]}><cylinderGeometry args={[0.25, 0.25, 0.02, 24]} /><meshStandardMaterial {...dark} /></mesh>

        <Panel seed={0} position={[-1.9, 1.3, -1.4]} rotation={[0, 0.5, 0]} />
        <Panel seed={3} position={[1.9, 1.6, -1.2]} rotation={[0, -0.4, 0]} scale={0.8} />

        <ContactShadows position={[0, -2.56, 0]} opacity={0.6} scale={8} blur={2.4} far={4} />
      </group>
      <Rig />
      <EffectComposer multisampling={2}>
        <Bloom mipmapBlur levels={5} luminanceThreshold={1} intensity={0.9} radius={0.6} />
      </EffectComposer>
    </>
  );
}

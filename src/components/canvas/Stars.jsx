import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = () => {
  const groupRef = useRef();
  const { invalidate } = useThree();

  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(3000), {
      radius: 1.2,
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!groupRef.current) return;

      groupRef.current.rotation.x -= 0.002;
      groupRef.current.rotation.y -= 0.0015;

      invalidate();
    }, 80);

    return () => clearInterval(interval);
  }, [invalidate]);

  return (
    <group
      ref={groupRef}
      rotation={[0, 0, Math.PI / 4]}
    >
      <Points
        positions={sphere}
        stride={3}
        frustumCulled
      >
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[-1] w-full h-full">
      <Canvas
        frameloop="demand"
        dpr={1}
        camera={{
          position: [0, 0, 1],
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
      >
        <Stars />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
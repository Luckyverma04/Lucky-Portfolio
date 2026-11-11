import { useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";

/** If the frame rate drops, render at pixel ratio 1 so the page stays smooth. */
export default function Quality() {
  const setDpr = useThree((s) => s.setDpr);
  return <PerformanceMonitor onDecline={() => setDpr(1)} flipflops={1} />;
}

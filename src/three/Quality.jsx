import { useState } from "react";
import { useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// Phones and low-power laptops start without the glow pass.
function lowEnd() {
  try {
    const cores = navigator.hardwareConcurrency || 8;
    const mem = navigator.deviceMemory || 8;
    const phone = window.matchMedia("(max-width: 767px)").matches;
    return cores <= 4 || mem <= 4 || (phone && cores <= 6);
  } catch { return false; }
}

/**
 * Glow (bloom) when the device can afford it. If the frame rate drops, the glow is switched off
 * and the pixel ratio goes down to 1, so the page stays smooth.
 */
export default function Quality({ intensity = 1 }) {
  const [hq, setHq] = useState(() => !lowEnd());
  const setDpr = useThree((s) => s.setDpr);
  return (
    <>
      <PerformanceMonitor onDecline={() => { setHq(false); setDpr(1); }} flipflops={1} />
      {hq && (
        <EffectComposer multisampling={2}>
          <Bloom mipmapBlur levels={5} luminanceThreshold={1} intensity={intensity} radius={0.7} />
        </EffectComposer>
      )}
    </>
  );
}

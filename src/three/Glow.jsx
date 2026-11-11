import { useMemo } from "react";
import * as THREE from "three";

let tex;
function glowTexture() {
  if (tex) return tex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  tex = new THREE.CanvasTexture(c);
  return tex;
}

/**
 * A soft light blob drawn as one sprite. Cheap stand-in for a full-screen bloom pass:
 * the glow is only computed where it is, not for every pixel on the screen.
 */
export default function Glow({ color = "#5eead4", size = 1, opacity = 0.6, ...props }) {
  const map = useMemo(glowTexture, []);
  return (
    <sprite scale={[size, size, 1]} renderOrder={-1} {...props}>
      <spriteMaterial map={map} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  );
}

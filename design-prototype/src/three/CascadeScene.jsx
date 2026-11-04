import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { usePerf } from "../perf/PerfProvider.jsx";

function Frames({ progressRef }) {
  const group = useRef(null);
  const { low } = usePerf();
  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    const progress = progressRef?.current ?? 0;
    node.position.z = progress * 1.4;
    node.rotation.y = (progress - 0.5) * 0.2;
    if (low) state.invalidate();
  });

  return (
    <group ref={group}>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} position={[0, 0, -index * 1.15]}>
          <boxGeometry args={[2.4 - index * 0.28, 1.5 - index * 0.16, 0.04]} />
          <meshBasicMaterial color={index === 3 ? "#FF3E00" : "#8E9AA8"} wireframe />
        </mesh>
      ))}
    </group>
  );
}

export default function CascadeScene({ onReady, progressRef }) {
  const { low } = usePerf();
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.35]}
      frameloop="always"
      gl={{ antialias: !low, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#08090C", 1);
        onReady?.();
      }}
    >
      <Frames progressRef={progressRef} />
    </Canvas>
  );
}

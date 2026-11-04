import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { usePerf } from "../perf/PerfProvider.jsx";

const COLORS = ["#8E9AA8", "#FF3E00", "#FF7700", "#31E3AC"];

function Rig({ focus }) {
  const group = useRef(null);
  const target = useRef(0);
  const { low } = usePerf();

  useEffect(() => {
    target.current = focus * (Math.PI / 2);
  }, [focus]);

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += (target.current - node.rotation.y) * 0.08;
    node.rotation.x = state.pointer.y * 0.12;
    if (low) state.invalidate();
  });

  return (
    <group ref={group}>
      {COLORS.map((color, index) => {
        const angle = (index / COLORS.length) * Math.PI * 2;
        const x = Math.sin(angle) * 1.15;
        const z = Math.cos(angle) * 1.15;
        return (
          <mesh key={color} position={[x, 0, z]}>
            {index === 0 && <icosahedronGeometry args={[0.34, 0]} />}
            {index === 1 && <boxGeometry args={[0.5, 0.5, 0.5]} />}
            {index === 2 && <coneGeometry args={[0.32, 0.62, 4]} />}
            {index === 3 && <torusGeometry args={[0.28, 0.08, 12, 24]} />}
            <meshStandardMaterial color={color} metalness={0.55} roughness={0.32} emissive={color} emissiveIntensity={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function VenueScene({ onReady, focus = 0 }) {
  const { low } = usePerf();
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.5]}
      frameloop={low ? "demand" : "always"}
      gl={{ antialias: !low, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 3.4], fov: 42 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor("#0D1117", 1);
        onReady?.();
        invalidate();
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 2]} intensity={2} />
      <Rig focus={focus} />
    </Canvas>
  );
}

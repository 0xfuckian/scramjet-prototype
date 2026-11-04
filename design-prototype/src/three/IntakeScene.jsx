import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { usePerf } from "../perf/PerfProvider.jsx";

function Inlet() {
  const group = useRef(null);
  const { low } = usePerf();
  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    const targetY = state.pointer.x * 0.45;
    const targetX = state.pointer.y * 0.18;
    node.rotation.y += (targetY - node.rotation.y) * 0.08;
    node.rotation.x += (targetX - node.rotation.x) * 0.08;
    if (low) state.invalidate();
  });

  return (
    <group ref={group} position={[0.1, 0, 0]}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[-0.7 + index * 0.55, 0.15 - index * 0.05, 0]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.22, 1.55 - index * 0.18, 0.42]} />
          <meshStandardMaterial
            color={index === 2 ? "#FF3E00" : index === 1 ? "#C5D0DC" : "#6E7C8C"}
            emissive={index === 2 ? "#FF3E00" : "#000000"}
            emissiveIntensity={index === 2 ? 0.35 : 0}
            metalness={0.72}
            roughness={0.28}
          />
        </mesh>
      ))}
      <mesh position={[0, -0.15, 0.28]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.1, 0.03, 0.03]} />
        <meshStandardMaterial color="#FF7700" emissive="#FF7700" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export default function IntakeScene({ onReady }) {
  const { low, post } = usePerf();
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.5]}
      frameloop={low ? "demand" : "always"}
      gl={{ antialias: !low, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 3.1], fov: 40 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor("#0D1117", 1);
        onReady?.();
        invalidate();
      }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[2.4, 2.2, 3]} intensity={2.4} />
      <Inlet />
      {post && (
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom intensity={0.35} luminanceThreshold={0.25} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}

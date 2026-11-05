import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { usePerf } from "../perf/PerfProvider.jsx";

const STAGE_COLORS = ["#8E9AA8", "#38BDF8", "#FF7700", "#FF3E00"];

function ChamberRing({ index, stageColor }) {
  const scale = 1 - index * 0.14;
  return (
    <group position={[0, 0, -index * 1.25]}>
      {/* Outer Hexagonal Frame */}
      <mesh>
        <ringGeometry args={[1.5 * scale, 1.58 * scale, 6]} />
        <meshBasicMaterial color="#1C2533" wireframe={false} />
      </mesh>
      {/* Inner Accent Ring */}
      <mesh position={[0, 0, 0.02]}>
        <ringGeometry args={[1.35 * scale, 1.4 * scale, 6]} />
        <meshBasicMaterial color={stageColor} wireframe />
      </mesh>
      {/* Structural Struts */}
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[3.1 * scale, 0.02, 0.02]} />
        <meshBasicMaterial color="#1C2533" />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[3.1 * scale, 0.02, 0.02]} />
        <meshBasicMaterial color="#1C2533" />
      </mesh>
    </group>
  );
}

function PlasmaCore({ progressRef }) {
  const meshRef = useRef(null);
  const { low } = usePerf();
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const progress = progressRef?.current ?? 0;
    meshRef.current.rotation.z += delta * (0.8 + progress * 2.0);
    meshRef.current.position.z = -1.8 + progress * 2.5;
    if (low) state.invalidate();
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1.8]}>
      <octahedronGeometry args={[0.28, 0]} />
      <meshStandardMaterial
        color="#FF3E00"
        emissive="#FF7700"
        emissiveIntensity={1.2}
        wireframe
      />
    </mesh>
  );
}

function Frames({ progressRef }) {
  const group = useRef(null);
  const { low } = usePerf();

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    const progress = progressRef?.current ?? 0;
    // Camera-tunnel flythrough effect
    node.position.z = progress * 2.2;
    node.rotation.y = (progress - 0.5) * 0.28;
    node.rotation.x = state.pointer.y * 0.08;
    if (low) state.invalidate();
  });

  return (
    <group ref={group}>
      {[0, 1, 2, 3].map((index) => (
        <ChamberRing
          key={index}
          index={index}
          stageColor={STAGE_COLORS[index]}
        />
      ))}
      <PlasmaCore progressRef={progressRef} />
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
      camera={{ position: [0, 0, 4.2], fov: 44 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#08090C", 1);
        onReady?.();
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 2, 4]} intensity={1.5} />
      <Frames progressRef={progressRef} />
    </Canvas>
  );
}
